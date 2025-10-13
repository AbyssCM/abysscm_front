import React from "react";
import styles from "./Navbar.module.css";
import backIcon from "../assets/back.png"; // 왼쪽 아이콘
import userIcon from "../assets/user.png"; // 오른쪽 아이콘
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.navbar}>
      <img
        src={backIcon}
        alt="뒤로가기"
        className={styles.leftIcon}
        onClick={() => navigate(-1)}
      />
      <img
        src={userIcon}
        alt="회원정보"
        className={styles.rightIcon}
        onClick={() => navigate("/profile")}
      />
    </div>
  );
};

export default Navbar;
