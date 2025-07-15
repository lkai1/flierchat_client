import styles from "./MainPage.module.css";
import TopContainer from "./page_components/main_page/top_container/TopContainer.tsx";
import ChatsContainer from "./page_components/main_page/chats_container/ChatsContainer.tsx";
import ChatContainer from "./page_components/main_page/chat_container/ChatContainer.tsx";
import React, { useContext } from "react";
import { SelectedChatContext } from "../Contexts/SelectedChatContext.ts";

const MainPage = (): React.JSX.Element => {

    const { selectedChatState } = useContext(SelectedChatContext);

    return (
        <div className={styles.mainContainer} >
            <TopContainer />
            <div className={styles.middleContainer} >
                {selectedChatState.id ?
                    <ChatContainer />
                    :
                    <ChatsContainer />
                }
            </div>
        </div>
    );
};

export default MainPage;