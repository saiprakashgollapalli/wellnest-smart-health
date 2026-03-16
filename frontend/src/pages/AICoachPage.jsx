import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import { FiSend, FiUser, FiCpu } from "react-icons/fi";

export default function AICoachPage() {

  const [messages,setMessages] = useState([]);
  const [question,setQuestion] = useState("");
  const [loading,setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const suggestions = [
    "Create a weekly workout plan",
    "Suggest a healthy diet plan",
    "How can I improve sleep quality?",
    "How much water should I drink daily?"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({behavior:"smooth"});
  };

  useEffect(()=>{
    scrollToBottom();
  },[messages]);

  const askCoach = async (text) => {

    const q = text || question;

    if(!q.trim()) return;

    const userMessage = {
      role:"user",
      text:q
    };

    setMessages(prev => [...prev,userMessage]);
    setQuestion("");
    setLoading(true);

    try{

      const res = await API.post("/ai-coach/ask",{
        question:q,
        bmi:24.5,
        sleep:7,
        hydration:2,
        workout:120
      });

      const aiMessage = {
        role:"ai",
        text:res.data.answer
      };

      setMessages(prev => [...prev,aiMessage]);

    }catch(err){

      setMessages(prev => [...prev,{
        role:"ai",
        text:"AI service unavailable. Please try again."
      }]);

    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if(e.key === "Enter"){
      askCoach();
    }
  };

  return (

  <div className="max-w-[900px] mx-auto px-6 py-8 flex flex-col h-[85vh]">

    {/* HEADER */}

    <div className="flex items-center gap-3 mb-5">

      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">

        <FiCpu size={18}/>

      </div>

      <div>

        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
          WellNest AI Coach
        </h1>

        <p className="text-sm text-[var(--text-secondary)]">
          Personalized health assistant
        </p>

      </div>

    </div>

    {/* CHAT AREA */}

   <div className="flex-1 overflow-y-auto border border-[var(--border)] rounded-xl p-5 bg-[var(--bg-card)]">

  {messages.length === 0 && (

    <div className="text-[var(--text-secondary)] text-sm mb-4">

      Ask anything about fitness, diet, sleep, or hydration.

    </div>

      )}

      {/* SUGGESTIONS */}

      {messages.length === 0 && (

        <div className="flex flex-wrap gap-2 mb-5">

          {suggestions.map((s,i)=>(

            <button
              key={i}
              onClick={()=>askCoach(s)}
              className="text-xs px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition"
            >

              {s}

            </button>

          ))}

        </div>

      )}

      {/* MESSAGES */}

      {messages.map((msg,i)=>(

        <div
          key={i}
          className={`flex mb-4 ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >

          <div className="flex items-start gap-2 max-w-[75%]">

            {msg.role === "ai" && (

              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">

                <FiCpu size={14}/>

              </div>

            )}

            <div
  className={`px-4 py-3 rounded-xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
    msg.role === "user"
      ? "bg-indigo-600 text-white ml-auto"
      : "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)]"
  }`}
>
            

              {msg.text}

            </div>

            {msg.role === "user" && (

              <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)]">

                <FiUser size={14}/>

              </div>

            )}

          </div>

        </div>

      ))}

      {/* TYPING INDICATOR */}

      {loading && (

        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">

          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">

            <FiCpu size={14}/>

          </div>

          <span className="animate-pulse">
            🤖 AI Coach is thinking...
          </span>

        </div>

      )}

      <div ref={chatEndRef}></div>

    </div>

    {/* INPUT AREA */}

    <div className="flex gap-3 mt-4">

     <input
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask your AI health coach..."
        className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={()=>askCoach()}
        className="bg-indigo-600 hover:bg-indigo-500 px-5 rounded-xl text-white flex items-center justify-center transition"
      >

        <FiSend/>

      </button>

    </div>

  </div>

  );

}