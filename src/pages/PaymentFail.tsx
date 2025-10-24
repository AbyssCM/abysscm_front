import React from "react";
import Navbar from "./Navbar";

const PaymentFail: React.FC = () => {
  React.useEffect(() => {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "TOSS_PAYMENT", status: "fail" }, window.location.origin);
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
        <h1>결제 실패</h1>
        <p>결제가 취소되었거나 실패했습니다. 다시 시도해 주세요.</p>
      </div>
    </div>
  );
};

export default PaymentFail;
