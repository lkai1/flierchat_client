/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { createContext } from "react";
import { Socket } from "socket.io-client";
import { UnreadMessageInChat } from "../lib/types/Message";

interface Context {
    onlineUserIds: string[];
    socket: Socket;
    updateChatList: boolean;
    unreadMessagesInChats: UnreadMessageInChat[];
    // eslint-disable-next-line no-unused-vars
    clearUnreadMessagesForChat(chatId: string): void;
    // eslint-disable-next-line no-unused-vars
    getUnreadMessagesAmountForChat(chatId: string): number;
}

export const SocketContext = createContext<Context>({} as Context);