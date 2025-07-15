import styles from "./ChatItem.module.css";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import React, { useContext } from "react";
import GroupIcon from "../../../../lib/icons/groupIcon.svg";
import UserIcon from "../../../../lib/icons/userIcon.svg";
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

const ChatItem = ({ chat, unreadMessagesAmount, isFirst, isLast }: { chat: Chat, unreadMessagesAmount: number, isFirst: boolean, isLast: boolean }
): React.JSX.Element => {

    const { userInfoState, userInfoLoading } = useContext(UserInfoContext);
    const { updateSelectedChatState } = useContext(SelectedChatContext);
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
    const chatIcon = chatIsGroup ? <img src={GroupIcon} alt="groupicon" className={styles.chatIconImg} /> : <img src={UserIcon} alt="usericon" className={styles.chatIconImg} />;

    const chatHasOtherOnlineUsers = chat.chatParticipants.find((participant) => {
        return userInfoState.id !== participant.id && onlineUserIds.includes(participant.id);
    });

    return (
        <div className={styles.mainContainer}
            onClick={() => {
                socket.emit("selectChat", { chatId: chat.id });
                updateSelectedChatState(chat);
            }}
            is-first={isFirst.toString()}
            is-last={isLast.toString()}
        >
            <div className={styles.chatIconContainer}>
                {chatIcon}
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
                <p className={styles.typeText}>
                    {chatType}
                </p>
                <p className={styles.titleText}>
                    {getChatTitle(chat, userInfoState, userInfoLoading)}
                </p>
            </div>
        </div >
    );
};

export default ChatItem;