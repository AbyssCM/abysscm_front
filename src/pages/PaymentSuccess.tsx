import React from "react";
import Navbar from "./Navbar";

const PaymentSuccess: React.FC = () => {
  React.useEffect(() => {
    // If opened in a popup, notify the opener and close the popup
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "TOSS_PAYMENT", status: "success" }, window.location.origin);
        // give opener a moment to receive the message, then close
        setTimeout(() => {
          window.close();
        }, 200);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h1>결제 성공</h1>
        <p>결제가 정상적으로 처리되었습니다. 이용해주셔서 감사합니다.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
