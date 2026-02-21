import React, { useContext, useEffect, useMemo, useState } from "react";
import { SelectedChatContext } from "./SelectedChatContext.ts";
import { io } from "socket.io-client";
import { UserInfoContext } from "./UserInfoContext.js";
import { setTabInfoNewMessages } from "../utils/tabInfo.ts";
import { SocketContext } from "./SocketContext.ts";

const SocketProvider = (
    { children }: { children: React.JSX.Element }
): React.JSX.Element => {

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

    const socket = useMemo(() => {
        return io(
            //production
            "https://flierchatserver-production.up.railway.app",
            //development
            /* "http://localhost:5000", */
            { autoConnect: false, withCredentials: true });
    }, []);

    useEffect(() => {
        if (userInfoState.id) {
            socket.connect();
        }

        return (): void => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("userDisconnected", () => {
            socket.emit("onlineUsers");
        });

        socket.on("userConnected", () => {
            socket.emit("onlineUsers");
        });

        socket.on("onlineUsers", (userIds: string[]) => {
            setOnlineUserIds(userIds);
        });

        socket.on("message", ({ message }: {
            message: {
                id: string;
                value: string;
                timestamp: string;
                chatId: string;
                messageCreator: { id: string, username: string }
            }
        }) => {
            if ('id' in userInfoState && message.messageCreator.id !== userInfoState.id) { setTabInfoNewMessages(); }
            setSelectedChatState(prevState => {
                if (prevState.id !== message.chatId) { return prevState; }
                return { ...prevState, messages: [...prevState.messages, message] };
            });
            setUpdateChatList(prevState => { return !prevState; });
        });

        socket.on("messageDelete", (messageId) => {
            setSelectedChatState(prevState => {
                return { ...prevState, messages: [...prevState.messages.filter((message) => { return message.id !== messageId; })] };
            });
        });

        socket.on("messageDeleteAll", ({ userId }) => {
            if ('id' in selectedChatState && selectedChatState.id) {
                setSelectedChatState(prevState => {
                    return { ...prevState, messages: [...prevState.messages.filter((message) => { return message.messageCreator.id !== userId; })] };
                });
            }
        });

        socket.on("userDelete", () => {
            setUpdateChatList(prevState => { return !prevState; });
        });

        socket.on("chatParticipantDelete", ({ userId }: { userId: string }) => {
            deleteSelectedChatParticipant(userId);
        });

        socket.on("chatParticipantRemove", ({ userId, chatId }: { userId: string, chatId: string }) => {
            if ('id' in userInfoState && userId === userInfoState.id) {
                socket.emit("emptySelectedChat");
            } else if ('id' in selectedChatState && selectedChatState.id === chatId) {
                setSelectedChatState(prevState => {
                    return { ...prevState, messages: [...prevState.messages.filter((message) => { return message.messageCreator.id !== userId; })] };
                });
                deleteSelectedChatParticipant(userId);
            }
        });

        socket.on("chatParticipantAdd", (participant: { chatParticipant: { id: string, username: string } }) => {
            addSelectedChatParticipant(participant.chatParticipant);
        });

        socket.on("chatCreate", () => {
            setUpdateChatList(prevState => { return !prevState; });
        });

        socket.on("emptySelectedChat", () => {
            emptySelectedChatState();
            setUpdateChatList(prevState => { return !prevState; });
        });

        socket.on("chatDelete", ({ chatId }) => {
            setUpdateChatList(prevState => { return !prevState; });
            if ('id' in selectedChatState && selectedChatState.id === chatId) { emptySelectedChatState(); }
        });

        return (): void => {
            socket.removeAllListeners();
        };
    }, []);

    useEffect(() => {
        socket.emit("onlineUsers");
    }, [socket]);

    const valuesToProvide = { onlineUserIds, socket, updateChatList };

    return (
        <SocketContext.Provider value={valuesToProvide}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;