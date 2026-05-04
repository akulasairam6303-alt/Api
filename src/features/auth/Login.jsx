import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Popup from "./Popup";
import "./auth.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector(state => state.auth);   

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [localError, setLocalError] = useState(null);

  const [popup, setPopup] = useState({
    message: "",
    type: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setLocalError("Email and password required");
      return;
    }

    setLocalError(null);

    dispatch(loginUser(form)).then(res => {
      if (res.meta.requestStatus === "fulfilled") {

        localStorage.setItem("token", res.payload?.token || "dummy-token");

        setPopup({
          message: "Login successful",
          type: "success"
        });

      } else {
        setPopup({
          message: res.payload || "Login failed",
          type: "error"
        });
      }
    });
  };

  const handlePopupClose = () => {
    setPopup({ message: "", type: "" });

    if (popup.type === "success") {
      const redirectTo = location.state?.redirectTo || "/app";
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="authPage">
      <form className="authBox" onSubmit={handleSubmit}>
        <h2 className="authsign">Login</h2>

        <div className="inputGroup">
          <FaEnvelope className="inputIcon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>

        <div className="inputGroup">
          <FaLock className="inputIcon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        {(localError || error) && (
          <p style={{ color: "red" }}>{localError || error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="link" onClick={() => navigate("/signup", { state: location.state })}>
          Don't have account? Signup
        </p>
      </form>

      <Popup
        message={popup.message}
        type={popup.type}
        onClose={handlePopupClose}
      />
    </div>
  );
}

export default Login;