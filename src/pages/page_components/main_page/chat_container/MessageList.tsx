import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./MessageList.module.css";
import { SelectedChatContext } from "../../../../Contexts/SelectedChatContext.ts";
import { v4 as uuidv4 } from "uuid";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import { getTimestampStringFromISODateTime } from "../../../../utils/timestamp.ts";
import DeleteMessageMenu from "./message_list/DeleteMessageMenu.tsx";
import { getUnreadMessagesAmountInChatService } from "../../../../services/chatServices.ts";
import Linkify from "linkify-react";
import { setTabInfoNoNewMessages } from "../../../../utils/tabInfo.ts";

interface Message {
    id: string;
    value: string;
    timestamp: string;
    chatId: string;
    messageCreator: { id: string, username: string }
}

const MessageList = (): React.JSX.Element => {

    const { selectedChatState } = useContext(SelectedChatContext);
    const { userInfoState } = useContext(UserInfoContext);
    const [onHoverMessage, setOnHoverMessage] = useState("");
    const [messageListItemsState, setMessageListItemsState] = useState<React.JSX.Element[]>([]);
    const [messageListContainerState, setMessageListContainerState] = useState<React.JSX.Element>(<></>);
    const [unreadMessagesAmountState, setUnreadMessagesAmountState] = useState(0);
    const scrolledToFirstUnreadMessageElementRef = useRef(false);
    const firstUnreadMessageElementRef = useRef<HTMLDivElement | null>(null);
    const messageListRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const handleOnRenderEvents = async (): Promise<void> => {
            const unreadMessagesAmount = await getUnreadMessagesAmountInChatService(selectedChatState.id);
            setUnreadMessagesAmountState(unreadMessagesAmount.data);
        };

        void handleOnRenderEvents();
    }, [selectedChatState.id]);

    useEffect(() => {
        const UsernameAndTimestamp = ({ message }: { message: Message }): React.JSX.Element => {
            return (
                userInfoState.id === message.messageCreator.id ?
                    <div className={styles.userUsernameAndTimestampContainer}>
                        <p className={styles.timestamp}>{getTimestampStringFromISODateTime(message.timestamp)}</p>
                        <p className={styles.userUsernameText}>
                            {message.messageCreator.username}
                        </p>
                    </div>
                    :
                    <div className={styles.usernameAndTimestampContainer}>
                        <p className={styles.usernameText}>
                            {message.messageCreator.username}
                        </p>
                        <p className={styles.timestamp}>{getTimestampStringFromISODateTime(message.timestamp)}</p>
                    </div>
            );
        };

        const handleCreateMessageItemsList = (): void => {
            const messageItemsList = [];
            for (let i = 0; i < selectedChatState.messages.length; i++) {
                const message = selectedChatState.messages[i];
                const messageElement = <div
                    key={uuidv4()}
                    ref={(i === selectedChatState.messages.length - unreadMessagesAmountState) ? firstUnreadMessageElementRef : null}
                    className={userInfoState.id === message.messageCreator.id ? styles.userMessageContainer : styles.messageContainer}
                    onMouseEnter={(event) => {
                        event.preventDefault();
                        setOnHoverMessage(message.id);
                    }}
                    onMouseLeave={(event) => {
                        event.preventDefault();
                        setOnHoverMessage("");
                    }}
                >
                    <div className={userInfoState.id === message.messageCreator.id ? styles.userMessageContainer : styles.messageContainer}>
                        <div className={styles.messageTopContainer}>
                            {userInfoState.id === message.messageCreator.id && <DeleteMessageMenu messageId={message.id} chatId={selectedChatState.id} isHovered={onHoverMessage === message.id} />}
                            <UsernameAndTimestamp message={message} />
                        </div>
                        <p className={userInfoState.id === message.messageCreator.id ? styles.userMessageText : styles.messageText}>
                            <Linkify as="span" options={{
                                target: "_blank",
                                rel: "noopener noreferrer"
                            }}>
                                {message.value}
                            </Linkify>
                        </p>
                    </div>
                </div>;

                if (i === selectedChatState.messages.length - unreadMessagesAmountState) {
                    messageItemsList.push(<p key={uuidv4()} className={styles.newMessagesInfoText}>{`${unreadMessagesAmountState} uutta viestiä`}</p>);
                }
                messageItemsList.push(messageElement);
            }
            setMessageListItemsState([...messageItemsList].reverse());
        };
        handleCreateMessageItemsList();

    }, [onHoverMessage, selectedChatState.id, selectedChatState.messages, unreadMessagesAmountState, userInfoState.id]);

    useEffect(() => {
        const handleCreateMessageListContainer = (): void => {
            setMessageListContainerState(
                <div className={styles.messageListContainer}
                    ref={messageListRef}
                    onClick={() => {
                        setUnreadMessagesAmountState(0);
                        setTabInfoNoNewMessages();
                    }}
                >
                    {messageListItemsState}
                </div>
            );
        };
        handleCreateMessageListContainer();
    }, [messageListItemsState, selectedChatState.id, unreadMessagesAmountState]);


    if (
        firstUnreadMessageElementRef.current
        && !scrolledToFirstUnreadMessageElementRef.current
        && unreadMessagesAmountState
    ) {
        firstUnreadMessageElementRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        scrolledToFirstUnreadMessageElementRef.current = true;
    }

    return (
        <div className={styles.mainContainer}>
            {selectedChatState.messages.length > 0 ?
                messageListContainerState
                :
                <div className={styles.noMessagesContainer}>
                    <p className={styles.noMessagesText}>
                        Ei viestejä vielä
                    </p>
                </div>
            }
        </div>
    );
};

export default MessageList;