import { useEffect, useState } from "react";
import { sessionService } from "../services/api";

export default function SessionsPage(){

  const [sessions,setSessions] = useState([]);

  const user = JSON.parse(localStorage.getItem("wellnest_user"));

  useEffect(()=>{

    if(user?.userId){

      sessionService.getUserSessions(user.userId)
        .then(res => setSessions(res.data))
        .catch(err => console.error(err));

    }

  },[]);

  return(

    <div className="max-w-[900px] mx-auto px-6 py-10">

      <h1 className="text-2xl font-bold mb-6">
        My Training Sessions
      </h1>

      {sessions.length === 0 && (
        <p className="text-[var(--text-muted)]">
          No sessions booked yet
        </p>
      )}

      <div className="flex flex-col gap-4">

        {sessions.map(session => (

          <div
            key={session.id}
            className="border border-[var(--border)] rounded-lg p-4"
          >

            <h3 className="font-semibold">
              Trainer: {session.trainer?.name}
            </h3>

            <p className="text-sm text-[var(--text-secondary)]">
              Date: {session.sessionDate}
            </p>

            <p className="text-sm text-[var(--text-secondary)]">
              Time: {session.sessionTime}
            </p>

            <p className="text-sm mt-1">
              Status: <span className="font-medium">{session.status}</span>
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}