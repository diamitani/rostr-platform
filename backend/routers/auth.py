"""Auth API — user registration and login with API keys."""

import secrets
import time
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from auth_utils import _users, _sessions

router = APIRouter()


# ── Request / Response models ───────────────────────────────────

class RegisterRequest(BaseModel):
    username: str

class RegisterResponse(BaseModel):
    user_id: str
    username: str
    api_key: str
    message: str

class LoginRequest(BaseModel):
    api_key: str

class LoginResponse(BaseModel):
    user_id: str
    username: str
    session_token: str


# ── Endpoints ───────────────────────────────────────────────────

@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(req: RegisterRequest):
    """Create a new user and return an API key."""
    if not req.username or not req.username.strip():
        raise HTTPException(status_code=400, detail="Username is required")

    username = req.username.strip()

    # Check for duplicate username
    for user in _users.values():
        if user["username"].lower() == username.lower():
            raise HTTPException(status_code=409, detail="Username already exists")

    user_id = str(uuid.uuid4())
    api_key = f"rostr_{secrets.token_hex(24)}"

    _users[user_id] = {
        "id": user_id,
        "username": username,
        "api_key": api_key,
        "created_at": time.time(),
    }

    # Also persist to SQLite
    try:
        import sys, os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
        from db.database import get_db
        conn = get_db()
        conn.execute(
            "INSERT INTO users (id, username, api_key, created_at) VALUES (?, ?, ?, ?)",
            (user_id, username, api_key, time.time()),
        )
        conn.commit()
        conn.close()
    except Exception:
        pass  # In-memory store is the source of truth for MVP

    return RegisterResponse(
        user_id=user_id,
        username=username,
        api_key=api_key,
        message="User registered. Save your API key — it won't be shown again.",
    )


@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    """Validate API key and return a session token."""
    from auth_utils import _get_user_by_api_key

    user = _get_user_by_api_key(req.api_key)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid API key")

    session_token = secrets.token_hex(32)
    _sessions[session_token] = {
        "user_id": user["id"],
        "username": user["username"],
        "created_at": time.time(),
    }

    return LoginResponse(
        user_id=user["id"],
        username=user["username"],
        session_token=session_token,
    )


@router.get("/me")
def get_current_user_info(user_id: str = None):
    """Get current user info (placeholder for token-based lookup)."""
    return {"note": "Use the Bearer token from /auth/login on protected routes"}
