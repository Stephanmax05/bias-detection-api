from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import pydantic

# 1. Initialize FastAPI
app = FastAPI(title="Ethical AI Guardrail API")

# 2. ENABLE CORS
# This allows your Next.js frontend to communicate with this Render API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        
"bias-detection-api-oqhs-git-main-maxs-projects-11a8ae22.vercel.app" # Replace with your real Vercel link
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 3. Load the Model
try:
    model = joblib.load("fair_model.pkl")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# 4. Define the Input Data Structure (Web/Python Style)
class ApplicantData(pydantic.BaseModel):
    age: int
    education_num: int
    sex: int 
    hours_per_week: int

# 5. The Prediction & Audit Logic
@app.post("/predict")
def predict_bias(data: ApplicantData):
    # Convert input into a DataFrame
    input_df = pd.DataFrame([data.dict()])
    
    # FIX: Rename columns to match the "Fit" time names (Hyphenated)
    # This solves the ValueError: "Feature names unseen at fit time"
    input_df = input_df.rename(columns={
        "education_num": "education-num",
        "hours_per_week": "hours-per-week"
    })
    
    # Get prediction (0 or 1)
    prediction = model.predict(input_df)[0]
    decision = "Approved" if prediction == 1 else "Denied"
    
    # Ethical Audit Logic
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

# 6. Home Route
@app.get("/")
def home():
    return {
        "status": "Active",
        "service": "Ethical AI Guardrail",
        "documentation": "/docs"
    }