import React, { useState } from "react";
import { registerService } from "../services/authServices.js";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import logo from "../lib/images/flierchat_logo.png";

const RegisterPage = (): React.JSX.Element => {

    const [notification, setNotification] = useState("");
    const emptyRegisterCreds = { username: "", password: "", password2: "" };
    const [registerCreds, setRegisterCreds] = useState(emptyRegisterCreds);
    const navigate = useNavigate();

    const handleFormSubmit = async (
        emptyRegisterCreds: { username: string, password: string, password2: string },
        registerCreds: { username: string, password: string, password2: string },
        setRegisterCreds: React.Dispatch<React.SetStateAction<{
            username: string;
            password: string;
            password2: string;
        }>>,
        setNotification: React.Dispatch<React.SetStateAction<string>>
    ): Promise<void> => {
        const result = await registerService(registerCreds);
        setRegisterCreds(emptyRegisterCreds);

        if (result.success) {
            void navigate("/login");
        } else {
            setNotification(result.message);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.logoContainer}>
                <img
                    src={logo}
                    alt="img"
                    className={styles.logoImg}
                />
            </div>
            <div className={styles.registerContainer}>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        void handleFormSubmit(emptyRegisterCreds, registerCreds, setRegisterCreds, setNotification);
                    }}>
                    <div className={styles.formContentContainer}>
                        <div className={styles.headerContainer}>
                            <p className={styles.headerText}>
                                REKISTERÖITYMINEN
                            </p>
                        </div>
                        <p className={styles.guideTextTop}>
                            Käyttäjänimi: 3-20 kirjainta tai numeroa.
                        </p>
                        <p className={styles.guideTextTop}>
                            {"Salasana: 8-30 merkkiä. Sallitut erikoismerkit (@$!%*?&)."}
                        </p>
                        <p className={notification ? styles.notification : styles.notificationHidden}>{notification}</p>
                        <div className={styles.inputsContainer}>
                            <input
                                placeholder="Käyttäjänimi"
                                className={styles.inputField}
                                type="text"
                                value={registerCreds.username}
                                onChange={(event) => {
                                    setRegisterCreds((prevState) => {
                                        return { ...prevState, username: event.target.value };
                                    });
                                }}
                            />
                            <input
                                placeholder="Salasana"
                                className={styles.inputField}
                                type="password"
                                value={registerCreds.password}
                                onChange={(event) => {
                                    setRegisterCreds((prevState) => {
                                        return { ...prevState, password: event.target.value };
                                    });
                                }}
                            />
                            <input
                                placeholder="Salasana uudelleen"
                                className={styles.inputField}
                                type="password"
                                value={registerCreds.password2}
                                onChange={(event) => {
                                    setRegisterCreds((prevState) => {
                                        return { ...prevState, password2: event.target.value };
                                    });
                                }}
                            />
                        </div>
                        <p className={styles.guideTextBottom}>
                            Salasanaa ei voi palauttaa, joten ota se talteen!
                        </p>
                        <input
                            className={styles.submitButton}
                            type="submit" value={"Rekisteröidy"} />
                    </div>
                </form>
                <button className={styles.toLoginButton}
                    type="button"
                    onClick={() => { void navigate("/login"); }}
                >
                    Kirjaudu sisään?
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;