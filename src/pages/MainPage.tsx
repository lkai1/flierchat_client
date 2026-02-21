import styles from "./MainPage.module.css";
import TopContainer from "./page_components/main_page/top_container/TopContainer.tsx";
import ChatsContainer from "./page_components/main_page/chats_container/ChatsContainer.tsx";
import ChatContainer from "./page_components/main_page/chat_container/ChatContainer.tsx";
import React, { useState } from "react";
import ArrowLeftIcon from "../lib/icons/arrowLeftIcon.svg?react";

const MainPage = (): React.JSX.Element => {

    const [viewSwitchState, setViewSwitchState] = useState(false);

    return (
        <div className={styles.mainContainer} >
            <TopContainer />
            <button
                className={styles.chatChatsSwitchButton}
                onClick={() => { setViewSwitchState(!viewSwitchState); }}
                is-shown={viewSwitchState ? "true" : "false"}
            >
                <ArrowLeftIcon className={styles.arrowLeftIcon} />
            </button>
            <div className={styles.middleContainer} >
                <ChatsContainer viewSwitchState={viewSwitchState} setViewSwitchState={() => { setViewSwitchState(true); }} />
                <ChatContainer viewSwitchState={viewSwitchState} />
            </div>
        </div>
    );
};

export default MainPage;