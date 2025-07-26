import styles from "./ChatsContainer.module.css";
import ChatList from "./ChatList.tsx";
import CreateNewChatModal from "./CreateNewChatModal.tsx";
import React, { useState, useEffect } from "react";
import AddIcon from "../../../../lib/icons/addIcon.svg?react";
import { getUserChatsService } from "../../../../services/chatServices.js";

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
        messageCreator: { id: string, username: string };
    }[];
}

const ChatsContainer = (): React.JSX.Element => {

    const [showCreateNewChatModal, setShowCreateNewChatModal] = useState(false);
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async (): Promise<void> => {
            const chats = await getUserChatsService();
            setChats(chats);
            setLoading(false);
        };
        void getData();
    }, []);


    return (
        <div className={styles.mainContainer} >
            {chats.length === 0 && !loading ?
                <div className={styles.noChatsContainer}>
                    <p className={styles.noChatsText}>
                        Sinulla ei ole keskusteluja
                    </p>
                </div>
                :
                <ChatList chats={chats} loading={loading} />
            }
            <div className={styles.bottomButtonsContainer}>
                <button className={styles.addChatButton}
                    type="button"
                    onClick={() => { setShowCreateNewChatModal(true); }}
                >
                    <AddIcon className={styles.addChatButtonImg} />
                    <p>Luo uusi keskustelu </p>
                </button>
            </div>
            <CreateNewChatModal
                isShown={showCreateNewChatModal}
                setIsShown={setShowCreateNewChatModal}
            />
        </div>
    );
};

export default ChatsContainer;