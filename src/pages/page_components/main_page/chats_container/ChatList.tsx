import styles from "./ChatList.module.css";
import ChatItem from "./ChatItem.tsx";
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from "react";
import { getUnreadMessagesAmountInChatService } from "../../../../services/chatServices.js";

interface Chat {
    Chat: {
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
}

const ChatList = ({ chats, loading }: { chats: Chat[], loading: boolean }): React.JSX.Element => {
    const [chatItems, setChatItems] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const createChatItems = async (): Promise<void> => {
            const chatItemsList = [];

            if (chats.length > 0) {
                for (let i = 0; i < chats.length; i++) {
                    const unreadMessagesAmountInChat = await getUnreadMessagesAmountInChatService(chats[i].Chat.id);

                    chatItemsList.push(
                        <ChatItem
                            key={uuidv4()}
                            chat={chats[i].Chat}
                            unreadMessagesAmount={unreadMessagesAmountInChat.data}
                            isFirst={i === 0}
                            isLast={i === chats.length - 1}
                        />
                    );
                }
                setChatItems(chatItemsList);
            }
        };

        void createChatItems();

    }, [chats]);

    return (
        <div className={styles.mainContainer}>
            {!loading &&
                chatItems
            }
        </div>
    );
};

export default ChatList;

