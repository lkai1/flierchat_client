import styles from "./RemoveParticipantMenu.module.css";
import DeleteIcon from "../../../../../../lib/icons/deleteIcon.svg?react";
import CloseIcon from "../../../../../../lib/icons/closeIcon.svg?react";
import React, { useContext, useState } from "react";
import { removeChatParticipantService } from "../../../../../../services/chatServices.js";
import { SocketContext } from "../../../../../../Contexts/SocketContext.ts";
import { UserInfoContext } from "../../../../../../Contexts/UserInfoContext.ts";

const RemoveParticipantMenu = ({ participantId, chatId }: { participantId: string, chatId: string }): React.JSX.Element => {

    const [isMenuShown, setIsMenuShown] = useState(false);
    const [notification, setNotification] = useState("");
    const { socket } = useContext(SocketContext);
    const { userInfoState } = useContext(UserInfoContext);

    const handleRemoveParticipantClick = async (chatId: string, participantId: string): Promise<void> => {
        const result = await removeChatParticipantService(chatId, participantId);
        if (result.success) {
            socket.emit("chatParticipantRemove", { chatId, participantId });
        } else {
            setNotification(result.message);
        }
    };

    return (
        <div className={styles.mainContainer}>
            {userInfoState.id !== participantId &&
                <button className={styles.openMenuButton}
                    type="button"
                    onClick={() => { setIsMenuShown(!isMenuShown); }}
                >
                    <div className={styles.openMenuButtonIcon}>
                        <div className={styles.iconContainer}>
                            <DeleteIcon className={styles.deleteIcon} />
                        </div>
                    </div>
                </button>
            }
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.topTitle}>Poistetaanko käyttäjä keskustelusta?</p>
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
                        onClick={() => { void handleRemoveParticipantClick(chatId, participantId); }}
                    >
                        Vahvista
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveParticipantMenu;