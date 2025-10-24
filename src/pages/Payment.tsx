import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Payment.module.css";
import Navbar from "./Navbar";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const Payment: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const username = storedUser ? JSON.parse(storedUser).nickname : "XXX";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [widget, setWidget] = useState<any | null>(null);
  const [toss, setToss] = useState<any | null>(null);
  const [ready, setReady] = useState(false);
  const [amount, setAmount] = useState({ currency: "KRW", value: 49900 });
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<null | "success" | "fail">(null);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        console.info("초기화: Toss SDK 로드 시작");
        const tossInstance = await loadTossPayments(clientKey);
        console.info("초기화: Toss SDK 로드 완료", tossInstance);
        // 디버깅: toss 인스턴스의 메서드/프로퍼티를 자세히 출력
        try {
          // console.dir는 객체 구조를 보기 좋게 보여줍니다.
          // (개발자 도구에서 확인하세요)
          console.dir(tossInstance);
        } catch (e) {
          // ignore
        }
        // 추가 진단: 키와 함수 멤버를 추출해 출력합니다.
        try {
          const topKeys = Object.keys(tossInstance);
          console.info("toss top-level keys:", topKeys);
          const funcKeys: string[] = [];
          topKeys.forEach((k) => {
            try {
              if (typeof (tossInstance as any)[k] === "function") funcKeys.push(k);
            } catch (e) {
              /* ignore */
            }
          });
          console.info("toss top-level function keys:", funcKeys);

          // 1-level deep 탐색 (유용한 네임스페이스가 있는지 확인)
          const nested: Record<string, string[]> = {};
          topKeys.forEach((k) => {
            try {
              const v = (tossInstance as any)[k];
              if (v && typeof v === "object") {
                nested[k] = Object.keys(v).filter((sub) => typeof v[sub] === "function");
              }
            } catch (e) {
              // ignore
            }
          });
          console.info("toss 1-level nested function keys:", nested);
        } catch (e) {
          // ignore diagnostics errors
        }
        setToss(tossInstance);
      } catch (err) {
        console.error("Toss SDK 초기화 실패:", err);
      }
    })();
  }, []);

  // Listen for postMessage from payment popup (success/fail)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data && e.data.type === "TOSS_PAYMENT") {
        setShowModal(false);
        setResult(e.data.status === "success" ? "success" : "fail");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Clear result modal after 5s
  useEffect(() => {
    if (!result) return;
    if (result === "success") {
      // show the success briefly, then navigate to /saju
      const t = setTimeout(() => {
        setResult(null);
        navigate("/saju");
      }, 1500);
      return () => clearTimeout(t);
    }
    // fail: just clear after 5s
    const t = setTimeout(() => setResult(null), 5000);
    return () => clearTimeout(t);
  }, [result]);

  // If the page was redirected back with a query param like ?status=success or ?status=fail,
  // show the in-app modal and then remove the query param.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    if (status === "success" || status === "fail") {
      setResult(status === "success" ? "success" : "fail");
      // remove query param without adding history entry
      navigate(window.location.pathname, { replace: true });
    }
  }, [location.search, navigate]);

  // Once widget is available, render payment methods and agreement into DOM
  // Render widget UI when modal opens and widget is ready
  useEffect(() => {
    if (!widget || !showModal) return;

    let mounted = true;

    (async () => {
      try {
        await widget.setAmount(amount);

        const waitForElement = async (selector: string, timeout = 2000) => {
          const start = Date.now();
          while (Date.now() - start < timeout && mounted) {
            const el = document.querySelector(selector);
            if (el) return el;
            await new Promise((r) => setTimeout(r, 50));
          }
          return null;
        };

        const payEl = await waitForElement("#toss-modal #payment-method");
        const agreementEl = await waitForElement("#toss-modal #agreement");

        // Try selector first (namespaced inside modal), else fall back to element
        try {
          await widget.renderPaymentMethods({ selector: "#toss-modal #payment-method", variantKey: "DEFAULT" });
        } catch (err: any) {
          console.warn("renderPaymentMethods(selector) 실패:", err);
          if (payEl) {
            try {
              console.info("renderPaymentMethods: selector 폴백 -> element 전달");
              await widget.renderPaymentMethods({ element: payEl, variantKey: "DEFAULT" } as any);
            } catch (err2) {
              console.error("renderPaymentMethods(element)도 실패:", err2);
              throw err2;
            }
          } else {
            throw err;
          }
        }

        try {
          await widget.renderAgreement({ selector: "#toss-modal #agreement", variantKey: "AGREEMENT" });
        } catch (err: any) {
          console.warn("renderAgreement(selector) 실패:", err);
          if (agreementEl) {
            try {
              console.info("renderAgreement: selector 폴백 -> element 전달");
              await widget.renderAgreement({ element: agreementEl, variantKey: "AGREEMENT" } as any);
            } catch (err2) {
              console.error("renderAgreement(element)도 실패:", err2);
              throw err2;
            }
          } else {
            throw err;
          }
        }

        console.info("위젯 UI 렌더링 완료 (모달)");
        setReady(true);
      } catch (e) {
        console.error("위젯 UI 렌더링 실패:", e);
      }
    })();

    return () => {
      mounted = false;
      setReady(false);
    };
  }, [widget, showModal]);

  // Create widget when modal opens; destroy/cleanup when it closes
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!showModal || !toss) return;
      try {
        // Create a fresh widget instance for the modal session
        const w = toss.widgets({ customerKey: ANONYMOUS });
        await w.setAmount(amount);
        if (!mounted) return;
        setWidget(w);
      } catch (e) {
        console.error("모달 오픈 중 위젯 생성 실패:", e);
      }
    })();

    return () => {
      mounted = false;
      // destroy / unmount widget if API available
      try {
        if (widget && typeof widget.unmount === "function") {
          widget.unmount();
        }
      } catch (e) {
        // ignore
      }
      // clear widget DOM nodes inside modal container
      const payEl = document.querySelector("#toss-modal #payment-method");
      if (payEl) payEl.innerHTML = "";
      const agreementEl = document.querySelector("#toss-modal #agreement");
      if (agreementEl) agreementEl.innerHTML = "";
      setWidget(null);
    };
  }, [showModal, toss]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
          <span className={styles.username}>{username}</span>님 환영해요!
        </h1>

        <h2 className={styles.subtitle}>
          Abyss를 이용하기 위해선 정회원 가입이 필요해요. 최초 1회만 결제되며, 이성매칭과 컨설팅은 상담 이후 진행됩니다.
        </h2>

        <div className={styles.infoBox}>
          <div className={styles.productName}>Abyss 정회원</div>
          <div className={styles.productPrice}>49,900원</div>
          <ul className={styles.productFeatures}>
            <li>매칭 서비스 제공</li>
            <li>컨설팅 상담 포함</li>
          </ul>
        </div>

  {/* Note: widget placeholders are rendered inside the modal to avoid ID collisions */}

        <button
          className={styles.paymentButton}
          onClick={() => setShowModal(true)}
          disabled={loading || !toss}
        >
          {loading ? "결제창 로딩중..." : "결제하고 시작하기"}
        </button>

        {/* Modal */}
        {showModal && (
          <div
            id="toss-modal"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                width: 720,
                maxWidth: "96%",
                background: "#fff",
                borderRadius: 8,
                padding: 16,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>결제</h2>
              <div id="payment-method" />
              <div id="agreement" />

              <div className={styles.modalButtons} style={{ marginTop: 12 }}>
                <button className={styles.paymentButton}
                  onClick={async () => {
                    if (!widget || !ready) return alert("결제 UI가 준비되지 않았습니다.");
                    try {
                      setLoading(true);
                      await widget.requestPayment({
                        orderId: `abyss-membership-${Date.now()}`,
                        orderName: "Abyss 정회원",
                        successUrl: `${window.location.origin}/payment?status=success`,
                        failUrl: `${window.location.origin}/payment?status=fail`,
                        customerName: username,
                      });
                    } catch (e) {
                      console.error("모달 결제 호출 실패:", e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  결제하기
                </button>
                <button className={styles.paymentButton} onClick={() => setShowModal(false)}>취소</button>
              </div>
            </div>
          </div>
        )}
        {/* In-app result modal */}
        {result && (
          <div
            style={{
              position: "fixed",
              right: 20,
              top: 20,
              background: result === "success" ? "#e6ffed" : "#ffe6e6",
              color: "#222",
              padding: "12px 16px",
              borderRadius: 8,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              zIndex: 10000,
            }}
          >
            <strong>{result === "success" ? "결제 성공" : "결제 실패"}</strong>
            <div style={{ fontSize: 13 }}>
              {result === "success" ? "결제가 정상 처리되었습니다." : "결제가 취소되었거나 실패했습니다."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
