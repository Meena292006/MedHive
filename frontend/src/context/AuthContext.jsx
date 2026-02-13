import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Create axios instance with interceptor
const api = axios.create({
    baseURL: "http://localhost:5055"
});

// Add request interceptor to automatically attach token
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pendingRole = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken();
                    console.log("Firebase user authenticated, calling backend...");

                    const res = await axios.post("http://localhost:5055/api/auth/register-or-login", {
                        token,
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
                        role: pendingRole.current
                    });

                    pendingRole.current = null; // Clear after use

                    console.log("Backend response:", res.data);

                    if (res.data.user) {
                        setUser(firebaseUser);
                        setRole(res.data.user.role);
                        setError(null);
                        console.log("User logged in with role:", res.data.user.role);
                    } else if (res.data.newUser) {
                        // New user, metadata stored but role not yet selected
                        setUser(firebaseUser);
                        setRole(null);
                        setError(null);
                        console.log("New user detected, role selection required");
                    }
                } catch (error) {
                    console.error("Backend auth error:", error);
                    console.error("Error response:", error.response?.data);

                    // More specific error messages
                    let errorMessage = "Failed to authenticate";
                    if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.message) {
                        errorMessage = error.message;
                    } else if (!navigator.onLine) {
                        errorMessage = "No internet connection";
                    }

                    setUser(null);
                    setRole(null);
                    setError(errorMessage);
                }
            } else {
                setUser(null);
                setRole(null);
                setError(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithGoogle = async () => {
        try {
            setError(null);
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google login failed:", error);
            const errorMessage = error.code === 'auth/popup-closed-by-user'
                ? 'Sign-in cancelled'
                : error.message || 'Google sign-in failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Email login failed:", error);
            let errorMessage = "Login failed";

            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address";
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const signUpWithEmail = async (email, password, name, role) => {
        try {
            setError(null);
            pendingRole.current = role; // Store role for onAuthStateChanged
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with name
            if (name) {
                await updateProfile(userCredential.user, { displayName: name });
            }

        } catch (error) {
            console.error("Email signup failed:", error);
            let errorMessage = "Sign up failed";

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email already in use";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address";
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
            setError("Logout failed");
            throw error;
        }
    };

    const selectRole = async (selectedRole) => {
        if (!user) return;
        try {
            setError(null);
            const token = await user.getIdToken();
            const res = await axios.post("http://localhost:5055/api/auth/register-or-login", {
                token,
                role: selectedRole,
                uid: user.uid,
                email: user.email,
                name: user.displayName
            });
            if (res.data.user) {
                setRole(res.data.user.role);
            }
        } catch (error) {
            console.error("Role selection failed:", error);
            setError(error.response?.data?.message || "Role selection failed");
            throw error;
        }
    };

    const value = {
        user,
        role,
        loading,
        error,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        selectRole,
        api // Export configured axios instance
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
