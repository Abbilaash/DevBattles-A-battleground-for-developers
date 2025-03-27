from flask import Blueprint, request, jsonify, session
from bson.objectid import ObjectId
from app import mongo
from werkzeug.security import check_password_hash
import random
import datetime
import string
from flask_cors import cross_origin

admin_bp = Blueprint("admin", __name__)

session = {}

@admin_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({"email": data["email"]})

    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    if user["role"] != "admin":
        return jsonify({"error": "Unauthorized access"}), 403

    session["user_id"] = data["email"].split("@")[0]
    session["role"] = "admin"
    session["email"] = user["email"]

    return jsonify({"message": "Admin login successful", "role": user["role"]})


# Ensure only admin access
def admin_required():
    if "user_id" not in session or session["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

# Fetch Admin's Competitions
@admin_bp.route("/competitions", methods=["GET"])
def get_admin_competitions():
    if "user_id" not in session:
        return jsonify({"error": "Session missing"}), 401
    
    admin_id = session["user_id"]
    competitions = list(mongo.db.competitions.find({"organizer_id": admin_id}))

    return jsonify({"competitions": competitions})


def generate_unique_challenge_id():
    while True:
        challenge_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if not mongo.db.competitions.find_one({"challenge_id": challenge_id}):  # Ensure uniqueness
            return challenge_id

def get_next_event_id():
    last_event = mongo.db.competitions.find_one({}, sort=[("event_id", -1)])
    if last_event and "event_id" in last_event:
        return str(int(last_event["event_id"]) + 1)  # Increment last event_id
    return "1"  # Start from 1 if no events exist
        

# Create a New Competition
@admin_bp.route("/create-challenge", methods=["POST"])
def create_challenge():
    data = request.get_json()

    # Extract required fields
    challenge_name = data.get("challengeName")
    questions = data.get("questions", [])
    
    if not challenge_name or not questions:
        return jsonify({"error": "Challenge name and questions are required"}), 400

    # Insert each question into the questions collection
    question_ids = []
    for q in questions:
        question_data = {
            "title": q["title"],
            "description": q["description"],
            "difficulty": q["difficulty"],
            "tags": q["tags"].split(",") if q["tags"] else [],
            "testCases": q["testCases"],
            "sampleTestCase": q["sampleTestCase"]
        }
        question_id = mongo.db.questions.insert_one(question_data).inserted_id
        question_ids.append(str(question_id))

    # Store the challenge with references to question IDs
    challenge_data = {
        "event_name": challenge_name,
        "event_id": generate_unique_challenge_id(),
        "date": datetime.datetime.utcnow().strftime("%d-%m-%Y"),
        "organizer_id": session["user_id"],
        "status": "upcoming",
        "challenge_id": generate_unique_challenge_id(),
        "winners": []
    }
    challenge_id = mongo.db.competitions.insert_one(challenge_data).inserted_id

    return jsonify({
        "message": "Challenge created successfully!",
        "challenge_id": str(challenge_id)
    }), 201



@admin_bp.route("/dashboard/start/<competition_id>", methods=["POST"])
def start_competition(competition_id):
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight request successful"}), 200
    mongo.db.competitions.update_one(
        {"event_id": competition_id},
        {"$set": {"status": "ongoing"}}
    )
    
    return jsonify({"message": "Competition started successfully!"}), 200


@admin_bp.route("/dashboard/end/<competition_id>", methods=["POST"])
def end_competition(competition_id):
    mongo.db.competitions.update_one(
        {"event_id": competition_id},
        {"$set": {"status": "completed"}}
    )
    return jsonify({"message": "Competition ended successfully!"}), 200






    

# Admin Logout
@admin_bp.route("/logout", methods=["POST"])
def admin_logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})
