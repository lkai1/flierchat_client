import React, { useContext, useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import styles from "./MessageList.module.css";
import { SelectedChatContext } from "../../../../Contexts/SelectedChatContext.ts";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import { getTimestampStringFromISODateTime } from "../../../../utils/timestamp.ts";
import DeleteMessageMenu from "./message_list/DeleteMessageMenu.tsx";
import Linkify from "linkify-react";
import { SocketContext } from "../../../../Contexts/SocketContext.ts";

interface Message {
    id: string;
    value: string;
    timestamp: string;
    chatId: string;
    messageCreator: { id: string, username: string }
}

const MessageList = (): React.JSX.Element => {

    const { selectedChatState, hasMoreMessages, isLoadingMoreMessages, loadMoreMessages } = useContext(SelectedChatContext);
    const { userInfoState } = useContext(UserInfoContext);
    const [onHoverMessage, setOnHoverMessage] = useState("");
    const [messageListItemsState, setMessageListItemsState] = useState<React.JSX.Element[]>([]);
    const [messageListContainerState, setMessageListContainerState] = useState<React.JSX.Element>(<></>);
    const scrolledToFirstUnreadMessageElementRef = useRef(false);
    const firstUnreadMessageElementRef = useRef<HTMLDivElement | null>(null);
    const messageListRef = useRef<HTMLDivElement | null>(null);
    const { getUnreadMessagesAmountForChat, clearUnreadMessagesForChat } = useContext(SocketContext);
    const unreadMessagesAmount = getUnreadMessagesAmountForChat(selectedChatState.id);

    const scrollHeightBeforeLoadRef = useRef<number>(0);
    const wasLoadingMoreRef = useRef(false);

    useEffect(() => {
        if (isLoadingMoreMessages) {
            wasLoadingMoreRef.current = true;
            scrollHeightBeforeLoadRef.current = messageListRef.current?.scrollHeight ?? 0;
        }
    }, [isLoadingMoreMessages]);

    useLayoutEffect(() => {
        if (!wasLoadingMoreRef.current || !messageListRef.current) { return; }
        wasLoadingMoreRef.current = false;
        const newScrollHeight = messageListRef.current.scrollHeight;
        messageListRef.current.scrollTop = newScrollHeight - scrollHeightBeforeLoadRef.current;
    }, [selectedChatState.messages]);

    useEffect(() => {
        scrolledToFirstUnreadMessageElementRef.current = false;
    }, [selectedChatState.id]);

    const topSentinelRef = useRef<HTMLDivElement | null>(null);

    const handleSentinelIntersection = useCallback((entries: IntersectionObserverEntry[]): void => {
        if (entries[0].isIntersecting && hasMoreMessages && !isLoadingMoreMessages) {
            void loadMoreMessages();
        }
    }, [hasMoreMessages, isLoadingMoreMessages, loadMoreMessages]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleSentinelIntersection, {
            root: messageListRef.current,
            threshold: 0.1
        });

        if (topSentinelRef.current) {
            observer.observe(topSentinelRef.current);
        }

        return (): void => { observer.disconnect(); };
    }, [handleSentinelIntersection]);

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
                    key={message.id}
                    ref={(i === selectedChatState.messages.length - unreadMessagesAmount) ? firstUnreadMessageElementRef : null}
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

                if (i === selectedChatState.messages.length - unreadMessagesAmount) {
                    messageItemsList.push(<p key={`unread-banner-${selectedChatState.id}`} className={styles.newMessagesInfoText}>{`${unreadMessagesAmount} uutta viestiä`}</p>);
                }
                messageItemsList.push(messageElement);
            }

            const reversedList = [...messageItemsList].reverse();
            reversedList.push(
                <div key="top-sentinel" ref={topSentinelRef} style={{ height: "1px" }} />
            );
            if (isLoadingMoreMessages) {
                reversedList.push(
                    <div key="loading-more" className={styles.loadingMoreContainer}>
                        <p className={styles.loadingMoreText}>Ladataan...</p>
                    </div>
                );
            }

            setMessageListItemsState(reversedList);
        };
        handleCreateMessageItemsList();

    }, [onHoverMessage, selectedChatState.id, selectedChatState.messages, unreadMessagesAmount, userInfoState.id, isLoadingMoreMessages]);

    useEffect(() => {
        const handleCreateMessageListContainer = (): void => {
            setMessageListContainerState(
                <div className={styles.messageListContainer}
                    ref={messageListRef}
                    onClick={() => {
                        clearUnreadMessagesForChat(selectedChatState.id);
                    }}
                >
                    {messageListItemsState}
                </div>
            );
        };
        handleCreateMessageListContainer();
    }, [messageListItemsState, selectedChatState.id]);


    if (
        firstUnreadMessageElementRef.current
        && !scrolledToFirstUnreadMessageElementRef.current
        && unreadMessagesAmount
    ) {
        firstUnreadMessageElementRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        scrolledToFirstUnreadMessageElementRef.current = true;
    }

    return (
        <div className={styles.mainContainer}>
            {selectedChatState.id === "" ?
                <div className={styles.noMessagesContainer}>
                    <p className={styles.noMessagesText}>
                        Avaa tai luo uusi keskustelu
                    </p>
                </div>
                :
                selectedChatState.messages.length > 0 ?
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