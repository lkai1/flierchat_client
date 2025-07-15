import Router from "./routes/Router.js";
import styles from "./App.module.css";
import React from "react";

const App = (): React.JSX.Element => {
  return (
    <div className={styles.App}>
      <Router />
    </div>
  );
};

export default App;
