import logo from "@assets/img/logo.svg";
import "@src/styles/index.css";
import styles from "./App.module.css";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

const App = () => {
  console.log('hello world')
  return (
    <div class="fixed right-5 top-20 z-[2000] w-80 rounded-xl bg-white">
      <div class={styles.App}>
      </div>
    </div>
  );
};

export default App;
