import axios from "axios";
import "dotenv/config";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
    organization: "org-wg7LqXr0fjN27FhhxxIZfKZu",
    apiKey: "",
});


// Predefined list of symptoms
const symptomColumns = [
    "itching", "shivering", "chills", "acidity", "vomiting", "fatigue", "anxiety",
    "restlessness", "lethargy", "cough", "breathlessness", "sweating", "dehydration",
    "indigestion", "headache", "nausea", "constipation", "diarrhoea", "malaise",
    "phlegm", "congestion", "dizziness", "cramps", "bruising", "obesity",
    "unsteadiness", "depression", "irritability", "polyuria", "coma", "palpitations",
    "blackheads", "scurring", "blister", "skin rash", "pus filled pimples",
    "mood swings", "weight loss", "fast heart rate", "excessive hunger",
    "muscle weakness", "abnormal menstruation", "muscle wasting", "patches in throat",
    "high fever", "extra marital contacts", "yellowish skin", "loss of appetite",
    "abdominal pain", "yellowing of eyes", "chest pain", "loss of balance",
    "lack of concentration", "blurred and distorted vision", "drying and tingling lips",
    "slurred speech", "stiff neck", "swelling joints", "painful walking", "dark urine",
    "yellow urine", "receiving blood transfusion", "receiving unsterile injections",
    "visual disturbances", "burning micturition", "bladder discomfort",
    "foul smell of urine", "continuous feel of urine", "irregular sugar level",
    "increased appetite", "joint pain", "skin peeling", "small dents in nails",
    "inflammatory nails", "swelling of stomach", "distention of abdomen",
    "history of alcohol consumption", "fluid overload", "pain during bowel movements",
    "pain in anal region", "bloody stool", "irritation in anus", "acute liver failure",
    "stomach bleeding", "back pain", "weakness in limbs", "neck pain", "mucoid sputum",
    "mild fever", "muscle pain", "family history", "continuous sneezing",
    "watering from eyes", "rusty sputum", "weight gain", "puffy face and eyes",
    "enlarged thyroid", "brittle nails", "swollen extremeties", "swollen legs",
    "prominent veins on calf", "stomach pain", "spinning movements", "sunken eyes",
    "silver like dusting", "swelled lymph nodes", "blood in sputum",
    "swollen blood vessels", "toxic look (typhos)", "belly pain", "throat irritation",
    "redness of eyes", "sinus pressure", "runny nose", "loss of smell", "passage of gases",
    "cold hands and feets", "weakness of one body side", "altered sensorium",
    "nodal skin eruptions", "red sore around nose", "yellow crust ooze",
    "ulcers on tongue", "spotting urination", "pain behind the eyes",
    "red spots over body", "internal itching", "movement stiffness", "knee pain",
    "hip joint pain", "dischromic patches"
];

// Function to extract symptoms using ChatGPT
async function extractSymptoms(sentence) {
    const prompt = `
    You are a medical assistant. Identify symptoms from the user sentence and return them in the following JSON format:
    {
        "symptom_name": 1
    }
    Only include symptoms explicitly mentioned in the sentence. Use this predefined list of symptoms: ${JSON.stringify(symptomColumns)}.
    Input sentence: "${sentence}"
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 300,
            temperature: 0
        });
        fs.writeFileSync('response.json', JSON.stringify(response, null, 2));
        const result = response.choices[0].message.content;
        return JSON.parse(result);
    } catch (error) {
        console.error("Error extracting symptoms:", error.response?.data || error.message);
        return { error: "Failed to process the request" };
    }
}

// Function to send symptoms to the backend API
async function sendToBackend(symptomsObj) {
    // try {
    //     const response = await axios.post(process.env.BACKEND_API_URL, symptomsObj, {
    //         headers: { "Content-Type": "application/json" }
    //     });
    //     console.log("Backend response:", response.data);
    // } catch (error) {
    //     console.error("Error sending data to backend:", error.response?.data || error.message);
    // }
}

// Main function
async function main() {
    const userSentence = "I have itching, chills, and stomach pain, but no joint pain.";
    const symptoms = await extractSymptoms(userSentence);

    if (!symptoms.error) {
        console.log("Extracted Symptoms:", symptoms);
        await sendToBackend(symptoms);
    } else {
        console.error("Failed to extract symptoms:", symptoms.error);
    }
}

main();