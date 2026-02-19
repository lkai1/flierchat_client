import styles from "./ParticipantItem.module.css";
/* import UserIcon from "../../../../../../lib/icons/userIcon.svg?react"; */
import React, { useContext } from 'react';
import { SelectedChatContext } from "../../../../../../Contexts/SelectedChatContext.ts";
import { UserInfoContext } from "../../../../../../Contexts/UserInfoContext.ts";
import RemoveParticipantMenu from "./RemoveParticipantMenu.js";

const ParticipantItem = ({ userId, username, onlineUserIds }: { userId: string, username: string, onlineUserIds: string[] }): React.JSX.Element => {

    const { userInfoState } = useContext(UserInfoContext);
    const { selectedChatState } = useContext(SelectedChatContext);

    const showRemoveParticipantMenu = userInfoState.id === selectedChatState.creatorId;

    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <div className={styles.userInfoContainer}>
                    <div className={styles.userImageContainer}>
                        <p className={styles.userNoImageText}>
                            {username.substring(0, 1)}
                        </p>
                        <div className={styles.onlineStatusCircle}
                            user-online={onlineUserIds.includes(userId) ? "true" : "false"}></div>
                    </div>
                    <div>
                        {userId === selectedChatState.creatorId &&
                            <p className={styles.creatorText}>
                                Keskustelun luoja
                            </p>
                        }
                        <p className={styles.username}>
                            {username}
                        </p>
                    </div>
                </div>
                {showRemoveParticipantMenu && <RemoveParticipantMenu participantId={userId} chatId={selectedChatState.id} />}
            </div>
        </div >
    );
};

export default ParticipantItem;