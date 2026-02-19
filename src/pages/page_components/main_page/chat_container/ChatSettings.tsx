import styles from "./ChatSettings.module.css";
import React, { useContext } from "react";
import AddParticipantMenu from "./chat_settings/AddParticipantMenu.tsx";
import { SelectedChatContext } from "../../../../Contexts/SelectedChatContext.ts";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import ParticipantsMenu from "./chat_settings/participants_menu/ParticipantsMenu.tsx";
import MoreSettingsMenu from "./chat_settings/more_settings_menu/MoreSettingsMenu.tsx";
/* import ArrowLeftIcon from "../../../../lib/icons/arrowLeftIcon.svg?react"; */

const ChatSettingButtons = (): React.JSX.Element => {

    /* rename component to ManageChatBar or similar */

    const { selectedChatState } = useContext(SelectedChatContext);

    const { userInfoState } = useContext(UserInfoContext);

    const showAddParticipantMenu = Boolean(Boolean(selectedChatState.isGroup) && userInfoState.id === selectedChatState.creatorId);

    const chatIsGroup = Boolean(selectedChatState.isGroup);
    const chatTitle = chatIsGroup ? selectedChatState.chatName
        : selectedChatState.chatParticipants.find(((participant) => { return participant.id !== userInfoState.id; }))?.username;

    if (!selectedChatState.id) {
        return <div className={styles.emptyContainer}></div>;
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.chatInfoContainer}>
                        <div className={styles.chatImageContainer}>
                            {/* TODO: instead of text show image if it exists */}
                            <p className={styles.chatNoImageText}>{chatTitle?.substring(0, 1)}</p>
                        </div>
                        <div>
                            <p className={styles.chatTitleText}>
                                {chatTitle}
                            </p>
                            <p className={styles.chatTypeText}>
                                {chatIsGroup ? "Ryhmä" : "Yksityinen"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    {/* arrowleft should only be visible on mobile when chatlist or chat takes all the screen space */}
                    {/* <button
                        type="button"
                        className={styles.toChatListButton}
                        onClick={() => { emptySelectedChatState(); }}
                    >
                        <ArrowLeftIcon className={styles.arrowLeftIcon} />
                    </button> */}

                    {showAddParticipantMenu && <AddParticipantMenu />}
                    <ParticipantsMenu />
                    <MoreSettingsMenu />
                </div>
            </div>
        </div>
    );
};

export default ChatSettingButtons;