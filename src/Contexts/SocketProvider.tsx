import React, { useContext, useEffect, useState } from "react";
import { SelectedChatContext } from "./SelectedChatContext.ts";
import { io } from "socket.io-client";
import { UserInfoContext } from "./UserInfoContext.js";
import { setTabInfoNewMessages } from "../utils/tabInfo.ts";
import { SocketContext } from "./SocketContext.ts";


//make sure this is correct with cookies and cors and separate backend app
//it is most likely now wrong
const socket = io(
    //production
    "wss://flierchatserver-production.up.railway.app",
    //development
    /* "http://localhost:5000", */
    { autoConnect: false, withCredentials: true });

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

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();

            socket.on("connect", () => {
                socket.emit("userConnected");
            });
        }

        return (): void => {
            if (socket.connected) {
                socket.disconnect();
                socket.off();
            }
        };
    }, [userInfoState]);

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

        // check and correct the true type of message
        socket.on("message", ({ message }: {
            message: {
                id: string;
                value: string;
                timestamp: string;
                chatId: string;
                messageCreator: { id: string, username: string }
            }
        }) => {

            //find a way to clean out "id" typeguard
            if ('id' in userInfoState && message.messageCreator.id !== userInfoState.id) { setTabInfoNewMessages(); }
            setSelectedChatState(prevState => {
                return { ...prevState, messages: [...prevState.messages, message] };
            });
        });

        socket.on("messageDelete", (messageId) => {
            //socket part doesnt work
            setSelectedChatState(prevState => {
                return { ...prevState, messages: [...prevState.messages.filter((message) => { return message.id !== messageId; })] };
            });
        });
        //why this doesnt require type for userId???
        socket.on("messageDeleteAll", ({ userId }) => {
            if ('id' in selectedChatState && selectedChatState.id) {
                setSelectedChatState(prevState => {
                    return { ...prevState, messages: [...prevState.messages.filter((message) => { return message.messageCreator.id !== userId; })] };
                });
            }
        });

        socket.on("userDelete", () => {
            setUpdateChatList(!updateChatList);
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
        //correct participant type
        socket.on("chatParticipantAdd", (participant: { chatParticipant: { id: string } }) => {
            addSelectedChatParticipant(participant.chatParticipant);
        });

        socket.on("chatCreate", () => {
            setUpdateChatList(!updateChatList);
        });

        socket.on("emptySelectedChat", () => {
            emptySelectedChatState();
            setUpdateChatList(!updateChatList);
        });

        socket.on("chatDelete", ({ chatId }) => {
            setUpdateChatList(!updateChatList);
            if ('id' in selectedChatState && selectedChatState.id === chatId) { emptySelectedChatState(); }
        });

        return (): void => {
            socket.removeAllListeners();
        };
    }, [addSelectedChatParticipant, deleteSelectedChatParticipant, emptySelectedChatState, selectedChatState, setSelectedChatState, updateChatList, userInfoState]);

    const valuesToProvide = { onlineUserIds, socket, updateChatList };

    return (
        <SocketContext.Provider value={valuesToProvide}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;