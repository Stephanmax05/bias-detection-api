from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import pydantic

# 1. Initialize FastAPI
app = FastAPI(title="Ethical AI Guardrail API")

# 2. ENABLE CORS (The "Secret Handshake")
# This allows your Next.js frontend to communicate with this Render API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load the Model
# Ensure this filename matches the one in your folder exactly
try:
    model = joblib.load("fair_model.pkl")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# 4. Define the Input Data Structure
class ApplicantData(pydantic.BaseModel):
    age: int
    education_num: int
    sex: int  # 1 for Male, 0 for Female
    hours_per_week: int

# 5. The Prediction & Audit Logic
@app.post("/predict")
def predict_bias(data: ApplicantData):
    # Convert input into a DataFrame for the model
    input_df = pd.DataFrame([data.dict()])
    
    # Get prediction (0 or 1)
    prediction = model.predict(input_df)[0]
    decision = "Approved" if prediction == 1 else "Denied"
    
    # Ethical Audit Logic (Simple Example)
    # If the user is female (sex=0) and was denied, we flag it for audit
    audit_status = "✅ Audit Passed: No bias detected."
    if data.sex == 0 and prediction == 0:
        audit_status = "⚠️ Bias Detected: Potential Gender Disparity Flagged."
    elif data.age < 25 and prediction == 0:
        audit_status = "⚠️ Bias Detected: Potential Age Discrimination Flagged."

    return {
        "decision": decision,
        "ethical_audit": audit_status,
        "raw_score": int(prediction)
    }

# 6. Home Route (To confirm service is live)
@app.get("/")
def home():
    return {
        "status": "Active",
        "service": "Ethical AI Guardrail",
        "documentation": "/docs"
    }