import { SelectedChatContext } from "../../../../Contexts/SelectedChatContext.ts";
import MessageList from "./MessageList.tsx";
import styles from "./ChatContainer.module.css";
import React, { useContext, useState } from "react";
import { createMessageService } from "../../../../services/messageServices.ts";
import ChatSettings from "./ChatSettings.tsx";
import { SocketContext } from "../../../../Contexts/SocketContext.ts";
/* import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts"; */
import { updateUnreadMessagesAmountInChatService } from "../../../../services/chatServices.ts";

const ChatContainer = (): React.JSX.Element => {

    const [message, setMessage] = useState("");
    const { selectedChatState } = useContext(SelectedChatContext);
    /* const { userInfoState } = useContext(UserInfoContext); */
    const { socket } = useContext(SocketContext);
    const [notification, setNotification] = useState("");

    const handleFormSubmit = async (
        event: React.SubmitEvent<HTMLFormElement>,
        chatId: string,
        message: string,
        setMessage: React.Dispatch<React.SetStateAction<string>>
    ): Promise<void> => {
        event.preventDefault();
        const result = await createMessageService(chatId, message);
        if (result.success) {
            socket.emit("message", {
                message: result.message,
                chatId
            });
        } else { setNotification(typeof result.message === "string" ? result.message : ""); }
        setMessage("");
    };

    /* const chatIsGroup = Boolean(selectedChatState.isGroup); */
    /* const chatTitle = chatIsGroup ? selectedChatState.chatName
        : selectedChatState.chatParticipants.find(((participant) => { return participant.id !== userInfoState.id; }))?.username; */

    return (
        <div className={styles.mainContainer}
            onClick={() => {
                void updateUnreadMessagesAmountInChatService(selectedChatState.id);
            }}
        >
            <ChatSettings />
            {/* <div className={styles.chatInfoContainer}>
                <p className={styles.chatTypeText}>
                    {chatIsGroup ? "Ryhmä:" : "Yksityinen:"}
                </p>
                <p className={styles.chatTitleText}>
                    {chatTitle}
                </p>
            </div> */}
            <MessageList />
            <p className={notification ? styles.notificationShown : styles.notification}>{notification}</p>
            {selectedChatState.id &&
                <form
                    onSubmit={(event) => {
                        void handleFormSubmit(event, selectedChatState.id, message, setMessage);
                    }}
                >
                    <div className={styles.createMessageFormContentContainer}>
                        <input
                            className={styles.messageInput}
                            placeholder="Kirjoita viesti..."
                            value={message}
                            onChange={(event) => {
                                setMessage(event.target.value);
                            }}
                        />
                        <button
                            className={styles.sendMessageButton}
                            type="submit"
                        >
                            Lähetä
                        </button>
                    </div>
                </form>
            }
        </div>
    );
};

export default ChatContainer;