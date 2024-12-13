Symptriage
----------

### Demo: [Symptriage](https://symptriage.vercel.app/)

### GitHub: [Vinayakrevankar/Symptriage](https://github.com/Vinayakrevankar/Symptriage)

* * * * *

### Prerequisites for Running Locally

Before getting started, ensure you have the following ready:

1.  **Environment Variables**:\
    Create a `.env.local` file to store your Firebase and OpenAI API keys. Follow the instructions below to generate these keys.

* * * * *

#### How to Get a Firebase API Key:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Log in and create a new project.
3.  Navigate to **Project Settings** (gear icon in the sidebar).
4.  Under the **General** tab, find your app's credentials, including the API key.

* * * * *

#### How to Get a ChatGPT API Key:

1.  Log in or sign up at [OpenAI](https://platform.openai.com/signup/).
2.  Navigate to the **API Keys** section in your account dashboard.
3.  Create a new API key. Note this key---once created, it will only be visible once!
4.  (Optional) If your organization has multiple accounts, get the **OpenAI Organization ID** from your account settings.

* * * * *

### `.env.local` File Format

Structure your `.env.local` file like this:

```
NEXT_PUBLIC_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_AUTH_DOMAIN=<your-firebase-auth-domain>
NEXT_PUBLIC_PROJECT_ID=<your-firebase-project-id>
NEXT_PUBLIC_STORAGE_BUCKET=<your-firebase-storage-bucket>
NEXT_PUBLIC_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
NEXT_PUBLIC_APP_ID=<your-firebase-app-id>
NEXT_PUBLIC_BACKEND_API_URL=<your-backend-api-url>
NEXT_PUBLIC_OPENAI_ORG=<your-openai-organization-id>
NEXT_PUBLIC_OPENAI_API_KEY=<your-chatgpt-api-key>

```

Replace `<value>` with the respective API keys and IDs.

* * * * *

### Frontend Setup

1.  Navigate to the `web-application` folder in your terminal.
2.  Create your `.env.local` file using the format above.
3.  Run the following commands to install dependencies and start the development server:


```
npm install
npm run dev 
```

Once done, open [`http://localhost:3000`](http://localhost:3000) in your browser to see your app in action!

* * * * *

### Optional Backend Setup (Using FastAPI)

The backend is already deployed in **DBOS** and by default that's what is used by the frontend If you'd like to set up the backend:

1.  Go to the `ML_FastAPI` directory.
2.  Run the following commands to set up a Python virtual environment and install dependencies:



```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

3.  Start the FastAPI server:

```
dbos start
```

4. Once the server is running, visit [`http://localhost:8000/predict`](http://localhost:8000) to check the backend


5. Then replace the link in the line **211** on the file `web-application/src/app/chatbot/page.tsx` file to `http://localhost:8000/predict`