import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SelectedChatContext } from "./SelectedChatContext.ts";
import { io, Socket } from "socket.io-client";
import { UserInfoContext } from "./UserInfoContext.js";
import { SocketContext } from "./SocketContext.ts";
import { Message, UnreadMessageInChat } from "../lib/types/Message.ts";
import { clearUnreadMessagesAmountInChatService, getAllUnreadMessagesAmountService } from "../services/chatServices.ts";
import { SOCKET_URL } from "../utils/env.ts";


const SocketProvider = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
    const [updateChatList, setUpdateChatList] = useState(false);
    const [unreadMessagesInChats, setUnreadMessagesInChats] = useState<UnreadMessageInChat[]>([]);

    const {
        selectedChatState,
        setSelectedChatState,
        deleteSelectedChatParticipant,
        addSelectedChatParticipant,
        emptySelectedChatState
    } = useContext(SelectedChatContext);

    const { userInfoState } = useContext(UserInfoContext);

    // refs so socket handlers always read latest values without needing them as dependencies
    const selectedChatStateRef = useRef(selectedChatState);
    useEffect(() => { selectedChatStateRef.current = selectedChatState; }, [selectedChatState]);

    const userInfoStateRef = useRef(userInfoState);
    useEffect(() => { userInfoStateRef.current = userInfoState; }, [userInfoState]);

    const emptySelectedChatStateRef = useRef(emptySelectedChatState);
    useEffect(() => { emptySelectedChatStateRef.current = emptySelectedChatState; }, [emptySelectedChatState]);

    const deleteSelectedChatParticipantRef = useRef(deleteSelectedChatParticipant);
    useEffect(() => { deleteSelectedChatParticipantRef.current = deleteSelectedChatParticipant; }, [deleteSelectedChatParticipant]);

    const addSelectedChatParticipantRef = useRef(addSelectedChatParticipant);
    useEffect(() => { addSelectedChatParticipantRef.current = addSelectedChatParticipant; }, [addSelectedChatParticipant]);

    const clearUnreadMessagesForChat = useCallback(async (chatId: string): Promise<void> => {
        const result = await clearUnreadMessagesAmountInChatService(chatId);
        if (result.success) {
            setUnreadMessagesInChats((prevState) => {
                return prevState.filter((value) => { return value.chatId !== chatId; });
            });
        }
    }, []);

    const getUnreadMessagesAmountForChat = useCallback((chatId: string): number => {
        const unreadMessagesInChat = unreadMessagesInChats.find((value) => {
            return value.chatId === chatId;
        });
        return unreadMessagesInChat ? unreadMessagesInChat.amount : 0;
    }, [unreadMessagesInChats]);

    useEffect(() => {
        const getUnreadMessages = async (): Promise<void> => {
            const result = await getAllUnreadMessagesAmountService();

            if (result.success) {
                setUnreadMessagesInChats(result.data);
            }
        };

        if (userInfoState.id) {
            void getUnreadMessages();
        }
    }, [userInfoState.id]);

    const socket: Socket = useMemo(() => {
        return io(SOCKET_URL, {
            autoConnect: false,
            withCredentials: true
        });
    }, []);

    useEffect(() => {
        let cleanup: (() => void) | undefined = undefined;

        if (userInfoState.id) {
            socket.connect();
            cleanup = (): void => { socket.disconnect(); };
        }

        return cleanup;
    }, [userInfoState.id]);

    useEffect(() => {

        const handleUserConnected = (userId: string): void => {
            setOnlineUserIds((prevState) => {
                return prevState.includes(userId) ? prevState : [...prevState, userId];
            });
        };

        const handleUserDisconnected = (userId: string): void => {
            setOnlineUserIds((prevState) => {
                return prevState.filter((id) => { return userId !== id; });
            });
        };

        const handleOnlineUsers = (userIds: string[]): void => {
            setOnlineUserIds(userIds);
        };

        const handleMessage = (message: Message): void => {
            setSelectedChatState((prevState) => {
                if (prevState.id === message.chatId) {
                    return { ...prevState, messages: [...prevState.messages, message] };
                }
                return prevState;
            });

            if (
                message.messageCreator.id !== userInfoStateRef.current.id &&
                selectedChatStateRef.current.id !== message.chatId
            ) {
                setUnreadMessagesInChats((prevState) => {
                    const existing = prevState.find((value) => { return value.chatId === message.chatId; });

                    if (existing) {
                        return prevState.map((value) => {
                            return value.chatId === message.chatId
                                ? { ...value, amount: value.amount + 1 }
                                : value;
                        });
                    }

                    return [...prevState, { chatId: message.chatId, amount: 1 }];
                });
            }
        };

        const handleMessageDelete = (messageId: string): void => {
            setSelectedChatState((prevState) => {
                return {
                    ...prevState,
                    messages: prevState.messages.filter(msg => { return msg.id !== messageId; })
                };
            });
        };

        const handleMessageDeleteAll = ({ userId }: { userId: string }): void => {
            setSelectedChatState((prevState) => {
                return {
                    ...prevState,
                    messages: prevState.messages.filter(msg => { return msg.messageCreator.id !== userId; })
                };
            });
        };

        const handleChatParticipantDelete = ({ userId }: { userId: string }): void => {
            deleteSelectedChatParticipantRef.current(userId);
            setUpdateChatList((prevState) => { return !prevState; });
        };

        const handleChatParticipantRemove = ({ participantId, chatId }: { participantId: string, chatId: string }): void => {
            if (participantId === userInfoStateRef.current.id) {
                setUpdateChatList((prevState) => { return !prevState; });
                if (selectedChatStateRef.current.id === chatId) {
                    emptySelectedChatStateRef.current();
                }
            } else {
                setUpdateChatList((prevState) => { return !prevState; });
                if (selectedChatStateRef.current.id === chatId) {
                    deleteSelectedChatParticipantRef.current(participantId);
                }
            }
        };

        const handleChatParticipantAdd = ({ chatParticipant }: { chatParticipant: { id: string; username: string } }): void => {
            addSelectedChatParticipantRef.current(chatParticipant);
            setUpdateChatList((prevState) => { return !prevState; });
        };

        const handleChatCreate = (): void => { setUpdateChatList((prevState) => { return !prevState; }); };
        const handleUserDelete = (): void => { setUpdateChatList((prevState) => { return !prevState; }); };

        const handleEmptySelectedChat = (): void => {
            emptySelectedChatStateRef.current();
            setUpdateChatList((prevState) => { return !prevState; });
        };

        const handleChatDelete = ({ chatId }: { chatId: string }): void => {
            setUpdateChatList((prevState) => { return !prevState; });
            if (selectedChatStateRef.current.id === chatId) {
                emptySelectedChatStateRef.current();
            }
        };

        socket.on("userConnected", handleUserConnected);
        socket.on("userDisconnected", handleUserDisconnected);
        socket.on("onlineUsers", handleOnlineUsers);
        socket.on("message", handleMessage);
        socket.on("messageDelete", handleMessageDelete);
        socket.on("messageDeleteAll", handleMessageDeleteAll);
        socket.on("chatParticipantDelete", handleChatParticipantDelete);
        socket.on("chatParticipantRemove", handleChatParticipantRemove);
        socket.on("chatParticipantAdd", handleChatParticipantAdd);
        socket.on("chatCreate", handleChatCreate);
        socket.on("userDelete", handleUserDelete);
        socket.on("emptySelectedChat", handleEmptySelectedChat);
        socket.on("chatDelete", handleChatDelete);

        socket.emit("onlineUsers");

        return (): void => {
            socket.removeAllListeners();
        };
    }, [socket]);

    const valuesToProvide = useMemo(() => {
        return { onlineUserIds, socket, updateChatList, unreadMessagesInChats, clearUnreadMessagesForChat, getUnreadMessagesAmountForChat };
    }, [onlineUserIds, socket, updateChatList, unreadMessagesInChats, clearUnreadMessagesForChat, getUnreadMessagesAmountForChat]);

    return (
        <SocketContext.Provider value={valuesToProvide}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;