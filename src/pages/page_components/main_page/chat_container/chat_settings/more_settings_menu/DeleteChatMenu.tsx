import styles from "./DeleteChatMenu.module.css";
import DeleteIcon from "../../../../../../lib/icons/deleteIcon.svg?react";
import CloseIcon from "../../../../../../lib/icons/closeIcon.svg?react";
import React, { useContext, useState } from "react";
import { SelectedChatContext } from "../../../../../../Contexts/SelectedChatContext.ts";
import { deleteChatService } from "../../../../../../services/chatServices.ts";
import { SocketContext } from "../../../../../../Contexts/SocketContext.ts";

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

const DeleteChatMenu = (): React.JSX.Element => {

    const [isMenuShown, setIsMenuShown] = useState(false);
    const [notification, setNotification] = useState("");
    const { selectedChatState } = useContext(SelectedChatContext);
    const { socket } = useContext(SocketContext);

    const handleDeleteChatClick = async (chat: Chat): Promise<void> => {
        const participantIds = chat.chatParticipants.map((participant) => { return participant.id; });
        const result = await deleteChatService(chat.id);
        if (result.success) {
            setIsMenuShown(false);
            socket.emit("chatDelete", { participantIds });
        } else {
            setNotification(result.message);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <button className={styles.openMenuButton}
                type="button"
                onClick={() => { setIsMenuShown(!isMenuShown); }}
            >
                <p className={styles.openMenuButtonText}>Poista keskustelu</p>
                <div className={styles.openMenuButtonIcon}>
                    <div className={styles.iconContainer}>
                        <DeleteIcon className={styles.deleteIcon} />
                    </div>
                </div>
            </button>
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.topTitle}>Poistetaanko keskustelu?</p>
                        <button className={styles.closeButton}
                            type="button"
                            onClick={() => { setIsMenuShown(false); }}
                        >
                            <CloseIcon className={styles.closeIcon} />
                        </button>
                    </div>
                    <p className={styles.notificationText}>{notification}</p>
                    <button className={styles.deleteButton}
                        type="button"
                        onClick={() => { void handleDeleteChatClick(selectedChatState); }}
                    >
                        Vahvista
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteChatMenu;