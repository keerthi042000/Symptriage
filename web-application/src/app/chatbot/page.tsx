"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import "dotenv/config";
import { useRouter } from "next/navigation";
import { updateUserHistory, getUser, getMedicine } from "../../../utils/db";
import { openai } from "../../../utils/db";
import Header from "../header"

import Sidebar from "../sidebar";


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
  // const [messages, setMessages] = useState<Message[]>([]);

  const [messages, setMessages] = useState<Message[]>(() => {
  // Load from localStorage on first render
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);


  const [viewMessage] = useState<boolean>(false); // Fix: use 'boolean' instead of 'Boolean'
  const router = useRouter();

  // State to store the user's input
  const [input, setInput] = useState<string>("");

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
  async function extractSymptoms(sentence: string) { // Fix: Specify 'string' instead of 'any'
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
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0,
        response_format: { type: "json_object" },
      });
      console.log(response);
      const result = response.choices[0].message.content;
      console.log(result);
      if (typeof result === "string") {
        return JSON.parse(result);
      } else {
        throw new Error("Unexpected response content");
      }
    } catch (error) {
      console.error("Error extracting symptoms:", error); // Fix: Log error details
      return { error: "Failed to process the request" };
    }
  }

  // Function to send symptoms to the backend API
  async function sendToBackend(symptomsObj: Record<string, number>) { // Fix: Use Record<string, number> instead of 'any'
    try {
      const backend_url = process.env.NEXT_PUBLIC_BACKEND_API_URL
      const response = await axios.post(
        // "https://kmurali-dbos-fastapi-starter.cloud.dbos.dev/predict",
        `${backend_url}/predict`,
        { symptoms: symptomsObj },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Backend response:", response.data);
      return response.data;
    } catch (error) { // Fix: Handle error explicitly
      console.error("Error sending symptoms to backend:", error);
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  // Initialize chatbot greeting message when component mounts
  // useEffect(() => {
  //   if (!viewMessage) {
  //     setMessages([]);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         sender: "Chatbot",
  //         text: "Hello! I'm here to help you understand your symptoms better. Please share more details.",
  //         timestamp: new Date().toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         }),
  //       },
  //     ]);
  //   }
  // }, [viewMessage]); // Fix: Include 'viewMessage' in the dependency array

  useEffect(() => {
  if (!viewMessage && messages.length === 0) {
    setMessages([
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
}, [viewMessage, messages.length]);

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
    if(Object.keys(response).length !==0){
      const res: Response = await sendToBackend(response);
      console.log(res);
      // const text = `Predicted - ${
      //   res?.majority_prediction
      // }`;
      
      let random = ["Acne","Allergies","Hypertension"]
      let r = random[getRandomInt(3)]
      let r2 = getRandomInt(10)
      // const res2 = await getMedicine(r)
      const res2 = await getMedicine(res?.majority_prediction)
      console.log("R : ",r)
      console.log("R2 : ",res2)
      // console.log(res2.medicines[`${r}${r2}`].Drug);
      // alert(res2.medicines[`${r}${r2}`].Drug)
      // const text = `Predicted - ${
      //   res?.majority_prediction
      // } ${res2.medicines[`${r}${r2}`].Drug}`;

      // const text = `Predicted - ${
      //   res?.majority_prediction
      // } 
      // \n Medications :  ${res2.medicines}`;

      const medsList = Array.isArray(res2.medicines)
        ? res2.medicines.join("\n")
        : res2.medicines.replace(/, /g, "\n");

      const text = `Diagnosis - ${res?.majority_prediction}\nMedications:\n${medsList}`;


      const getUserInfo = await getUser(window.localStorage.getItem("email"));
      const currentDate = new Date();
  
  // Format the date as "YYYY-MM-DD"
      const formattedDateTime = currentDate.getFullYear() + '-' 
      + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' 
      + String(currentDate.getDate()).padStart(2, '0') + ' ' 
      + String(currentDate.getHours()).padStart(2, '0') + ':' 
      + String(currentDate.getMinutes()).padStart(2, '0') + ':' 
      + String(currentDate.getSeconds()).padStart(2, '0');
      let oldHistory = getUserInfo['user'].history || []; 
      await updateUserHistory(window.localStorage.getItem("email"),[...oldHistory ,{ [formattedDateTime]: res?.majority_prediction }]);
  
      // Add chatbot response after user message
      const chatbotReply: Message = {
        sender: "Chatbot",
        text: text,
        timestamp: currentTime,
      };
  
      setTimeout(() => {
        setMessages((prev) => [...prev, chatbotReply]);
      }, 1000); // Simulate a delay for the bot's response
    }else{
       // Add chatbot response after user message
       const chatbotReply: Message = {
        sender: "Chatbot",
        text: "Please provide more details about your symptoms.",
        timestamp: currentTime,
      };
  
      setTimeout(() => {
        setMessages((prev) => [...prev, chatbotReply]);
      }, 1000); // Simulate a delay for the bot's response
    }
    // Clear the input field
    setInput("");
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
      <Sidebar />

      {/* <div className="w-64 bg-slate-800 p-5 text-white">
        <h2 className="mb-5 text-center text-xl font-bold">
          ChatBot
        </h2>
        <ul>
          <li
            className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            History
          </li> */}
          {/* <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">
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
          </li> */}
        {/* </ul>
      </div> */}

      {/* Chat Container */}
      <div className="flex flex-1 flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-blue-100 p-5 text-center text-black">
          <h1 className="text-xl font-bold">SympTriage</h1>
        </div>

        {/* <Header /> */}

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
              {/* <div>{message.text}</div> */}
              <div style={{ whiteSpace: "pre-line" }}>{message.text}</div>
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
