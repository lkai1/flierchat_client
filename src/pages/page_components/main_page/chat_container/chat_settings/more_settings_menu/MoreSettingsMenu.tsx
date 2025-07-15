import styles from "./MoreSettingsMenu.module.css";
import DotsIcon from "../../../../../../lib/icons/dotsIcon.svg";
import React, { useState, useContext } from "react";
import DeleteChatMenu from "./DeleteChatMenu.tsx";
import { SelectedChatContext } from "../../../../../../Contexts/SelectedChatContext.ts";
import { UserInfoContext } from "../../../../../../Contexts/UserInfoContext.ts";
import DeleteUserMessagesMenu from "./DeleteUserMessagesMenu.tsx";
import LeaveChatMenu from "./LeaveChatMenu.tsx";

const MoreSettingsMenu = (): React.JSX.Element => {

    const [isMenuShown, setIsMenuShown] = useState(false);

    const { selectedChatState } = useContext(SelectedChatContext);
    const { userInfoState } = useContext(UserInfoContext);

    const showDeleteChatMenu = selectedChatState.creatorId === userInfoState.id;
    const showLeaveChatMenu = userInfoState.id !== selectedChatState.creatorId;

    return (
        <div>
            <button className={styles.openMenuButton}
                type="button"
                onClick={() => { setIsMenuShown(!isMenuShown); }}
                title="Lisää valintoja"
            >
                <img src={DotsIcon} alt="dotsicon" className={styles.dotsIcon} />
            </button>
            <div className={isMenuShown ? styles.menuContainer : styles.hiddenMenuContainer}>
                <div className={styles.contentContainer}>
                    <DeleteUserMessagesMenu />
                    {showDeleteChatMenu && <DeleteChatMenu />}
                    {showLeaveChatMenu && <LeaveChatMenu />}
                </div>
            </div>
        </div>
    );
};

export default MoreSettingsMenu;