/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { createContext } from "react";
import { Socket } from "socket.io-client";

interface Context {
    onlineUserIds: string[];
    socket: Socket;
    updateChatList: boolean;
}

export const SocketContext = createContext<Context>({} as Context);