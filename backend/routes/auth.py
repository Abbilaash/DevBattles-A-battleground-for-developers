from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo, app

auth_bp = Blueprint("auth", __name__)

SECRET_KEY = "your_secret_key"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SECURE"] = False  # set to true in production

# Register
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    print(data)
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing credentials"}), 400

    user = mongo.db.users.find_one({"email": data["email"]})
    if not data["email"].endswith("@psgtech.ac.in"):
        return jsonify({"error": "Use Official Email Only"}), 400
    if user:
        return jsonify({"error": "User already exists"}), 409

    user_data = {
        "email": data["email"],
        "password": generate_password_hash(data["password"]),
        "role": "user"
    }
    mongo.db.users.insert_one(user_data)
    return jsonify({"message": "User registered successfully"}), 201

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print(data)
    user = mongo.db.users.find_one({"email": data["email"]})

    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    # Store user session
    session["user_id"] = str(user["_id"])
    session["role"] = user["role"]
    session["email"] = user["email"]

    return jsonify({"message": "Login successful", "role": user["role"]})





@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})


@auth_bp.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Test successful"}), 200
