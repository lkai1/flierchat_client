import styles from "./UserMenu.module.css";
import React, { useContext, useState } from "react";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import { logoutService } from "../../../../services/authServices.ts";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../../../Contexts/SocketContext.ts";
import UserIcon from "../../../../lib/icons/userIcon.svg?react";


const UserMenu = (): React.JSX.Element => {

    const [isShown, setIsShown] = useState(false);
    const { userInfoState } = useContext(UserInfoContext);
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();

    return (
        <div className={styles.mainContainer}>
            <button className={styles.openMenuButton}
                type="button"
                onClick={() => { setIsShown(!isShown); }}
            >
                <p className={styles.username}>{userInfoState.username}</p>
                <div className={styles.userIconContainer}>
                    <UserIcon className={styles.userIcon} />
                </div>
            </button>
            <div className={isShown ? styles.menu : styles.menuHidden}>
                <button className={styles.navigateToUserSettingsButton}
                    type="button"
                    onClick={() => {
                        void navigate("/user_settings");
                    }}
                >
                    <p className={styles.navigateToUserSettingsButtonText}>Käyttäjäasetukset</p>
                </button>
                <button className={styles.logoutButton}
                    type="button"
                    onClick={() => {
                        void logoutService(navigate, socket);
                    }}>
                    Kirjaudu ulos
                </button>
            </div>
        </div>
    );
};

export default UserMenu;