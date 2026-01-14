export const getRole = () => localStorage.getItem("role");

export const isPatient = () => getRole() === "patient";
export const isDoctor = () => getRole() === "doctor";

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
