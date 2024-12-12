// app/page.tsx
export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 p-5 text-white">
        <h2 className="mb-5 text-center text-xl font-bold">Mental Health Support</h2>
        <ul>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">Depression Support</li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">Anxiety Management</li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">Stress Relief</li>
          <li className="mb-2 cursor-pointer rounded-md p-3 hover:bg-slate-700">Sleep Help</li>
        </ul>
      </div>

      {/* Chat Container */}
      <div className="flex flex-1 flex-col bg-gray-50">
        <div className="bg-blue-500 p-5 text-center text-white">
          <h1 className="text-xl font-bold">Mental Health Chatbot</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {/* Chat messages will go here */}
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 rounded-md border p-2 focus:border-blue-500 focus:outline-none"
            />
            <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}