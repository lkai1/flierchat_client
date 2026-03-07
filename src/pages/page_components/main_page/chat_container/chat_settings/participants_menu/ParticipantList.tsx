import React, { useContext } from "react";
import styles from "./ParticipantList.module.css";
import { SelectedChatContext } from "../../../../../../Contexts/SelectedChatContext.ts";
import ParticipantItem from "./ParticipantItem.tsx";
import { SocketContext } from "../../../../../../Contexts/SocketContext.ts";

const ParticipantList = (): React.JSX.Element => {

    const { selectedChatState } = useContext(SelectedChatContext);
    const { onlineUserIds } = useContext(SocketContext);

    return (
        <div className={styles.mainContainer}>
            {selectedChatState.chatParticipants.length > 0 &&
                selectedChatState.chatParticipants.map((chatParticipant) => {
                    return <ParticipantItem
                        key={chatParticipant.id}
                        userId={chatParticipant.id}
                        username={chatParticipant.username}
                        onlineUserIds={onlineUserIds}
                    />;
                })
            }
        </div>
    );
};

export default ParticipantList;