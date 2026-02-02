import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  # NEW: Added for SaaS connectivity

# 1. Initialize the App
app = FastAPI(title="Ethical AI Guardrail SaaS API")

# 2. NEW: Enable CORS
# This allows your frontend (website) to talk to this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",

    "bias-detection-api-oqhs-git-main-maxs-projects-11a8ae22.vercel.app"],  # For production, change this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load the Model
model = joblib.load("fair_model.pkl")

# 4. Define Data Structure
class UserData(BaseModel):
    age: int
    education_num: int
    sex: int  # 1 for Male, 0 for Female
    hours_per_week: int

# 5. Root Endpoint (Home Page Fix)
@app.get("/")
def home():
    return {
        "status": "Active",
        "service": "Ethical AI Guardrail",
        "documentation": "/docs"
    }

# 6. Prediction & Audit Logic
@app.post("/predict")
def predict(user: UserData):
    # Convert input to DataFrame
    df = pd.DataFrame([user.dict()])
    
    # Get Prediction
    prediction = model.predict(df)[0]
    decision = "Approved" if prediction == 1 else "Denied"
    
    # ETHICAL GUARDRAIL LOGIC
    # If the user is Female (0) and denied, we trigger an audit flag
    audit_msg = "Safe"
    if user.sex == 0 and prediction == 0:
        audit_msg = "Ethical Audit Required: Potential Gender Bias Detected."
    
    return {
        "decision": decision,
        "ethical_audit": audit_msg,
        "raw_score": int(prediction)
    }