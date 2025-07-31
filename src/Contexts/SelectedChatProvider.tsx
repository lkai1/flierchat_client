import React, { useState, useMemo } from "react";
import { getChatMessagesService } from "../services/messageServices.ts";
import { SelectedChatContext } from "./SelectedChatContext.ts";

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
            messageCreator: { id: string, username: string }
        }[];
    }

    const [selectedChatState, setSelectedChatState] = useState<Chat>(emptyChat);

    const valuesToProvide = useMemo(
        () => {
            return {
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
                    setSelectedChatState(prevState => {
                        return { ...prevState, chatParticipants: [...prevState.chatParticipants, participant] };
                    });
                },
                deleteSelectedChatParticipant: (participantId: string): void => {
                    setSelectedChatState(prevState => {
                        return { ...prevState, chatParticipants: [...prevState.chatParticipants.filter((participant) => { return participant.id !== participantId; })] };
                    });
                },
                emptySelectedChatState: (): void => {
                    setSelectedChatState(emptyChat);
                }
            };
        },
        [emptyChat, selectedChatState]
    );

    return (
        <SelectedChatContext.Provider value={valuesToProvide}>
            {children}
        </SelectedChatContext.Provider>
    );
};

export default SelectedChatProvider;