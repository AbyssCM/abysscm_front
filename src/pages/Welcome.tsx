import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Welcome.module.css";
import Navbar from "./Navbar";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const username = storedUser ? JSON.parse(storedUser).nickname : "XXX";
  const handleStart = () => {
    console.log("시작하기 버튼 클릭");
    navigate("/payment"); // Payment 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
          <span className={styles.username}>{username}</span>님<br /> 환영해요!<br />
          Abyss가 처음이시네요!
        </h1>

        <button className={styles.startButton} onClick={handleStart}>
          시작하기
        </button>
      </div>
    </div>
  );
};

export default Welcome;
