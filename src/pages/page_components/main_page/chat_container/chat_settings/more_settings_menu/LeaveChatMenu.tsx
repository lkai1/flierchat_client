import styles from "./LeaveChatMenu.module.css";
import CloseIcon from "../../../../../../lib/icons/closeIcon.svg?react";
import React, { useContext, useState } from "react";
import { SelectedChatContext } from "../../../../../../Contexts/SelectedChatContext.ts";
import { removeChatParticipantService } from "../../../../../../services/chatServices.ts";
import { SocketContext } from "../../../../../../Contexts/SocketContext.ts";
import { UserInfoContext } from "../../../../../../Contexts/UserInfoContext.ts";

const LeaveChatMenu = (): React.JSX.Element => {

    const [isMenuShown, setIsMenuShown] = useState(false);
    const [notification, setNotification] = useState("");
    const { selectedChatState } = useContext(SelectedChatContext);
    const { userInfoState } = useContext(UserInfoContext);
    const { socket } = useContext(SocketContext);

    const handleLeaveChatClick = async (chatId: string, userId: string): Promise<void> => {
        const result = await removeChatParticipantService(chatId, userId);
        if (result.success) {
            socket.emit("emptySelectedChat");
            socket.emit("chatParticipantRemove", { chatId, participantId: userId });
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
                <p className={styles.openMenuButtonText}>Poistu keskustelusta</p>
            </button>
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.topTitle}>Poistutaanko keskustelusta?</p>
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
                        onClick={() => { void handleLeaveChatClick(selectedChatState.id, userInfoState.id); }}
                    >
                        Vahvista
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveChatMenu;