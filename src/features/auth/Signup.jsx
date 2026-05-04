import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "./authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Popup from "./Popup";
import "./auth.css";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    joinAsSeller: true
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

    if (!form.firstName || !form.lastName || !form.username || !form.email || !form.password) {
      setLocalError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setLocalError(null);

    dispatch(signupUser(form)).then(res => {
      if (res.meta.requestStatus === "fulfilled") {
        setPopup({
          message: "Signup successful",
          type: "success"
        });
      } else {
        setPopup({
          message: res.payload || "Signup failed",
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
        <h2 className="authsign">Create Account</h2>

        <div className="inputGroup">
          <FaUser className="inputIcon" />
          <input name="firstName" placeholder="First Name" onChange={handleChange} />
        </div>

        <div className="inputGroup">
          <FaUser className="inputIcon" />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        </div>

        <div className="inputGroup">
          <FaUser className="inputIcon" />
          <input name="username" placeholder="Username" onChange={handleChange} />
        </div>

        <div className="inputGroup">
          <FaEnvelope className="inputIcon" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        </div>

        <div className="inputGroup">
          <FaLock className="inputIcon" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        </div>

        <div className="inputGroup">
          <FaLock className="inputIcon" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
        </div>

        {(localError || error) && (
          <p style={{ color: "red" }}>{localError || error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p
          className="link"
          onClick={() => navigate("/login", { state: location.state })}
        >
          Already have account? Login
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

export default Signup;