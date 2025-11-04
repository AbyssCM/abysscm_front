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
            제1조 (목적)<br/>
본 약관은 주식회사 Abyss(이하 “회사”라 함)가 제공하는 AbyssCM 서비스(이하 “서비스”라 함)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br/><br/>

제2조 (약관의 효력 및 변경)<br/>

회사는 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.<br/>

회사는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경된 약관은 게시한 날로부터 효력이 발생합니다.<br/><br/>

제3조 (회원가입)<br/>

이용자는 회사가 정한 절차에 따라 회원가입을 신청하고, 회사는 이를 승인함으로써 회원으로 등록됩니다.<br/>

회원은 반드시 본인 명의의 계정으로 가입해야 하며, 타인의 정보를 도용하여 가입할 수 없습니다.<br/><br/>

제4조 (서비스 이용)<br/>

회원은 서비스를 이용함에 있어 관계 법령, 본 약관, 서비스 이용 지침 등을 준수해야 합니다.<br/>

회사는 서비스의 안전성과 효율성을 위해 필요한 경우 서비스의 일부 또는 전부를 제한할 수 있습니다.<br/><br/>

제5조 (회원의 의무)<br/>

회원은 계정 정보의 보안 유지에 책임이 있으며, 타인에게 계정을 이용하게 해서는 안 됩니다.<br/>

회원은 서비스 이용 과정에서 다음 행위를 해서는 안 됩니다.<br/>

- 불법, 범죄, 위법 행위<br/>

- 타인의 권리 침해 행위<br/>

- 기타 서비스 운영을 방해하는 행위<br/><br/>

제6조 (서비스 제공의 중단)<br/>
회사는 정기점검, 긴급점검, 천재지변, 시스템 장애 등의 사유로 서비스를 일시적으로 중단할 수 있습니다.<br/><br/>

제7조 (면책사항)<br/>
회사는 회원의 귀책사유로 발생한 손해에 대해서는 책임을 지지 않습니다.<br/><br/>

제8조 (준거법 및 관할법원)<br/>
본 약관의 해석 및 적용에 관하여는 대한민국 법을 적용하며, 분쟁 발생 시 관할법원은 회사 본사 소재지를 기준으로 합니다.<br/>
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
            1. 개인정보의 수집 목적<br/>
회사는 회원가입, 서비스 제공, 고객 상담, 마케팅 등 아래 목적을 위해 개인정보를 수집합니다.<br/>

- 서비스 이용자 식별 및 회원 관리<br/>

- 서비스 제공 및 콘텐츠 제공<br/>

- 신규 서비스 개발 및 마케팅 활용<br/><br/>

2. 수집하는 개인정보 항목<br/>

필수 항목: 이름, 이메일, 비밀번호, 생년월일, 성별, 휴대전화번호<br/>

선택 항목: 프로필 사진, 관심사, 주소<br/><br/>

3. 개인정보 보유 및 이용 기간<br/>

회원 탈퇴 시 지체 없이 파기합니다.<br/>

관계 법령에 의해 보존이 필요한 경우에는 해당 기간 동안 안전하게 보관합니다.<br/><br/>

4. 개인정보 제3자 제공<br/>

회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.<br/>

단, 법령에 의거한 경우 예외로 합니다.<br/><br/>

5. 개인정보 처리 위탁<br/>

서비스 운영을 위해 일부 업무를 외부 전문업체에 위탁할 수 있으며, 위탁받은 업체가 안전하게 개인정보를 처리하도록 관리 감독합니다.<br/><br/>

6. 이용자의 권리<br/>

회원은 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지 등을 요청할 수 있습니다.<br/><br/>

7. 동의<br/>

이용자는 본 개인정보 수집 및 이용 안내에 대해 동의해야 회원가입이 가능합니다.<br/><br/>

8. 개인정보 관리 책임자<br/>

Abyss 대표 : 김도연<br/>

이메일: info@abysscm.com<br/>
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
      <img src="/sginup.png" alt="하단 이미지" className={styles.bottomImage} />
    </div>
  );
};

export default SignUp;
