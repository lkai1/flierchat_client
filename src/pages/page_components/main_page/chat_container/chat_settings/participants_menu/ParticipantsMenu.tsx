import styles from "./ParticipantsMenu.module.css";
import React, { useState } from "react";
import CloseIcon from "../../../../../../lib/icons/closeIcon.svg?react";
import GroupIcon from "../../../../../../lib/icons/groupIcon.svg?react";
import ParticipantList from "./ParticipantList.tsx";

const ParticipantsMenu = (): React.JSX.Element => {
    const [isMenuShown, setIsMenuShown] = useState(false);

    return (
        <div className={styles.mainContainer}>
            <button className={styles.openMenuButton}
                type="button"
                onClick={() => { setIsMenuShown(!isMenuShown); }}
                title="Lisää käyttäjä"
            >
                <GroupIcon className={styles.groupIcon} />
            </button>
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <div className={styles.topContainer}>
                        <p className={styles.topTitle}>Käyttäjälista</p>
                        <button className={styles.closeButton}
                            type="button"
                            onClick={() => { setIsMenuShown(false); }}
                        >
                            <CloseIcon className={styles.closeIcon} />
                        </button>
                    </div>
                    <div className="participantListContainer">
                        <ParticipantList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantsMenu;