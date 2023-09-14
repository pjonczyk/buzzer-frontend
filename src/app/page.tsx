"use client";

import { useBearStore } from "@/sessionState";
import { useRouter } from "next/navigation";
import { type } from "os";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const {
    setSessionIdToJoin,
    setUsername,
    username,
    socket,
    sessionId,
    userId,
    setSocket,
    updateSession,
    updateUserId,
    updateSessionId,
  } = useBearStore((state) => state);

  useEffect(() => {
    reset();
  }, []);

  const [hasEnteredName, setHasEnteredName] = useState(false);

  const reset = () => {
    console.log("disconnecting socket from server");
    if (socket != undefined) {
      if (sessionId && userId) {
        socket.emit("buzzer:removeUserFromSession", sessionId, userId);
      }
      socket.disconnect();
      setSocket(undefined);
      updateUserId("");
      updateSessionId("");
    }
  };

  const handleCreateSession = () => {
    if (username != "") {
      router.push("/session");
    }
  };

  const handleKeyDownJoinSession = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key == "Enter") {
      console.log(event.currentTarget.value);
      setSessionIdToJoin(event.currentTarget.value);
      router.push("/session");
    }
  };

  return (
    <div>
      <header>
        <h1 className="text-5xl text-slate-200 font-bold tracking-tight">
          <a href="/">Buzzer</a>
        </h1>
      </header>
      <main className="flex justify-around">
        {!hasEnteredName ? (
          <AskForNameComponent setHasEnteredName={setHasEnteredName} />
        ) : (
          <>
            <div>
              <h2>{"  "}</h2>
              <button id="createSessionInput" onClick={handleCreateSession}>
                Create Session
              </button>
            </div>
            <div>
              <h2>Join Session</h2>
              <input
                id="joinSessionInput"
                type="text"
                onKeyDown={handleKeyDownJoinSession}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

type AskForNameComponentProps = {
  setHasEnteredName: Dispatch<SetStateAction<boolean>>;
};

function AskForNameComponent({ setHasEnteredName }: AskForNameComponentProps) {
  const { setUsername, username } = useBearStore((state) => state);

  const handleNameInput = (event: React.FormEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      setHasEnteredName(true);
    }
  };

  return (
    <div>
      <h2>Name</h2>
      <input
        id="name"
        type="text"
        value={username}
        onChange={handleNameInput}
        onKeyUp={handleEnter}
      ></input>
    </div>
  );
}
