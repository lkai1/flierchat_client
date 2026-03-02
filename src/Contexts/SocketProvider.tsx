import React, { useContext, useEffect, useMemo, useState } from "react";
import { SelectedChatContext } from "./SelectedChatContext.ts";
import { io, Socket } from "socket.io-client";
import { UserInfoContext } from "./UserInfoContext.js";
import { SocketContext } from "./SocketContext.ts";
import { Message, UnreadMessageInChat } from "../lib/types/Message.ts";
import { clearUnreadMessagesAmountInChatService, getAllUnreadMessagesAmountService } from "../services/chatServices.ts";


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

    const clearUnreadMessagesForChat = async (chatId: string): Promise<void> => {
        const result = await clearUnreadMessagesAmountInChatService(selectedChatState.id);
        if (result.success) {
            setUnreadMessagesInChats((prevState) => {
                return prevState.filter((value) => { return value.chatId !== chatId; });
            });
        }
    };

    const getUnreadMessagesAmountForChat = (chatId: string): number => {
        const unreadMessagesInChat = unreadMessagesInChats.find((value) => {
            return value.chatId === chatId;
        });

        return unreadMessagesInChat ? unreadMessagesInChat.amount : 0;
    };

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
        return io(
            //production
            "https://flierchatserver-production.up.railway.app",
            //development
            /* "http://localhost:5000", */
            {
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

            if (message.messageCreator.id !== userInfoState.id) {
                setUnreadMessagesInChats((prevState) => {
                    const existing = prevState.find((value) => { return value.chatId === message.chatId; });

                    if (existing) {
                        return prevState.map((value) => {
                            return value.chatId === message.chatId
                                ? { ...value, amount: value.amount + 1 }
                                : value;
                        }
                        );
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
            deleteSelectedChatParticipant(userId);
        };

        const handleChatParticipantRemove = ({ participantId }: { participantId: string, chatId: string }): void => {
            if (participantId === userInfoState.id) {
                setUpdateChatList((prevState) => { return !prevState; });
            }
            deleteSelectedChatParticipant(participantId);
        };

        const handleChatParticipantAdd = ({ chatParticipant }: { chatParticipant: { id: string; username: string } }): void => {
            addSelectedChatParticipant(chatParticipant);
        };

        const handleChatCreate = (): void => { setUpdateChatList((prevState) => { return !prevState; }); };
        const handleUserDelete = (): void => { setUpdateChatList((prevState) => { return !prevState; }); };
        const handleEmptySelectedChat = (): void => {
            emptySelectedChatState();
            setUpdateChatList((prevState) => { return !prevState; });
        };
        const handleChatDelete = ({ chatId }: { chatId: string }): void => {
            setUpdateChatList((prevState) => { return !prevState; });
            if (selectedChatState.id === chatId) { emptySelectedChatState(); }
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
        /* check what exactly do you want to put in the dependency array */
    }, [socket, userInfoState.id, selectedChatState.id, addSelectedChatParticipant, deleteSelectedChatParticipant, emptySelectedChatState, setSelectedChatState]);

    const valuesToProvide = { onlineUserIds, socket, updateChatList, unreadMessagesInChats, clearUnreadMessagesForChat, getUnreadMessagesAmountForChat };

    return (
        <SocketContext.Provider value={valuesToProvide}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;