from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_session import Session


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://23n201:Abbi%402005@devbattle.d1elr.mongodb.net/DevBattle?retryWrites=true&w=majority"

app.config["SECRET_KEY"] = "your_secret_key"
app.config["SESSION_TYPE"] = "filesystem"  # Stores session on the server
Session(app)

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

mongo = PyMongo(app)
db = mongo.db

# Import routes
from routes.auth import auth_bp
from routes.admin import admin_bp
# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(admin_bp, url_prefix="/admin")