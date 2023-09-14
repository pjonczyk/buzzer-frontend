import { Socket } from "socket.io";
import { ServerToClientEvents, ClientToServerEvents } from "./events";
import { create } from "zustand";

export type Session = {
  sessionId: string;
  users: User[];
  adminId: string;
  activatedBuzzerId: string;
};

export type User = {
  id: string;
  points: number;
  name: string;
};

export interface BearState {
  session?: Session;
  sessionId?: string;
  userId?: string;
  isLoading: boolean;
  error?: string;
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
  sessionIdToJoin?: string;
  username: string;
  setSocket: (socket: any) => void;
  updateSession: (session: Session) => void;
  updateSessionId: (sessionId: string) => void;
  updateUserId: (userId: string) => void;
  updateIsLoading: (isLoading: boolean) => void;
  updateError: (error: string) => void;
  setSessionIdToJoin: (sessionIdToJoin: string) => void;
  setUsername: (username: string) => void;
  sessionClosed: () => void;
}

export const useBearStore = create<BearState>()((set) => ({
  isLoading: true,
  username: "",
  setSocket: (socket) => set(() => ({ socket: socket })),
  updateSession: (session) => set(() => ({ session: session })),
  updateSessionId: (sessionId) => set(() => ({ sessionId: sessionId })),
  updateUserId: (userId) => set(() => ({ userId: userId })),
  updateIsLoading: (isLoading) => set(() => ({ isLoading: isLoading })),
  updateError: (error) => set(() => ({ error: error })),
  setSessionIdToJoin: (sessionIdToJoin) =>
    set({ sessionIdToJoin: sessionIdToJoin }),
  setUsername: (username) => set(() => ({ username: username })),
  sessionClosed: () => set({ isLoading: true }, true),
}));
