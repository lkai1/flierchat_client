import styles from "./ChatList.module.css";
import ChatItem from "./ChatItem.tsx";
import React, { useEffect, useState } from "react";
import { Chat } from "../../../../lib/types/Chat.ts";

interface Props {
    chats: Chat[];
    loading: boolean;
    setViewSwitchState(): void;
}

const ChatList = ({ chats, loading, setViewSwitchState }: Props): React.JSX.Element => {
    const [chatItems, setChatItems] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const createChatItems = (): void => {
            if (chats.length === 0) {
                setChatItems([]);
                return;
            }

            const chatItemsList = [];
            for (let i = 0; i < chats.length; i++) {
                chatItemsList.push(
                    <ChatItem
                        key={chats[i].id}
                        chat={chats[i]}
                        setViewSwitchState={setViewSwitchState}
                    />
                );
            }
            setChatItems(chatItemsList);
        };

        createChatItems();
    }, [chats]);

    return (
        <div className={styles.chatListMainContainer}>
            {!loading &&
                chatItems
            }
        </div>
    );
};

export default ChatList;

