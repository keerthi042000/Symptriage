from flask import Flask, request, jsonify
import pickle
import pandas as pd
from collections import Counter
from torch import nn
import torch
app = Flask(__name__)

class MLPModel(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(MLPModel, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

# Load the trained models
with open('RandomForest.pkl', 'rb') as rf_file:
    random_forest_model = pickle.load(rf_file)

with open('knn_model.pkl', 'rb') as knn_file:
    knn_model = pickle.load(knn_file)

with open('MLPmodel.pkl', 'rb') as mlp_file:
    mlp_model = pickle.load(mlp_file)

with open('XGBoost.pkl', 'rb') as xgb_file:
    xgboost_model = pickle.load(xgb_file)

with open('label_encoder.pkl', 'rb') as le_file:
    label_encoder = pickle.load(le_file)

with open('MLPscaler.pkl', 'rb') as le_file:
    scaler = pickle.load(le_file)

symptom_columns = ['itching', 'shivering', 'chills', 'acidity', 'vomiting', 'fatigue', 'anxiety', 'restlessness', 'lethargy', 'cough', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'nausea', 'constipation', 'diarrhoea', 'malaise', 'phlegm', 'congestion', 'dizziness', 'cramps', 'bruising', 'obesity', 'unsteadiness', 'depression', 'irritability', 'polyuria', 'coma', 'palpitations', 'blackheads', 'scurring', 'blister', 'skin rash', 'pus filled pimples', 'mood swings', 'weight loss', 'fast heart rate', 'excessive hunger', 'muscle weakness', 'abnormal menstruation', 'muscle wasting', 'patches in throat', 'high fever', 'extra marital contacts', 'yellowish skin', 'loss of appetite', 'abdominal pain', 'yellowing of eyes', 'chest pain', 'loss of balance', 'lack of concentration', 'blurred and distorted vision', 'drying and tingling lips', 'slurred speech', 'stiff neck', 'swelling joints', 'painful walking', 'dark urine', 'yellow urine', 'receiving blood transfusion', 'receiving unsterile injections', 'visual disturbances', 'burning micturition', 'bladder discomfort', 'foul smell of urine', 'continuous feel of urine', 'irregular sugar level', 'increased appetite', 'joint pain', 'skin peeling', 'small dents in nails', 'inflammatory nails', 'swelling of stomach', 'distention of abdomen', 'history of alcohol consumption', 'fluid overload', 'pain during bowel movements', 'pain in anal region', 'bloody stool', 'irritation in anus', 'acute liver failure', 'stomach bleeding', 'back pain', 'weakness in limbs', 'neck pain', 'mucoid sputum', 'mild fever', 'muscle pain', 'family history', 'continuous sneezing', 'watering from eyes', 'rusty sputum', 'weight gain', 'puffy face and eyes', 'enlarged thyroid', 'brittle nails', 'swollen extremeties', 'swollen legs', 'prominent veins on calf', 'stomach pain', 'spinning movements', 'sunken eyes', 'silver like dusting', 'swelled lymph nodes', 'blood in sputum', 'swollen blood vessels', 'toxic look (typhos)', 'belly pain', 'throat irritation', 'redness of eyes', 'sinus pressure', 'runny nose', 'loss of smell', 'passage of gases', 'cold hands and feets', 'weakness of one body side', 'altered sensorium', 'nodal skin eruptions', 'red sore around nose', 'yellow crust ooze', 'ulcers on tongue', 'spotting  urination', 'pain behind the eyes', 'red spots over body', 'internal itching', 'movement stiffness', 'knee pain', 'hip joint pain', 'dischromic  patches']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse user input from JSON
        user_input = request.json
        # user_input = {
        #     'itching': 1,
        #     'skin_rash': 1,
        #     'nodal_skin_eruptions': 0,
        #     'continuous_sneezing': 1,
        #     'shivering': 1,
        #     'chills': 1,
        #     'joint_pain': 1,
        #     'stomach_pain': 1,
        # }

        # user_input = {
        #     'chest_pain': 1,
        #     'phlegm': 1,
        #     'runny_nose': 1,
        #     'high_fever': 1,
        #     'throat_irritation': 1,
        #     'congestion': 1,
        #     'redness_of_eyes': 1,
        # }

        # Preprocess input data
        user_df = pd.DataFrame([user_input], columns=symptom_columns).fillna(0)
        input_data = user_df.values

        # Get predictions from all models
        rf_pred = random_forest_model.predict(input_data)[0]
        knn_pred = knn_model.predict(input_data)[0]
        input_scaled = scaler.transform(user_df.values)
        input_tensor = torch.tensor(input_scaled, dtype=torch.float32)
        mlp_model.eval()
        output = mlp_model(input_tensor)
        probabilities = torch.softmax(output, dim=1)
        _, mlp_pred = torch.max(probabilities, 1)
        # mlp_pred = mlp_model.predict(input_data)[0]
        xgb_pred = xgboost_model.predict(input_data)[0]

        # Decode predictions into disease names
        rf_label = label_encoder.inverse_transform([rf_pred])[0]
        knn_label = label_encoder.inverse_transform([knn_pred])[0]
        mlp_label = label_encoder.inverse_transform([mlp_pred])[0]
        xgb_label = label_encoder.inverse_transform([xgb_pred])[0]

        predictions = [rf_label, knn_label, mlp_label, xgb_label]
        print(predictions)
        majority_label = Counter(predictions).most_common(1)[0][0]

        return jsonify({
            'predictions': {
                'Random Forest': rf_label,
                'KNN': knn_label,
                'MLP': mlp_label,
                'XGBoost': xgb_label
            },
            'majority_prediction': majority_label
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
