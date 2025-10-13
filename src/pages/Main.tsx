import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Main.module.css";

interface UserData {
  name: string;
  matching_count: number;
  consultation_count: number;
}

const Main: React.FC<MainProps> = ({ kakaoId }) => {
  const [username, setUsername] = useState("XXX");
  const [matchingCount, setMatchingCount] = useState(0);
  const [consultationCount, setConsultationCount] = useState(0);
  const storedUser = localStorage.getItem("user");
  const kakao_id = storedUser ? JSON.parse(storedUser).kakao_id : "XXX" ;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/users/${kakao_id}`);
        const userData: UserData = response.data;

        setUsername(userData.name);
        setMatchingCount(userData.matching_count);
        setConsultationCount(userData.consultation_count);
        console.log(response);
      } catch (error) {
        console.error("유저 데이터 조회 실패:", error);
      }
    };

    fetchUserData();
  }, [kakaoId]);

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* 타이틀 영역: 좌측 환영, 우측 통계 */}
        <div className={styles.titleRow}>
          <h1 className={styles.welcomeText}>
            <span className={styles.username}>{username}</span>님 환영해요!
          </h1>
          <div className={styles.stats}>
            <span>누적 상담 <span className={styles.statNumber}>{consultationCount}</span>회</span>
            <span> / </span>
            <span>누적 매칭 <span className={styles.statNumber}>{matchingCount}</span>회</span>
          </div>
        </div>

        {/* Abyss 메니저 상담 */}
        <div className={styles.card}>
          <div className={styles.cardText}>Abyss 매니저 상담</div>
          <div className={styles.cardBox}></div>
        </div>

        {/* 커플 매칭 */}
        <div className={styles.card}>
          <div className={styles.cardText}>커플 매칭</div>
          <div className={styles.cardBox}></div>
        </div>
      </div>
    </div>
  );
};

export default Main;
