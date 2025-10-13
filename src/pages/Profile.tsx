import React from "react";
import styles from "./Profile.module.css";
import Navbar from "./Navbar";
interface ProfileProps {
  username?: string;
}

const Profile: React.FC<ProfileProps> = ({ username = "XXX" }) => {
  const handleLogout = () => {
    console.log("로그아웃 버튼 클릭");
    // 로그아웃 로직 추가 가능
  };

  return (
    <div className={styles.container}>
        <Navbar />
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>{username}</h1>

        <div className={styles.infoGroup}>
          <label className={styles.label}>서비스 정보</label>
          <p className={styles.info}>Abyss 정회원</p>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Profile;
