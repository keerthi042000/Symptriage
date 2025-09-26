from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from torch import nn
import torch
import pickle
import pandas as pd
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware
# Welcome to DBOS!
# This is a template application built with DBOS and FastAPI.

app = FastAPI()
# DBOS(fastapi=app)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

with open('app/RandomForest.pkl', 'rb') as rf_file:
    random_forest_model = pickle.load(rf_file)

with open('app/knn_model.pkl', 'rb') as knn_file:
    knn_model = pickle.load(knn_file)

with open('app/MLPmodel.pkl', 'rb') as mlp_file:
    mlp_model = pickle.load(mlp_file)

with open('app/XGBoost.pkl', 'rb') as xgb_file:
    xgboost_model = pickle.load(xgb_file)

with open('app/label_encoder.pkl', 'rb') as le_file:
    label_encoder = pickle.load(le_file)

with open('app/MLPscaler.pkl', 'rb') as le_file:
    scaler = pickle.load(le_file)

# Define input schema using Pydantic
class SymptomInput(BaseModel):
    symptoms: dict
symptom_columns = ['itching', 'shivering', 'chills', 'acidity', 'vomiting', 'fatigue', 'anxiety', 'restlessness', 'lethargy', 'cough', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'nausea', 'constipation', 'diarrhoea', 'malaise', 'phlegm', 'congestion', 'dizziness', 'cramps', 'bruising', 'obesity', 'unsteadiness', 'depression', 'irritability', 'polyuria', 'coma', 'palpitations', 'blackheads', 'scurring', 'blister', 'skin rash', 'pus filled pimples', 'mood swings', 'weight loss', 'fast heart rate', 'excessive hunger', 'muscle weakness', 'abnormal menstruation', 'muscle wasting', 'patches in throat', 'high fever', 'extra marital contacts', 'yellowish skin', 'loss of appetite', 'abdominal pain', 'yellowing of eyes', 'chest pain', 'loss of balance', 'lack of concentration', 'blurred and distorted vision', 'drying and tingling lips', 'slurred speech', 'stiff neck', 'swelling joints', 'painful walking', 'dark urine', 'yellow urine', 'receiving blood transfusion', 'receiving unsterile injections', 'visual disturbances', 'burning micturition', 'bladder discomfort', 'foul smell of urine', 'continuous feel of urine', 'irregular sugar level', 'increased appetite', 'joint pain', 'skin peeling', 'small dents in nails', 'inflammatory nails', 'swelling of stomach', 'distention of abdomen', 'history of alcohol consumption', 'fluid overload', 'pain during bowel movements', 'pain in anal region', 'bloody stool', 'irritation in anus', 'acute liver failure', 'stomach bleeding', 'back pain', 'weakness in limbs', 'neck pain', 'mucoid sputum', 'mild fever', 'muscle pain', 'family history', 'continuous sneezing', 'watering from eyes', 'rusty sputum', 'weight gain', 'puffy face and eyes', 'enlarged thyroid', 'brittle nails', 'swollen extremeties', 'swollen legs', 'prominent veins on calf', 'stomach pain', 'spinning movements', 'sunken eyes', 'silver like dusting', 'swelled lymph nodes', 'blood in sputum', 'swollen blood vessels', 'toxic look (typhos)', 'belly pain', 'throat irritation', 'redness of eyes', 'sinus pressure', 'runny nose', 'loss of smell', 'passage of gases', 'cold hands and feets', 'weakness of one body side', 'altered sensorium', 'nodal skin eruptions', 'red sore around nose', 'yellow crust ooze', 'ulcers on tongue', 'spotting  urination', 'pain behind the eyes', 'red spots over body', 'internal itching', 'movement stiffness', 'knee pain', 'hip joint pain', 'dischromic  patches']

@app.post("/predict")
def predict(symptoms: SymptomInput):
    try:
        # Parse user input
        user_input = symptoms.symptoms
        user_df = pd.DataFrame([user_input], columns=symptom_columns).fillna(0)
        input_data = user_df.values

        # Random Forest prediction
        rf_pred = random_forest_model.predict(input_data)[0]

        # KNN prediction
        knn_pred = knn_model.predict(input_data)[0]

        # MLP prediction
        input_scaled = scaler.transform(input_data)
        input_tensor = torch.tensor(input_scaled, dtype=torch.float32)
        mlp_model.eval()
        output = mlp_model(input_tensor)
        probabilities = torch.softmax(output, dim=1)
        _, mlp_pred = torch.max(probabilities, 1)

        # XGBoost prediction
        xgb_pred = xgboost_model.predict(input_data)[0]

        # Decode predictions
        rf_label = label_encoder.inverse_transform([rf_pred])[0]
        knn_label = label_encoder.inverse_transform([knn_pred])[0]
        mlp_label = label_encoder.inverse_transform([mlp_pred])[0]
        xgb_label = label_encoder.inverse_transform([xgb_pred])[0]

        # Majority voting
        predictions = [rf_label, knn_label, mlp_label, xgb_label]
        majority_label = Counter(predictions).most_common(1)[0][0]

        return {
            "predictions": {
                "Random Forest": rf_label,
                "KNN": knn_label,
                "MLP": mlp_label,
                "XGBoost": xgb_label,
            },
            "majority_prediction": majority_label,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Symptriage FastAPI Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# @app.get("/")
# def readme() -> HTMLResponse:
#     readme = """
#         <!DOCTYPE html>
#         <html lang="en">
#         <head>
#             <title>Welcome to DBOS!</title>
#             <link rel="icon" href="https://dbos-blog-posts.s3.us-west-1.amazonaws.com/live-demo/favicon.ico" type="image/x-icon">
#             <script src="https://cdn.tailwindcss.com"></script>
#         </head>
#         <body class="font-sans text-gray-800 p-6 max-w-2xl mx-auto">
#             <h1 class="text-xl font-semibold mb-4">Welcome to DBOS!</h1>
#             <p class="mb-4">
#                 This is a template built with DBOS and FastAPI. Visit <code class="bg-gray-100 px-1 rounded"><a href="/predict" target="_blank" class="text-blue-600 hover:underline">/hello</a></code> to see a "Hello, World!" message.
#             </p>
#             <p class="mb-4">
#                 To start building, edit <code class="bg-gray-100 px-1 rounded">app/main.py</code>, commit your changes, then visit the <a href="https://console.dbos.dev/applications" target="_blank" class="text-blue-600 hover:underline">cloud console</a> to redeploy your app.
#             </p>
#             <p class="mb-4">
#                 To learn how to build crashproof apps with DBOS, visit the <a href="https://docs.dbos.dev/python/programming-guide" target="_blank" class="text-blue-600 hover:underline">docs</a>!
#             </p>
#         </body>
#         </html>
#         """
#     return HTMLResponse(readme)
