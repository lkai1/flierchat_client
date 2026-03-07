import React, { useState, useMemo, useCallback } from "react";
import { getChatMessagesService } from "../services/messageServices.ts";
import { SelectedChatContext } from "./SelectedChatContext.ts";
import { Chat } from "../lib/types/Chat.ts";

const MESSAGES_PAGE_SIZE = 50;

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
    const [messagesOffset, setMessagesOffset] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);

    const updateSelectedChatState = useCallback(async (chat: Chat): Promise<void> => {
        const result = await getChatMessagesService(chat.id, MESSAGES_PAGE_SIZE, 0)
            .catch(() => { return { messages: [], total: 0 }; });

        setSelectedChatState({ ...chat, messages: result.messages });
        setMessagesOffset(result.messages.length);
        setHasMoreMessages(result.total > result.messages.length);
    }, []);

    const loadMoreMessages = useCallback(async (): Promise<void> => {
        if (isLoadingMoreMessages || !hasMoreMessages) { return; }

        setIsLoadingMoreMessages(true);
        try {
            const result = await getChatMessagesService(
                selectedChatState.id,
                MESSAGES_PAGE_SIZE,
                messagesOffset
            );

            if (result.messages.length > 0) {
                setSelectedChatState((prev) => {
                    return { ...prev, messages: [...result.messages, ...prev.messages] };
                });
                const newOffset = messagesOffset + result.messages.length;
                setMessagesOffset(newOffset);
                setHasMoreMessages(newOffset < result.total);
            } else {
                setHasMoreMessages(false);
            }
        } catch {
            // silently fail
        } finally {
            setIsLoadingMoreMessages(false);
        }
    }, [selectedChatState.id, messagesOffset, isLoadingMoreMessages, hasMoreMessages]);

    const addSelectedChatParticipant = useCallback((participant: { id: string, username: string }): void => {
        setSelectedChatState((prevState) => {
            return { ...prevState, chatParticipants: [...prevState.chatParticipants, participant] };
        });
    }, []);

    const deleteSelectedChatParticipant = useCallback((participantId: string): void => {
        setSelectedChatState((prevState) => {
            return {
                ...prevState,
                chatParticipants: prevState.chatParticipants.filter((participant) => {
                    return participant.id !== participantId;
                })
            };
        });
    }, []);

    const emptySelectedChatState = useCallback((): void => {
        setSelectedChatState(emptyChat);
        setMessagesOffset(0);
        setHasMoreMessages(false);
        setIsLoadingMoreMessages(false);
    }, [emptyChat]);

    const valuesToProvide = useMemo(() => {
        return {
            selectedChatState,
            setSelectedChatState,
            updateSelectedChatState,
            addSelectedChatParticipant,
            deleteSelectedChatParticipant,
            emptySelectedChatState,
            hasMoreMessages,
            isLoadingMoreMessages,
            loadMoreMessages
        };
    }, [
        selectedChatState,
        updateSelectedChatState,
        addSelectedChatParticipant,
        deleteSelectedChatParticipant,
        emptySelectedChatState,
        hasMoreMessages,
        isLoadingMoreMessages,
        loadMoreMessages
    ]);

    return (
        <SelectedChatContext.Provider value={valuesToProvide}>
            {children}
        </SelectedChatContext.Provider>
    );
};

export default SelectedChatProvider;