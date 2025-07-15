import styles from "./DeleteMessageMenu.module.css";
import DeleteIcon from "../../../../../lib/icons/deleteIcon.svg";
import { deleteUserMessageService } from "../../../../../services/messageServices.ts";
import CloseIcon from "../../../../../lib/icons/closeIcon.svg";
import React, { useContext, useState } from "react";
import { SocketContext } from "../../../../../Contexts/SocketContext.ts";

const DeleteMessageMenu = ({ messageId, chatId, isHovered }:
    { messageId: string, chatId: string, isHovered: boolean }
): React.JSX.Element => {

    const [isMenuShown, setIsMenuShown] = useState(false);
    const [notification, setNotification] = useState("");
    const { socket } = useContext(SocketContext);

    const handleDeleteMessageClick = async (messageId: string): Promise<void> => {
        const result = await deleteUserMessageService(messageId);
        if (result.success) {
            setIsMenuShown(false);
            socket.emit("messageDelete", { messageId, chatId });
        } else {
            setNotification(result.message);
        }
    };

    return (
        <div>
            <button className={isHovered ? styles.openMenuButton : styles.openMenuButtonHidden}
                type="button"
                onClick={() => { setIsMenuShown(!isMenuShown); }}
            >
                <div className={styles.iconContainer}>
                    <img src={DeleteIcon} alt="deleteicon" className={styles.deleteIcon} />
                </div>
            </button>
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.topTitle}>Poistetaanko viesti?</p>
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
                        onClick={() => { void handleDeleteMessageClick(messageId); }}
                    >
                        Vahvista
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteMessageMenu;