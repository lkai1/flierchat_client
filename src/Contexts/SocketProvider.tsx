import React, { useContext, useEffect, useMemo, useState } from "react";
import { SelectedChatContext } from "./SelectedChatContext.ts";
import { io, Socket } from "socket.io-client";
import { UserInfoContext } from "./UserInfoContext.js";
import { setTabInfoNewMessages } from "../utils/tabInfo.ts";
import { SocketContext } from "./SocketContext.ts";
import { Message } from "../lib/types/Message.ts";

const SocketProvider = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
    const [updateChatList, setUpdateChatList] = useState(false);

    const {
        selectedChatState,
        setSelectedChatState,
        deleteSelectedChatParticipant,
        addSelectedChatParticipant,
        emptySelectedChatState
    } = useContext(SelectedChatContext);

    const { userInfoState } = useContext(UserInfoContext);

    const socket: Socket = useMemo(() => {
        return io("https://flierchatserver-production.up.railway.app", {
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
    }, [userInfoState.id, socket]);

    useEffect(() => {
        const handleUserChange = (): void => { socket.emit("onlineUsers"); };

        const handleOnlineUsers = (userIds: string[]): void => { setOnlineUserIds(userIds); };

        const handleMessage = (message: Message): void => {
            if (message.messageCreator.id !== userInfoState.id) { setTabInfoNewMessages(); }

            setSelectedChatState(prevState => {
                if (prevState.id === message.chatId) {
                    return { ...prevState, messages: [...prevState.messages, message] };
                }
                return prevState;
            });
            setUpdateChatList(prevState => { return !prevState; });
        };

        const handleMessageDelete = (messageId: string): void => {
            setSelectedChatState(prevState => {
                return {
                    ...prevState,
                    messages: prevState.messages.filter(msg => { return msg.id !== messageId; })
                };
            });
        };

        const handleMessageDeleteAll = ({ userId }: { userId: string }): void => {
            setSelectedChatState(prevState => {
                return {
                    ...prevState,
                    messages: prevState.messages.filter(msg => { return msg.messageCreator.id !== userId; })
                };
            });
        };

        const handleChatParticipantDelete = ({ userId }: { userId: string }): void => {
            deleteSelectedChatParticipant(userId);
        };

        const handleChatParticipantRemove = ({ userId, chatId }: { userId: string, chatId: string }): void => {
            if (userId === userInfoState.id) {
                socket.emit("emptySelectedChat");
            } else if (selectedChatState.id === chatId) {
                setSelectedChatState(prevState => {
                    return {
                        ...prevState,
                        messages: prevState.messages.filter(msg => { return msg.messageCreator.id !== userId; })
                    };
                });
                deleteSelectedChatParticipant(userId);
            }
        };

        const handleChatParticipantAdd = ({ chatParticipant }: { chatParticipant: { id: string; username: string } }): void => {
            addSelectedChatParticipant(chatParticipant);
        };

        const handleChatCreate = (): void => { setUpdateChatList(prevState => { return !prevState; }); };
        const handleUserDelete = (): void => { setUpdateChatList(prevState => { return !prevState; }); };
        const handleEmptySelectedChat = (): void => {
            emptySelectedChatState();
            setUpdateChatList(prevState => { return !prevState; });
        };
        const handleChatDelete = ({ chatId }: { chatId: string }): void => {
            setUpdateChatList(prevState => { return !prevState; });
            if (selectedChatState.id === chatId) { emptySelectedChatState(); }
        };

        socket.on("userConnected", handleUserChange);
        socket.on("userDisconnected", handleUserChange);
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
    }, [socket, userInfoState.id, selectedChatState.id, addSelectedChatParticipant, deleteSelectedChatParticipant, emptySelectedChatState, setSelectedChatState]);

    const valuesToProvide = { onlineUserIds, socket, updateChatList };

    return (
        <SocketContext.Provider value={valuesToProvide}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;