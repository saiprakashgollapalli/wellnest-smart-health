import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authService } from "../services/api";
import authBg from "../assets/auth-bg.jpg";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleReset = async () => {

    // safety check
    if (!email || !otp) {
      alert("Session expired. Please restart forgot password.");
      navigate("/forgot-password");
      return;
    }

    if (newPwd !== confirmPwd) {
      alert("Passwords do not match");
      return;
    }

    try {
      await authService.resetPassword(email, otp, newPwd);

      alert("Password reset successful!");

      // ✅ IMPORTANT FIX
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Reset failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>

        <div style={styles.wrap}>
          <input
            type={show1 ? "text" : "password"}
            placeholder="New Password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            style={styles.input}
          />
          <span style={styles.eye} onClick={() => setShow1(!show1)}>
            {show1 ? <FiEyeOff color="white" /> : <FiEye color="white" />}
          </span>
        </div>

        <div style={styles.wrap}>
          <input
            type={show2 ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            style={styles.input}
          />
          <span style={styles.eye} onClick={() => setShow2(!show2)}>
            {show2 ? <FiEyeOff color="white" /> : <FiEye color="white" />}
          </span>
        </div>

        <button style={styles.btn} onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
      url(${authBg})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  
  card: {
    background: "white",
    padding: 26,
    borderRadius: 14,
    width: 420,
  },
  title: { textAlign: "center", marginBottom: 14, color: "#111" },

  wrap: { position: "relative", marginBottom: 12 },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#0f172a",
    color: "white",
  },

  eye: {
    position: "absolute",
    right: 12,
    top: "30%",
    cursor: "pointer",
  },

  btn: {
    width: "100%",
    padding: 12,
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 8,
  },
};
