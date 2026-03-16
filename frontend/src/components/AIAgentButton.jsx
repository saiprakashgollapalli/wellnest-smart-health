import { useNavigate } from "react-router-dom";
import { FiCpu } from "react-icons/fi";

export default function AIAgentButton(){

  const navigate = useNavigate();

  return(

    <div className="fixed bottom-8 right-6 group">

      {/* WHITE BORDER RING */}

      <div className="
        w-[60px] h-[60px]
        rounded-full
        border-2 border-white shadow-[0_0_10px_white]
        flex items-center justify-center
        shadow-[0_0_18px_rgba(99,102,241,0.6)]
      ">

        {/* AI BUTTON */}

        <button
          onClick={() => navigate("/ai-coach")}
          className="
          ai-orb
          w-[48px] h-[48px]
          rounded-full
          bg-gradient-to-br
          from-blue-500
          via-purple-500
          to-indigo-500
          text-white
          flex items-center justify-center
          hover:scale-110
          transition
          "
        >
          <FiCpu size={20}/>
        </button>

      </div>

      {/* TOOLTIP */}

      <span
        className="
        absolute right-20 top-1/2 -translate-y-1/2
        bg-[#111827]
        border border-[#374151]
        text-white text-xs
        px-3 py-1 rounded-md
        opacity-0 group-hover:opacity-100
        transition
        whitespace-nowrap
        "
      >
        Ask AI Coach
      </span>

    </div>

  );

}