import styles from "./ChatItem.module.css";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import React, { useContext } from "react";
import { SelectedChatContext } from "../../../../Contexts/SelectedChatContext.ts";
import { SocketContext } from "../../../../Contexts/SocketContext.ts";
import { Chat } from "../../../../lib/types/Chat.ts";


interface Props {
    setViewSwitchState(): void;
    chat: Chat
}

const ChatItem = ({ chat, setViewSwitchState }: Props): React.JSX.Element => {

    const { userInfoState, userInfoLoading } = useContext(UserInfoContext);
    const { updateSelectedChatState, selectedChatState } = useContext(SelectedChatContext);
    const { socket, onlineUserIds, getUnreadMessagesAmountForChat } = useContext(SocketContext);
    const unreadMessagesAmount = getUnreadMessagesAmountForChat(chat.id);

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

    const chatHasOtherOnlineUsers = chat.chatParticipants.find((participant) => {
        return userInfoState.id !== participant.id && onlineUserIds.includes(participant.id);
    });

    return (
        <div className={styles.mainContainer}
            onClick={() => {
                socket.emit("selectChat", { chatId: chat.id });
                updateSelectedChatState(chat);
                setViewSwitchState();
            }}
            is-selected={selectedChatState.id === chat.id ? "true" : "false"}
        >
            <div className={styles.chatImageContainer}>
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