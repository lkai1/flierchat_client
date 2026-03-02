import React, { useState, useMemo } from "react";
import { getChatMessagesService } from "../services/messageServices.ts";
import { SelectedChatContext } from "./SelectedChatContext.ts";
import { Chat } from "../lib/types/Chat.ts";

const SelectedChatProvider = ({ children }: { children: React.JSX.Element; }): React.JSX.Element => {

    const emptyChat = useMemo(() => {
        return {
            id: "",
            chatName: "",
            chatParticipants: [],
            creatorId: "",
            isGroup: null,
            messages: []
        };
    }, []);


    const [selectedChatState, setSelectedChatState] = useState<Chat>(emptyChat);

    const valuesToProvide = {
        selectedChatState,
        setSelectedChatState,
        updateSelectedChatState: async (chat: Chat): Promise<void> => {
            const messages = await getChatMessagesService(chat.id)
                .then((chatMessages) => {
                    return chatMessages;
                }).catch(() => { return []; });

            setSelectedChatState({ ...chat, messages });
        },
        addSelectedChatParticipant: (participant: { id: string, username: string }): void => {
            setSelectedChatState((prevState) => {
                return { ...prevState, chatParticipants: [...prevState.chatParticipants, participant] };
            });
        },
        deleteSelectedChatParticipant: (participantId: string): void => {
            setSelectedChatState((prevState) => {
                return { ...prevState, chatParticipants: [...prevState.chatParticipants.filter((participant) => { return participant.id !== participantId; })] };
            });
        },
        emptySelectedChatState: (): void => {
            setSelectedChatState(emptyChat);
        }
    };

    return (
        <SelectedChatContext.Provider value={valuesToProvide}>
            {children}
        </SelectedChatContext.Provider>
    );
};

export default SelectedChatProvider;