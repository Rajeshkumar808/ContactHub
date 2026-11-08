
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function GoogleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M43.6 24.5c0-1.5-.1-2.9-.4-4.3H24v8.1h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15.1Z"/>
      <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.3H5.9v5.2C9.3 39.5 16.1 44 24 44Z"/>
      <path fill="#FBBC05" d="M12.8 27.6a12 12 0 0 1 0-7.2v-5.2H5.9a20 20 0 0 0 0 17.6l6.9-5.2Z"/>
      <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.2 29.5 4 24 4 16.1 4 9.3 8.5 5.9 15.2l6.9 5.2c1.6-4.8 6-8.3 11.2-8.3Z"/>
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.02c-3.22.7-3.9-1.37-3.9-1.37-.53-1.35-1.29-1.71-1.29-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.57-.29-5.27-1.29-5.27-5.75 0-1.27.45-2.31 1.2-3.13-.12-.29-.52-1.48.12-3.08 0 0 .98-.31 3.16 1.2a10.98 10.98 0 0 1 5.76 0c2.18-1.51 3.16-1.2 3.16-1.2.64 1.6.24 2.79.12 3.08.75.82 1.2 1.86 1.2 3.13 0 4.47-2.7 5.46-5.28 5.75.41.35.78 1.04.78 2.1v3.12c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/>
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: name,
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGithub = async () => {
    setError("");
    try {
      await signInWithPopup(auth, githubProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow glow-one"></div>
      <div className="login-glow glow-two"></div>

      <div className="login-card">
       
        <h1>Create Account</h1>
        <p className="login-subtitle">
          Join ContactHub and manage your contacts
        </p>

        {error && <div className="login-error">{error}</div>}

        <form className="email-login-form" onSubmit={handleRegister}>
          <label htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button
            className="email-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="login-divider">
          <span>OR SIGN UP WITH</span>
        </div>

        <button className="social-login" onClick={handleGoogle}>
          <GoogleLogo />
          <span>Continue with Google</span>
        </button>

        <button className="social-login" onClick={handleGithub}>
          <GitHubLogo />
          <span>Continue with GitHub</span>
        </button>

        <p className="register-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
