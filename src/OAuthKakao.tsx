// src/OAuthKakao.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_API = "http://api.abysscm.com:8000/login/kakao";

const OAuthKakao: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      console.error("Authorization code가 없습니다.");
      return;
    }

    console.log("Authorization code:", code);

    axios
      .post(BACKEND_API, { code })
      .then((res) => {
        console.log("백엔드 응답:", res.data);
        const { jwt, user } = res.data;
        localStorage.setItem("jwtToken", jwt);
        localStorage.setItem("user", JSON.stringify(user));
        if (user.member_status === "비회원") {
          navigate("/signup");
        } else {
          navigate("/main");
        }
      })
      .catch((err) => {
        console.error("백엔드 요청 실패:", err);
      });
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default OAuthKakao;
