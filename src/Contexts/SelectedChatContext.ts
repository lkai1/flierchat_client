/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import { createContext, SetStateAction, Dispatch } from "react";

interface Chat {
    id: string;
    chatName: string;
    chatParticipants: {
        id: string;
        username: string;
    }[];
    creatorId: string;
    isGroup: boolean | null;
    messages: {
        id: string;
        value: string;
        timestamp: string;
        chatId: string;
        messageCreator: { id: string, username: string };
    }[];
}

interface Context {
    selectedChatState: Chat;
    setSelectedChatState: Dispatch<SetStateAction<Chat>>;
    updateSelectedChatState(chat: Chat): void;
    deleteSelectedChatParticipant(id: string): void;
    addSelectedChatParticipant(participant: { id: string, username: string }): void;
    emptySelectedChatState(): void;
}

export const SelectedChatContext = createContext<Context>({
    selectedChatState: {
        id: "",
        chatName: "",
        chatParticipants: [],
        creatorId: "",
        isGroup: null,
        messages: []
    },
    setSelectedChatState: () => { },
    updateSelectedChatState: () => { },
    deleteSelectedChatParticipant: () => { },
    addSelectedChatParticipant: () => { },
    emptySelectedChatState: () => { }
});
