import styles from "./TopContainer.module.css";
import UserMenu from "./UserMenu.tsx";
import React from "react";

const TopContainer = (): React.JSX.Element => {

    return (
        <div className={styles.mainContainer} >
            <h1 className={styles.logoTextContainer}>
                <span className={styles.logoText1}>flier</span>
                <span className={styles.logoText2}>chat</span>
            </h1>
            <UserMenu />
        </div>
    );
};

export default TopContainer;