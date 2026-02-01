from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib # Used to save/load your trained model

# 1. Initialize the API
app = FastAPI(title="Ethical AI Guardrail")

# 2. Define what a 'Request' looks like (The input data)
class ApplicantData(BaseModel):
    age: int
    education_num: int
    sex: int 
    hours_per_week: int

# --- LOAD YOUR MODEL ---
# (Note: You'll need to save your 'fair_model' from the previous script using joblib.dump)
# For now, let's assume it's loaded.
# model = joblib.load("fair_model.pkl")

@app.post("/predict")
async def predict_with_guardrail(data: ApplicantData):
    # Convert input to DataFrame
    input_df = pd.DataFrame([data.dict()])
    
    # --- THE GUARDRAIL CHECK ---
    # In a real guardrail, we check if the input features are 'Protected'
    # Or we check the prediction against our fairness threshold.
    
    # 1. Mock Prediction (Replace with model.predict)
    # prediction = model.predict(input_df)[0]
    prediction = 1 # Mocking an 'Approved' status
    
    # 2. The Ethical Logic
    # If the model is known to have a 6% flip rate for women, 
    # the guardrail might flag this specific request for manual review.
    if data.sex == 0: # If applicant is female
        audit_note = "High Fairness Sensitivity: Manual Review Recommended."
    else:
        audit_note = "Standard Processing."

    return {
        "status": "Green Light" if prediction == 1 else "Denied",
        "fairness_audit": audit_note,
        "raw_prediction": int(prediction)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    import joblib

# Load the model when the API starts
model = joblib.load('fair_model.pkl')

@app.post("/predict")
async def predict_with_guardrail(data: ApplicantData):
    # Convert incoming JSON to a format the model understands
    input_data = [[data.age, data.education_num, data.sex, data.hours_per_week]]
    
    # Get the real AI prediction
    prediction = model.predict(input_data)[0]
    
    # Apply the Ethical Guardrail
    status = "Approved" if prediction == 1 else "Denied"
    
    # Logic: If the model denies a woman, we flag it for 'Fairness Review'
    # because our Red-Teaming found bias earlier.
    audit_flag = False
    if data.sex == 0 and prediction == 0:
        audit_flag = True
        
    return {
        "decision": status,
        "requires_manual_fairness_review": audit_flag,
        "api_version": "v1.0-redteamed"
    }