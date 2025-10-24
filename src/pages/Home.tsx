// src/pages/Home.tsx
import React, { useEffect } from "react";
import styles from "./Home.module.css";

declare global {
  interface Window {
    Kakao: any;
  }
}

const KAKAO_JS_KEY = "5b13bf002507b6668e9aae915b7f35ad";
const REDIRECT_URI = "http://localhost:5173/oauth/kakao";


const Home: React.FC = () => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_KEY);
      console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
    }
  }, []);

  const handleLoginClick = () => {
    console.log("카카오 로그인 버튼 클릭됨");
    if (!window.Kakao) return;

    window.Kakao.Auth.authorize({
      redirectUri: REDIRECT_URI,
      scope: "profile_nickname", // 닉네임만 요청
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AbyssCM</h1>
      <p className={styles.subtitle}>
        운명을 기다리지 말고 당신의 결혼을 직접 세팅하세요
      </p>
      <img
        src="/kakao_login_medium_wide_1.png"
        alt="로그인 버튼"
        className={styles.loginButton}
        onClick={handleLoginClick}
      />
      <img src="/main.png" alt="메인 사진" className={styles.mainImage} />

      {/* 카카오 로그인 버튼 */}
      <img src="/bottom_img.png" alt="하단 이미지" className={styles.bottomImage} />
    </div>
  );
};

export default Home;
