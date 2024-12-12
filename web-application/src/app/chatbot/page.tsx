"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import "dotenv/config";
import OpenAI from "openai";
import { useRouter } from "next/navigation";

// Define the type for a message
type Message = {
  sender: string;
  text: string;
  timestamp: string;
};
interface Response {
  predictions: {
    "Random Forest": string;
    KNN: string;
    MLP: string;
    XGBoost: string;
  };
  majority_prediction: string;
}

export default function Chatbot() {
  // State to store the chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [viewMessage, setviewMessage] = useState<Boolean>(false);
  const router = useRouter();

  // State to store the user's input
  const [input, setInput] = useState<string>("");
  const openai = new OpenAI({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Predefined list of symptoms
  const symptomColumns = [
    "itching",
    "shivering",
    "chills",
    "acidity",
    "vomiting",
    "fatigue",
    "anxiety",
    "restlessness",
    "lethargy",
    "cough",
    "breathlessness",
    "sweating",
    "dehydration",
    "indigestion",
    "headache",
    "nausea",
    "constipation",
    "diarrhoea",
    "malaise",
    "phlegm",
    "congestion",
    "dizziness",
    "cramps",
    "bruising",
    "obesity",
    "unsteadiness",
    "depression",
    "irritability",
    "polyuria",
    "coma",
    "palpitations",
    "blackheads",
    "scurring",
    "blister",
    "skin rash",
    "pus filled pimples",
    "mood swings",
    "weight loss",
    "fast heart rate",
    "excessive hunger",
    "muscle weakness",
    "abnormal menstruation",
    "muscle wasting",
    "patches in throat",
    "high fever",
    "extra marital contacts",
    "yellowish skin",
    "loss of appetite",
    "abdominal pain",
    "yellowing of eyes",
    "chest pain",
    "loss of balance",
    "lack of concentration",
    "blurred and distorted vision",
    "drying and tingling lips",
    "slurred speech",
    "stiff neck",
    "swelling joints",
    "painful walking",
    "dark urine",
    "yellow urine",
    "receiving blood transfusion",
    "receiving unsterile injections",
    "visual disturbances",
    "burning micturition",
    "bladder discomfort",
    "foul smell of urine",
    "continuous feel of urine",
    "irregular sugar level",
    "increased appetite",
    "joint pain",
    "skin peeling",
    "small dents in nails",
    "inflammatory nails",
    "swelling of stomach",
    "distention of abdomen",
    "history of alcohol consumption",
    "fluid overload",
    "pain during bowel movements",
    "pain in anal region",
    "bloody stool",
    "irritation in anus",
    "acute liver failure",
    "stomach bleeding",
    "back pain",
    "weakness in limbs",
    "neck pain",
    "mucoid sputum",
    "mild fever",
    "muscle pain",
    "family history",
    "continuous sneezing",
    "watering from eyes",
    "rusty sputum",
    "weight gain",
    "puffy face and eyes",
    "enlarged thyroid",
    "brittle nails",
    "swollen extremeties",
    "swollen legs",
    "prominent veins on calf",
    "stomach pain",
    "spinning movements",
    "sunken eyes",
    "silver like dusting",
    "swelled lymph nodes",
    "blood in sputum",
    "swollen blood vessels",
    "toxic look (typhos)",
    "belly pain",
    "throat irritation",
    "redness of eyes",
    "sinus pressure",
    "runny nose",
    "loss of smell",
    "passage of gases",
    "cold hands and feets",
    "weakness of one body side",
    "altered sensorium",
    "nodal skin eruptions",
    "red sore around nose",
    "yellow crust ooze",
    "ulcers on tongue",
    "spotting urination",
    "pain behind the eyes",
    "red spots over body",
    "internal itching",
    "movement stiffness",
    "knee pain",
    "hip joint pain",
    "dischromic patches",
  ];

  // Function to extract symptoms using ChatGPT
  async function extractSymptoms(sentence: any) {
    const prompt = `
    You are a medical assistant. Identify symptoms from the user sentence and return them in the following JSON format:
    {
        "symptom_name": 1
    }
    Only include symptoms explicitly mentioned in the sentence. Use this predefined list of symptoms: ${JSON.stringify(
      symptomColumns
    )}.
    Input sentence: "${sentence}"
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0,
      });

      const result = response.choices[0].message.content;
      if (typeof result === "string") {
        return JSON.parse(result);
      } else {
        throw new Error("Unexpected response content");
      }
    } catch (error) {
      return { error: "Failed to process the request" };
    }
  }

  // Function to send symptoms to the backend API
  async function sendToBackend(symptomsObj: any) {
    try {
      const response = await axios.post(
        "https://kmurali-dbos-fastapi-starter.cloud.dbos.dev/predict",
        { symptoms: symptomsObj },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Backend response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error sending symptoms to backend:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  }

  // Initialize chatbot greeting message when component mounts
  useEffect(() => {
    if (!viewMessage) {
      setMessages([]);
      setMessages((prev) => [
        ...prev,
        {
          sender: "Chatbot",
          text: "Hello! I'm here to help you understand your symptoms better. Please share more details.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      
    }
  }, []); // Empty dependency array ensures this runs only once

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() === "") return; // Prevent sending empty messages

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add user message to the chat
    const userMessage: Message = {
      sender: "User",
      text: input.trim(),
      timestamp: currentTime,
    };
    setMessages((prev) => [...prev, userMessage]);
    const response = await extractSymptoms(input.trim());
    const res: Response = await sendToBackend(response);
    const text = `Predicted - ${
      (res as { majority_prediction: string })["majority_prediction"]
    }`;
    // Add chatbot response after user message
    const chatbotReply: Message = {
      sender: "Chatbot",
      text: text,
      timestamp: currentTime,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, chatbotReply]);
    }, 1000); // Simulate a delay for the bot's response

    // Clear the input field
    setInput("");
  };

  // Function to generate a basic chatbot response
  const generateResponse = (userInput: string): string => {
    if (userInput.toLowerCase().includes("help")) {
      return "How can I assist you today?";
    }
    return "I'm here to support you. Please share more.";
  };

  // Function to handle key press in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 p-5 text-white">
        <h2 className="mb-5 text-center text-xl font-bold">
          Mental Health Support
        </h2>
        <ul>
          <li
            className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            History
          </li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">
            Depression Support
          </li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">
            Anxiety Management
          </li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">
            Stress Relief
          </li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">
            Sleep Help
          </li>
        </ul>
      </div>

      {/* Chat Container */}
      <div className="flex flex-1 flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-blue-500 p-5 text-center text-white">
          <h1 className="text-xl font-bold">Mental Health Chatbot</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 max-w-md ${
                message.sender === "User"
                  ? "ml-auto bg-blue-100 text-right"
                  : "mr-auto bg-gray-200 text-left"
              } p-3 rounded-md shadow`}
            >
              <div>
                <strong>{message.sender}</strong>
                <span className="ml-2 text-xs text-gray-500">
                  {message.timestamp}
                </span>
              </div>
              <div>{message.text}</div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress} // Add this line to listen for Enter key press
              className="flex-1 rounded-md border p-2 focus:border-blue-500 focus:outline-none"
              aria-label="Message input field"
            />
            <button
              onClick={handleSendMessage}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              aria-label="Send message button"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
