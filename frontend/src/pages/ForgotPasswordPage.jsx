import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import authBg from "../assets/auth-bg.jpg";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      // 🔵 Send OTP
      await authService.forgotPassword(email);

      // 🔵 Go to Verify OTP page
      navigate("/verify-otp", {
       state: { email, mode: "forgot" }

      });

    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>

        <p style={styles.subtitle}>
          Enter your registered email to receive OTP
        </p>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button
          style={styles.btn}
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
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
    textAlign: "center",
  },

  title: {
    marginBottom: 8,
    color: "#111",
  },

  subtitle: {
    color: "#444",
    fontSize: "14px",
    marginBottom: 16,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#0f172a",
    color: "white",
    marginBottom: 14,
  },

  btn: {
    width: "100%",
    padding: 12,
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
  },
};
