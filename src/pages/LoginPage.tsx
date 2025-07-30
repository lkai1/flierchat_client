import React, { useState } from "react";
import { loginService } from "../services/authServices.ts";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import logo from "../lib/images/flierchat_logo.png";

const LoginPage = (): React.JSX.Element => {

    const [notification, setNotification] = useState("");
    const emptyLoginCreds = { username: "", password: "" };
    const [loginCreds, setLoginCreds] = useState(emptyLoginCreds);
    const navigate = useNavigate();

    const handleFormSubmit = async (
        emptyLoginCreds: { username: string, password: string },
        loginCreds: { username: string, password: string },
        setLoginCreds: React.Dispatch<React.SetStateAction<{ username: string, password: string }>>,
        setNotification: React.Dispatch<React.SetStateAction<string>>
    ): Promise<void> => {
        const result = await loginService(loginCreds);
        setLoginCreds(emptyLoginCreds);

        if (result.success) {
            void navigate("/main");
        } else {
            setNotification(result.message);
        }
    };

    return (
        <div className={styles.mainContainer} >
            <img
                src={logo}
                alt="img"
                className={styles.logoImg}
            />
            <div className={styles.loginContainer}>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        void handleFormSubmit(emptyLoginCreds, loginCreds, setLoginCreds, setNotification);
                    }}>
                    <div className={styles.formContentContainer}>
                        <div className={styles.headerContainer}>
                            <p className={styles.headerText}>
                                KIRJAUTUMINEN
                            </p>
                        </div>
                        < p className={styles.notification} > {notification} </p>
                        < div className={styles.inputsContainer} >
                            <input
                                placeholder="Käyttäjänimi"
                                className={styles.inputField}
                                type="text"
                                value={loginCreds.username}
                                onChange={(event) => {
                                    setLoginCreds((prevState) => {
                                        return { ...prevState, username: event.target.value };
                                    });
                                }}
                            />
                            < input
                                placeholder="Salasana"
                                className={styles.inputField}
                                type="password"
                                value={loginCreds.password}
                                onChange={(event) => {
                                    setLoginCreds((prevState) => {
                                        return { ...prevState, password: event.target.value };
                                    });
                                }}
                            />
                        </div>
                        < input
                            className={styles.submitButton}
                            type="submit" value={"Kirjaudu"} />
                    </div>
                </form>
                < button className={styles.toRegistrationButton}
                    type="button"
                    onClick={() => { void navigate("/register"); }}
                >
                    Rekisteröidy ?
                </button>
            </div>
        </div>
    );
};

export default LoginPage;