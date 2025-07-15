import styles from "./AddParticipantMenu.module.css";
import React, { useContext, useState } from "react";
import AddIcon from "../../../../../lib/icons/addIcon.svg";
import CloseIcon from "../../../../../lib/icons/closeIcon.svg";
import { UserInfoContext } from "../../../../../Contexts/UserInfoContext.ts";
import { SelectedChatContext } from "../../../../../Contexts/SelectedChatContext.ts";
import { addGroupChatParticipantService } from "../../../../../services/chatServices.ts";
import { SocketContext } from "../../../../../Contexts/SocketContext.ts";

const AddParticipantMenu = (): React.JSX.Element => {
    const [isMenuShown, setIsMenuShown] = useState(false);
    const [toAddUsername, setToAddUsername] = useState("");
    const [notification, setNotification] = useState({ value: "", color: 1 });

    const { userInfoState } = useContext(UserInfoContext);
    const { selectedChatState } = useContext(SelectedChatContext);
    const { socket } = useContext(SocketContext);

    const showMainContainer = Boolean(Boolean(selectedChatState.isGroup) && userInfoState.id === selectedChatState.creatorId);

    const handleAddUserClick = async (chatId: string, username: string, setNotification: React.Dispatch<React.SetStateAction<{ value: string, color: number }>>): Promise<void> => {
        const result = await addGroupChatParticipantService(chatId, username);
        if (result.success) { socket.emit("chatParticipantAdd", { chatId, participantId: result.data }); }
        setNotification({ value: result.message, color: result.success ? 1 : 2 });
        setToAddUsername("");
    };

    return (
        <div className={showMainContainer ? styles.mainContainer : styles.hiddenMainContainer}>
            <button className={styles.openMenuButton}
                type="button"
                onClick={() => { setIsMenuShown(!isMenuShown); }}
                title="Lisää käyttäjä"
            >
                <img src={AddIcon} alt="addicon" className={styles.addIcon} />
            </button>
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.topTitle}>Lisää käyttäjä</p>
                        <button className={styles.closeButton}
                            type="button"
                            onClick={() => { setIsMenuShown(false); }}
                        >
                            <img src={CloseIcon} alt="closeicon" className={styles.closeIcon} />
                        </button>
                    </div>
                    <p className={notification.color === 1 ? styles.notificationText : styles.notificationErrorText}>{notification.value}</p>
                    <form
                        className={styles.addUserForm}
                        onSubmit={(event) => {
                            event.preventDefault();
                            void handleAddUserClick(selectedChatState.id, toAddUsername, setNotification);
                        }}
                    >
                        <input
                            className={styles.inputField}
                            value={toAddUsername}
                            placeholder="Käyttäjän nimi..."
                            onChange={(event) => { setToAddUsername(event.target.value); }}
                        />
                        <input
                            type="submit"
                            className={styles.addButton}
                            value={"Lisää käyttäjä keskusteluun"}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddParticipantMenu;