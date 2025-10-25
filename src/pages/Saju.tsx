import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← 추가
import styles from "./Saju.module.css";
import Navbar from "./Navbar";
import axios from "axios";

const ABYSSCM_API_KEY = import.meta.env.VITE_ABYSSCM_API_KEY;
interface SajuProps {
  username?: string;
}

const Saju: React.FC<SajuProps> = () => {
    const storedUser = localStorage.getItem("user");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [userphonenumber, setUserPhonenumber] = useState("");
  const [username, setUsername] = useState(storedUser ? JSON.parse(storedUser).nickname : "XXX");
  const [calendar, setCalendar] = useState<"solar" | "lunar">("solar");
  const [gender, setgender] = useState("");  
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const navigate = useNavigate(); // ← 추가


  const handleSubmit = async () => {
    const jwt = localStorage.getItem("jwtToken"); // 저장된 JWT 가져오기
    if (!jwt) {
      alert("로그인이 필요합니다.");
      return;
    }

    const payload = {
      username,
      birthDate,
      birthTime,
      calendar,
      ampm,
      userphonenumber,
      gender,
    };

    try {
      const res = await axios.post(
        `${ABYSSCM_API_KEY}/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${jwt}`, // JWT를 헤더에 포함
          },
        }
      );
      console.log("서버 응답:", res.data);
      alert("가입이 완료되었어요!");
      navigate("/main");
    } catch (err: any) {
      console.error("AxiosError:", err);
      alert("가입실패, 관리자에게 문의하세요: " + err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
          <span className={styles.username}>사주</span>를 통해 <br/><span className={styles.username}>결혼운</span>을 알아볼까요?
        </h1>

        {/* 이름 (수정 불가) */}
        <div className={styles.inputGroup}>
          <div className={styles.labelRow}>
            <label className={styles.inputLabel}>이름</label>
            <div className={styles.textToggle}>
              <span
                className={`${styles.toggleText} ${gender === "남" ? styles.activeText : ""}`}
                onClick={() => setgender("남")}
              >
                남
              </span>
              <span className={styles.separator}>/</span>
              <span
                className={`${styles.toggleText} ${gender === "여" ? styles.activeText : ""}`}
                onClick={() => setgender("여")}
              >
                여
              </span>
            </div>
          </div>
          <input
            type="text"
            className={styles.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>상담 받으실 연락처</label>
          <input
            type="text"
            className={styles.inputField}
            value={userphonenumber}
            onChange={(e) => setUserPhonenumber(e.target.value)} // 값 변경 시 상태 업데이트
            placeholder="01012345678 형태로 입력"
          />
        </div>

        {/* 생년월일 */}
        <div className={styles.inputGroup}>
          <div className={styles.labelRow}>
            <label className={styles.inputLabel}>생년월일</label>
            <div className={styles.textToggle}>
              <span
                className={`${styles.toggleText} ${calendar === "solar" ? styles.activeText : ""}`}
                onClick={() => setCalendar("solar")}
              >
                양력
              </span>
              <span className={styles.separator}>/</span>
              <span
                className={`${styles.toggleText} ${calendar === "lunar" ? styles.activeText : ""}`}
                onClick={() => setCalendar("lunar")}
              >
                음력
              </span>
            </div>
          </div>
          <input
            type="date"
            className={styles.inputField}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        {/* 출생시간 */}
        <div className={styles.inputGroup}>
          <div className={styles.labelRow}>
            <label className={styles.inputLabel}>출생시간</label>
            <div className={styles.textToggle}>
              <span
                className={`${styles.toggleText} ${ampm === "AM" ? styles.activeText : ""}`}
                onClick={() => setAmpm("AM")}
              >
                AM
              </span>
              <span className={styles.separator}>/</span>
              <span
                className={`${styles.toggleText} ${ampm === "PM" ? styles.activeText : ""}`}
                onClick={() => setAmpm("PM")}
              >
                PM
              </span>
            </div>
          </div>
          <input
            type="text"
            placeholder="00:00 으로 입력"
            className={styles.inputField}
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
          />
        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>
          결혼운 알아보고 상담받기
        </button>
      </div>
    </div>
  );
};

export default Saju;
