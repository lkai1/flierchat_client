import styles from "./DeleteUserMessagesMenu.module.css";
import DeleteIcon from "../../../../../../lib/icons/deleteIcon.svg";
import CloseIcon from "../../../../../../lib/icons/closeIcon.svg";
import React, { useContext, useState } from "react";
import { SelectedChatContext } from "../../../../../../Contexts/SelectedChatContext.ts";
import { deleteAllUserMessagesFromChatService } from "../../../../../../services/messageServices.ts";
import { SocketContext } from "../../../../../../Contexts/SocketContext.ts";

const DeleteUserMessagesMenu = (): React.JSX.Element => {

    const [isMenuShown, setIsMenuShown] = useState(false);
    const [notification, setNotification] = useState("");
    const { selectedChatState } = useContext(SelectedChatContext);
    const { socket } = useContext(SocketContext);

    const handleDeleteAllUserMessagesFromChat = async (chatId: string): Promise<void> => {
        const result = await deleteAllUserMessagesFromChatService(chatId);
        if (result.success) {
            setIsMenuShown(false);
            socket.emit("messageDeleteAll", { chatId });
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
                <p className={styles.openMenuButtonText}>Poista kaikki viestisi</p>
                <div className={styles.openMenuButtonIcon}>
                    <div className={styles.iconContainer}>
                        <img src={DeleteIcon} alt="deleteicon" className={styles.deleteIcon} />
                    </div>
                </div>
            </button>
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.topTitle}>Poistetaanko kaikki viestisi?</p>
                        <button className={styles.closeButton}
                            type="button"
                            onClick={() => { setIsMenuShown(false); }}
                        >
                            <img src={CloseIcon} alt="closeicon" className={styles.closeIcon} />
                        </button>
                    </div>
                    <p className={styles.notificationText}>{notification}</p>
                    <button className={styles.deleteButton}
                        type="button"
                        onClick={() => { void handleDeleteAllUserMessagesFromChat(selectedChatState.id); }}
                    >
                        Vahvista
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserMessagesMenu;