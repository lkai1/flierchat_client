import React, { useContext } from "react";
import styles from "./ParticipantList.module.css";
import { SelectedChatContext } from "../../../../../../Contexts/SelectedChatContext.ts";
import ParticipantItem from "./ParticipantItem.tsx";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "../../../../../../Contexts/SocketContext.ts";

const ParticipantList = (): React.JSX.Element => {

    const { selectedChatState } = useContext(SelectedChatContext);
    const { onlineUserIds } = useContext(SocketContext);

    return (
        <div className={styles.mainContainer}>
            {selectedChatState.chatParticipants.length > 0 &&
                selectedChatState.chatParticipants.map((chatParticipant) => {
                    return <ParticipantItem
                        key={uuidv4()}
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