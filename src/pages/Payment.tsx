import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Payment.module.css";
import Navbar from "./Navbar";
interface PaymentProps {
  username?: string;
}

const Payment: React.FC<PaymentProps> = () => {
  const storedUser = localStorage.getItem("user");
  const username = storedUser ? JSON.parse(storedUser).nickname : "XXX";
  const navigate = useNavigate();

  const handlePayment = () => {
    alert("모바일 결제가 현재 불가합니다. 매니저가 연락을 드릴 예정입니다.");
    navigate("/saju"); // alert 확인 후 Saju 페이지로 이동
  };

  return (
    <div className={styles.container}>
        <Navbar />
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
          <span className={styles.username}>{username}</span>님<br /> 환영해요!
        </h1>

        <h2 className={styles.subtitle}>
          Abyss를 이용하기 위해선 정회원 가입이 필요해요. 노쇼 방지를 위해 최초 1회만 결제되며 이성매칭, 컨설팅은 상담 이후 진행되요!
        </h2>

        <div className={styles.infoBox}>
          <div className={styles.productName}>Abyss 정회원</div>
          <div className={styles.productPrice}>49,900원</div>
          <ul className={styles.productFeatures}>
            <li>매칭 서비스 제공</li>
            <li>컨설팅 상담 포함</li>
          </ul>
        </div>

        <button className={styles.paymentButton} onClick={handlePayment}>
          결제하고 시작하기
        </button>
      </div>
    </div>
  );
};

export default Payment;
