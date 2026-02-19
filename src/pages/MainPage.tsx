import styles from "./MainPage.module.css";
import TopContainer from "./page_components/main_page/top_container/TopContainer.tsx";
import ChatsContainer from "./page_components/main_page/chats_container/ChatsContainer.tsx";
import ChatContainer from "./page_components/main_page/chat_container/ChatContainer.tsx";
import React from "react";

const MainPage = (): React.JSX.Element => {


    return (
        <div className={styles.mainContainer} >
            <TopContainer />
            <div className={styles.middleContainer} >
                <ChatsContainer />
                <ChatContainer />
            </div>
        </div>
    );
};

export default MainPage;