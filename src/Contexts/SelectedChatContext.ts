/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import { createContext, SetStateAction, Dispatch } from "react";
import { Chat } from "../lib/types/Chat";

interface Context {
    selectedChatState: Chat;
    setSelectedChatState: Dispatch<SetStateAction<Chat>>;
    updateSelectedChatState(chat: Chat): void;
    deleteSelectedChatParticipant(id: string): void;
    addSelectedChatParticipant(participant: { id: string, username: string }): void;
    emptySelectedChatState(): void;
    hasMoreMessages: boolean;
    isLoadingMoreMessages: boolean;
    loadMoreMessages(): Promise<void>;
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
    emptySelectedChatState: () => { },
    hasMoreMessages: false,
    isLoadingMoreMessages: false,
    loadMoreMessages: async () => { }
});