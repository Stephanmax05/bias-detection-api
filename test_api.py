import requests

url = "http://127.0.0.1:8000/predict"

# Twin profiles (Everything same except sex)
profiles = [
    {"name": "Female Applicant", "data": {"age": 35, "education_num": 13, "sex": 0, "hours_per_week": 40}},
    {"name": "Male Applicant", "data": {"age": 35, "education_num": 13, "sex": 1, "hours_per_week": 40}}
]

print("--- STARTING LIVE ETHICAL AUDIT ---")
for p in profiles:
    response = requests.post(url, json=p['data']).json()
    print(f"\nResults for {p['name']}:")
    print(f"Decision: {response['decision']}")
    print(f"Audit Note: {response['ethical_audit']}")