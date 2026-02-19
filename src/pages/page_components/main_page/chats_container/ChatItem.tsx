import styles from "./ChatItem.module.css";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import React, { useContext } from "react";
import { SelectedChatContext } from "../../../../Contexts/SelectedChatContext.ts";
import { SocketContext } from "../../../../Contexts/SocketContext.ts";

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

const ChatItem = ({ chat, unreadMessagesAmount }: { chat: Chat, unreadMessagesAmount: number }
): React.JSX.Element => {

    const { userInfoState, userInfoLoading } = useContext(UserInfoContext);
    const { updateSelectedChatState, selectedChatState } = useContext(SelectedChatContext);
    const { socket, onlineUserIds } = useContext(SocketContext);

    const chatIsGroup = Boolean(chat.isGroup);

    const getChatTitle = (chat: Chat, userInfoState: { id: string, username: string }, userInfoLoading: boolean): string => {
        if (userInfoLoading) { return ""; }

        if (chatIsGroup) { return chat.chatName; }

        const title = chat.chatParticipants.find((participant) => {
            return participant.username !== userInfoState.username;
        })?.username;

        return title ?? "";
    };

    const chatType = chatIsGroup ? "Ryhmä" : "Yksityinen";
    /* const chatIcon = chatIsGroup ? <GroupIcon className={styles.chatIconImg} /> : <UserIcon className={styles.chatIconImg} />; */

    const chatHasOtherOnlineUsers = chat.chatParticipants.find((participant) => {
        return userInfoState.id !== participant.id && onlineUserIds.includes(participant.id);
    });

    return (
        <div className={styles.mainContainer}
            onClick={() => {
                socket.emit("selectChat", { chatId: chat.id });
                updateSelectedChatState(chat);
            }}
            is-selected={selectedChatState.id === chat.id ? "true" : "false"}
        >
            <div className={styles.chatImageContainer}>
                {/* this should be moved out of rendering and changed to simple variable */}
                <p className={styles.chatNoImageText}>
                    {getChatTitle(chat, userInfoState, userInfoLoading).substring(0, 1)}
                </p>
                <div className={styles.onlineStatusCircle}
                    user-online={chatHasOtherOnlineUsers ? "true" : "false"}></div>
                {unreadMessagesAmount ?
                    <div className={styles.unreadMessagesAmountContainer}>
                        <p className={styles.unreadMessagesAmountText}>{unreadMessagesAmount > 9 ? ">9" : unreadMessagesAmount}</p>
                    </div>
                    :
                    <></>
                }
            </div>
            <div className={styles.typeAndTitleTextContainer}>
                <p className={styles.titleText}>
                    {getChatTitle(chat, userInfoState, userInfoLoading)}
                </p>
                <p className={styles.typeText}>
                    {chatType}
                </p>
            </div>
        </div >
    );
};

export default ChatItem;