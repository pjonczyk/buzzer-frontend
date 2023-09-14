"use client";

import { ClientToServerEvents, ServerToClientEvents } from "@/events";
import { User, useBearStore } from "@/sessionState";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const {
    session,
    userId,
    isLoading,
    error,
    sessionIdToJoin,
    username,
    socket,
    updateUserId,
    updateSession,
    sessionClosed,
    updateSessionId,
    setSocket,
  } = useBearStore((state) => state);

  useEffect(() => {
    if (socket === undefined) {
      socketInitializer();
    }
  }, []);

  const socketInitializer = async () => {
    let tempSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      "http://localhost:8080"
    );

    tempSocket.on("buzzer:userAdded", (payload) =>
      updateUserId(payload.userId)
    );
    tempSocket.on("buzzer:sessionState", (sessionState) => {
      console.log("received sessionState Update", sessionState);
      updateSession(sessionState);
    });
    tempSocket.on("buzzer:sessionClosed", () => {
      sessionClosed();
      router.push("/");
    });
    tempSocket.on("buzzer:sessionCreated", (payload) => {
      console.log("received sessionCreated", payload);
      updateSessionId(payload.sessionId);
      updateUserId(payload.userId);
    });

    tempSocket.on("connect", () => {
      console.log("connected");
      if (sessionIdToJoin) {
        console.log("joining session");
        tempSocket.emit("buzzer:addUserToSession", sessionIdToJoin, username);
      } else if (username) {
        console.log("creating new session");
        tempSocket.emit("buzzer:createSession", username);
      }
    });
    tempSocket.on("disconnect", () => {
      setSocket(undefined);
      router.push("/");
    });

    setSocket(tempSocket);
  };

  if (userId === session?.adminId) {
    return <AdminBuzzerUI />;
  } else {
    return <BuzzerUI />;
  }
}

function AdminBuzzerUI() {
  const { sessionId, socket, session, userId } = useBearStore((state) => state);
  const handleReset = () => {
    if (session?.sessionId && userId) {
      socket?.emit("buzzer:deactivate", session?.sessionId, userId);
    }
  };

  return (
    <div>
      <h2>Admin UI</h2>
      <button onClick={handleReset}>Reset</button>
      <BuzzerUI />
    </div>
  );
}

function BuzzerUI() {
  const { session, userId, socket } = useBearStore((state) => state);

  const handleBuzz = () => {
    if (session?.sessionId && userId) {
      socket?.emit("buzzer:activate", session?.sessionId, userId);
    }
  };

  return (
    <div>
      <p>SessionId {session?.sessionId}</p>
      <p>SessionAdminId {session?.adminId}</p>
      <p>UserId {userId}</p>
      <button onClick={handleBuzz}>Buzz Buzz</button>
      <ul>
        {session?.users.map((user: User) => {
          return (
            <li key={user.id}>
              {user.name}
              {user.id === session.activatedBuzzerId ? " --- Buzz Buzz" : ""}
              {user.id === session.adminId ? " --- Admin" : ""}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
