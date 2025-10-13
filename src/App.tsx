import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import Payment from "./pages/Payment";
import Saju from "./pages/Saju";
import Profile from "./pages/Profile";
import Main from "./pages/Main";
import OAuthKakao from "./OAuthKakao";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/saju" element={<Saju />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/main" element={<Main />} />
        <Route path="/oauth/kakao" element={<OAuthKakao />} />
      </Routes>
    </Router>
  );
};

export default App;
