import styles from "./UserMenu.module.css";
import React, { useContext, useState } from "react";
import { UserInfoContext } from "../../../../Contexts/UserInfoContext.ts";
import { logoutService } from "../../../../services/authServices.ts";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../../../Contexts/SocketContext.ts";
import UserIcon from "../../../../lib/icons/userIcon.svg?react";
import LogoutIcon from "../../../../lib/icons/logout_icon.svg?react";
import SettingsIcon from "../../../../lib/icons/settings_icon.svg?react";


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
                    <p className={styles.userMenuButtonText}>Käyttäjäasetukset</p>
                    <SettingsIcon className={styles.userMenuButtonIcon} />
                </button>
                <button className={styles.logoutButton}
                    type="button"
                    onClick={() => {
                        void logoutService(navigate, socket);
                    }}>
                    <p className={styles.userMenuButtonText}>Kirjaudu ulos</p>
                    <LogoutIcon className={styles.userMenuButtonIcon} />
                </button>
            </div>
        </div>
    );
};

export default UserMenu;