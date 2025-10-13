import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [agreeAll, setAgreeAll] = useState(false);
  const navigate = useNavigate();
  const [terms, setTerms] = useState({
    service: false,
    privacy: false,
    promotion: false,
  });

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setTerms({
      service: newValue,
      privacy: newValue,
      promotion: newValue,
    });
  };

  const handleTermChange = (key: keyof typeof terms) => {
    setTerms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignUp = () => {
    console.log("회원가입 버튼 클릭");
    navigate("/welcome");
    // 실제 회원가입 로직 추가 가능
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* 타이틀 */}
        <h1 className={styles.title}>Sign up</h1>

        {/* 전체 동의 */}
        <label className={`${styles.checkboxLabel} ${styles.agreeAll}`}>
          <input
            type="checkbox"
            checked={agreeAll}
            onChange={handleAgreeAll}
          />
          모두 동의합니다.
        </label>

        {/* 약관 박스 */}
        <div className={styles.termBox}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={terms.service}
              onChange={() => handleTermChange("service")}
            />
            [필수] Abyss 이용약관 동의
          </label>
          <div className={styles.termContent}>
            약관내용 (여기에 실제 약관 텍스트)
          </div>
        </div>

        <div className={styles.termBox}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={terms.privacy}
              onChange={() => handleTermChange("privacy")}
            />
            [필수] 개인정보 수집 및 이용 안내
          </label>
          <div className={styles.termContent}>
            약관내용 (여기에 실제 개인정보 수집 안내)
          </div>
        </div>

        <div className={styles.termBox}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={terms.promotion}
              onChange={() => handleTermChange("promotion")}
            />
            [선택] 이벤트 등 프로모션 알림 메일 수신 동의
          </label>
        </div>

        {/* 가입하기 버튼 */}
        <button className={styles.signUpButton} onClick={handleSignUp}>
          가입하기
        </button>
      </div>

      {/* 푸터 */}
      <div className={styles.footer}>
        Abyss <br />
        © 2025. AbyssCM. All rights reserved
      </div>
    </div>
  );
};

export default SignUp;
