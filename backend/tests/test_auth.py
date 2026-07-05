from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_and_login_flow():
    payload = {"email": "demo@example.com", "password": "secret123"}

    register_response = client.post("/auth/register", json=payload)
    assert register_response.status_code == 201

    login_response = client.post("/auth/login", json=payload)
    assert login_response.status_code == 200
    body = login_response.json()
    assert body["user"]["email"] == payload["email"]
    assert body["token"]
