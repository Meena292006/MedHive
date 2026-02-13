import requests
url = "http://localhost:5055/api/medalert/triage"
data = {"symptoms": "chest pain", "patientName": "Antigravity"}
try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
