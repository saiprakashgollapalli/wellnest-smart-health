import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [seconds, setSeconds] = useState(60);
  const [shake, setShake] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const mode = location.state?.mode; // ⭐ NEW

  // ================= TIMER =================
  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  // ================= OTP INPUT =================
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ================= VERIFY OTP =================
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) return;

    try {
      await authService.verifyOtp(email, code);

      // ⭐ MAIN FIX
      if (mode === "forgot") {
        // Forgot password flow
        navigate("/reset-password", {
          state: { email, otp: code }
        });
      } else {
        // Register flow
        navigate("/login");
      }

    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // ================= RESEND OTP =================
  const handleResend = async () => {
    if (seconds > 0) return;

    if (mode === "forgot") {
      await authService.forgotPassword(email);
    } else {
      // for register flow resend can call register again
      await authService.register({ email });
    }

    setSeconds(60);
    setOtp(Array(6).fill(""));
    inputsRef.current[0].focus();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className={shake ? "shake" : ""}>
        <h2 style={styles.title}>OTP Verification</h2>

        <p style={styles.subtitle}>
          OTP sent to <b>{email}</b>
        </p>

        <div style={styles.otpRow}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              style={styles.otpBox}
            />
          ))}
        </div>

        <p style={styles.timer}>
          {seconds > 0 ? (
            <span style={{ color: "black" }}>
              Resend OTP in {seconds}s
            </span>
          ) : (
            <span
              style={{ color: "#10b981", cursor: "pointer", fontWeight: 600 }}
              onClick={handleResend}
            >
              Resend OTP
            </span>
          )}
        </p>

        <button style={styles.btn} onClick={handleVerify}>
          Verify OTP
        </button>
      </div>

      <style>
        {`
        .shake { animation: shake 0.4s; }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
          100% { transform: translateX(0); }
        }
        `}
      </style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    padding: "30px",
    borderRadius: "14px",
    width: "420px",
    textAlign: "center",
  },
  title: { marginBottom: "8px", color: "#111" },
  subtitle: { color: "#333", marginBottom: "20px" },
  otpRow: { display: "flex", gap: "10px", justifyContent: "center" },
  otpBox: {
    width: "48px",
    height: "55px",
    fontSize: "22px",
    textAlign: "center",
    borderRadius: "10px",
    border: "none",
    background: "#0d1b3f",
    color: "white",
    fontWeight: "bold",
    outline: "none",
  },
  timer: { marginTop: "14px", marginBottom: "16px", fontSize: "14px" },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
