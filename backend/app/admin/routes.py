from flask import jsonify, request
from . import admin_bp

# Sample data
users = [
    {"id": 1, "username": "admin", "role": "administrator", "score": 150, "password": "admin123"},
    {"id": 2, "username": "john_dev", "role": "developer", "score": 120, "password": "john123"},
    {"id": 3, "username": "sara_test", "role": "tester", "score": 90, "password": "sara123"}
]

challenges = [
    {
        "id": 1,
        "title": "API Integration Challenge",
        "difficulty": "medium",
        "points": 50,
        "participants": 25
    },
    {
        "id": 2,
        "title": "Database Optimization",
        "difficulty": "hard",
        "points": 100,
        "participants": 15
    }
]

leaderboard = [
    {"username": "admin", "total_points": 450, "challenges_completed": 8},
    {"username": "john_dev", "total_points": 380, "challenges_completed": 6},
    {"username": "sara_test", "total_points": 290, "challenges_completed": 5}
]

@admin_bp.route("/", methods=["GET"])
def admin_home():
    return jsonify({
        "message": "Admin Panel is working!",
        "endpoints": [
            "/admin/users",
            "/admin/challenges",
            "/admin/leaderboard",
            "/admin/stats"
        ]
    })

@admin_bp.route("/users", methods=["GET"])
def get_users():
    return jsonify({
        "status": "success",
        "data": users,
        "count": len(users)
    })

@admin_bp.route("/challenges", methods=["GET"])
def get_challenges():
    return jsonify({
        "status": "success",
        "data": challenges,
        "count": len(challenges)
    })

@admin_bp.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    return jsonify({
        "status": "success",
        "data": leaderboard,
        "last_updated": "2024-03-15"
    })

@admin_bp.route("/stats", methods=["GET"])
def get_stats():
    return jsonify({
        "status": "success",
        "data": {
            "total_users": len(users),
            "total_challenges": len(challenges),
            "active_challenges": 2,
            "completed_challenges": 45,
            "total_points_awarded": 2500,
            "platform_stats": {
                "daily_active_users": 28,
                "weekly_active_users": 156,
                "average_completion_rate": 68.5
            }
        }
    })

@admin_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = next((user for user in users if user["id"] == user_id), None)
    if user:
        return jsonify({
            "status": "success",
            "data": user
        })
    return jsonify({
        "status": "error",
        "message": "User not found"
    }), 404

@admin_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({
            "status": "error",
            "message": "Username and password are required"
        }), 400
    
    username = data.get('username')
    password = data.get('password')
    
    user = next((user for user in users if user["username"] == username and user["password"] == password), None)
    
    if user:
        return jsonify({
            "status": "success",
            "data": {
                "id": user["id"],
                "username": user["username"],
                "role": user["role"],
                "token": f"sample_token_{user['username']}"  # In production, use proper JWT token
            },
            "message": "Login successful"
        })
    
    return jsonify({
        "status": "error",
        "message": "Invalid username or password"
    }), 401 