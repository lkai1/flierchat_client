import styles from "./UserSettingsPage.module.css";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserService } from "../services/userServices.js";
import DeleteIcon from "../lib/icons/deleteIcon.svg?react";
import CloseIcon from "../lib/icons/closeIcon.svg?react";
import { logoutService } from "../services/authServices.js";
import ArrowLeftIcon from "../lib/icons/arrowLeftIcon.svg?react";
import { SocketContext } from "../Contexts/SocketContext.ts";
import { getUserChatsService } from "../services/chatServices.js";

const UserSettingsPage = (): React.JSX.Element => {

    const [isMenuShown, setIsMenuShown] = useState(false);
    const [notification, setNotification] = useState("");
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();

    const handleDeleteUserClick = async (): Promise<void> => {
        const userChats = await getUserChatsService();
        const result = await deleteUserService();
        if (result.success) {
            setIsMenuShown(false);
            const userChatIds = userChats.map((chat) => { return chat.id; });
            socket.emit("userDelete", { userChatIds });
            await logoutService(navigate, socket);
        } else {
            setNotification(result.message);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <button className={styles.navigateToMainPageButton}
                type="button"
                onClick={() => { void navigate("/main"); }}
            >
                <div className={styles.navigateToMainPageButtonIcon}>
                    <div className={styles.iconContainer}>
                        <ArrowLeftIcon className={styles.navigateToMainPageButtonIconImg} />
                    </div>
                </div>
                <p className={styles.navigateToMainPageButtonText}>Takaisin keskusteluihin</p>
            </button>
            <div className={styles.openDeleteUserMenuButtonContainer}>
                <button className={styles.openMenuButton}
                    type="button"
                    onClick={() => { setIsMenuShown(!isMenuShown); }}
                >
                    <p className={styles.openMenuButtonText}>Poista käyttäjätili</p>
                    <div className={styles.openMenuButtonIcon}>
                        <div className={styles.iconContainer}>
                            <DeleteIcon className={styles.openMenuButtonImg} />
                        </div>
                    </div>
                </button>
            </div>
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.topTitle}>Poistetaanko käyttäjätili?</p>
                        <button className={styles.closeButton}
                            type="button"
                            onClick={() => { setIsMenuShown(false); }}
                        >
                            <CloseIcon className={styles.closeButtonImg} />
                        </button>
                    </div>
                    <p className={styles.notificationText}>{notification}</p>
                    <button className={styles.deleteButton}
                        type="button"
                        onClick={() => { void handleDeleteUserClick(); }}
                    >
                        Vahvista
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSettingsPage;