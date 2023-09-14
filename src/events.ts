import { Session } from "./sessionState";

export interface ServerToClientEvents {
  "buzzer:sessionCreated": (result: {
    sessionId: string;
    userId: string;
  }) => void;
  "buzzer:userAdded": (result: { userId: string }) => void;
  "buzzer:sessionState": (result: Session) => void;
  "buzzer:sessionClosed": () => void;
}

export interface ClientToServerEvents {
  "buzzer:createSession": (name: string) => void;
  "buzzer:addUserToSession": (sessionId: string, name: string) => void;
  "buzzer:activate": (sessionId: string, userId: string) => void;
  "buzzer:deactivate": (sessionId: string, userId: string) => void;
  "buzzer:removeUserFromSession": (sessionId: string, userId: string) => void;
  "buzzer:closeSession": (sessionId: string, userId: string) => void;
}
