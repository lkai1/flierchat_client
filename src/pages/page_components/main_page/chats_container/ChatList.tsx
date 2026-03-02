import styles from "./ChatList.module.css";
import ChatItem from "./ChatItem.tsx";
import { v4 as uuidv4 } from 'uuid';
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
            const chatItemsList = [];

            if (chats.length > 0) {
                for (let i = 0; i < chats.length; i++) {

                    chatItemsList.push(
                        <ChatItem
                            key={uuidv4()}
                            chat={chats[i]}
                            setViewSwitchState={setViewSwitchState}
                        />
                    );
                }
                setChatItems(chatItemsList);
            }
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

