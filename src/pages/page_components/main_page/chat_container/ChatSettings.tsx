import styles from "./ChatSettings.module.css";
import React, { useContext } from "react";
import AddParticipantMenu from "./chat_settings/AddParticipantMenu.tsx";
import { SelectedChatContext } from "../../../../Contexts/SelectedChatContext.ts";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import ParticipantsMenu from "./chat_settings/participants_menu/ParticipantsMenu.tsx";
import MoreSettingsMenu from "./chat_settings/more_settings_menu/MoreSettingsMenu.tsx";
import ArrowLeftIcon from "../../../../lib/icons/arrowLeftIcon.svg";

const ChatSettingButtons = (): React.JSX.Element => {

    const { selectedChatState, emptySelectedChatState } = useContext(SelectedChatContext);

    const { userInfoState } = useContext(UserInfoContext);

    const showAddParticipantMenu = Boolean(Boolean(selectedChatState.isGroup) && userInfoState.id === selectedChatState.creatorId);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <div className={styles.leftContainer}>
                    <button
                        type="button"
                        className={styles.toChatListButton}
                        onClick={() => { emptySelectedChatState(); }}
                    >
                        <img src={ArrowLeftIcon} alt="arrowlefticon" className={styles.arrowLeftIcon} />
                    </button>

                    {showAddParticipantMenu && <AddParticipantMenu />}
                    <ParticipantsMenu />
                </div>
                <div className={styles.rightContainer}>
                    <MoreSettingsMenu />
                </div>
            </div>
        </div>
    );
};

export default ChatSettingButtons;