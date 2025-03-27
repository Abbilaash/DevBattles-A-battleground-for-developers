from pymongo import MongoClient

MONGO_URI = "mongodb+srv://23n201:Abbi%402005@devbattle.d1elr.mongodb.net/devbattle?retryWrites=true&w=majority"

try:
    client = MongoClient(MONGO_URI)
    db = client["devbattle"]
    print("✅ MongoDB Connection Successful!")
    print("🔹 Databases:", client.list_database_names())
except Exception as e:
    print("❌ MongoDB Connection Failed:", e)
