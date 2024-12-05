import React, { useState } from "react";
import axios from "axios";
import "../styles/login-page.scss";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthRedirect from "../utils/useAuthRedirect";

const LoginPage = () => {
  useAuthRedirect();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [params] = useSearchParams();
  const logout = params.get("logout");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email: formData.email.trim(),
        password: formData.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const { user: loggedInUser } = response.data;
        
        const safeUserData = {
          id: loggedInUser.id,
          email: loggedInUser.email,
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName
        };

        localStorage.setItem("user", JSON.stringify(safeUserData));
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.status === 401
            ? "Invalid email or password. Please try again."
            : error.message || "An error occurred during login";
        setAlert({ type: "danger", message });
      } else {
        setAlert({ type: "danger", message: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="bg-pattern"></div>

      <svg
        className="floating-element football-1"
        width="50"
        height="50"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" fill="white" />
        <path d="M50 5 L50 95 M5 50 L95 50" stroke="black" strokeWidth="2" />
      </svg>

      <svg
        className="floating-element football-2"
        width="40"
        height="40"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" fill="white" />
        <path d="M50 5 L50 95 M5 50 L95 50" stroke="black" strokeWidth="2" />
      </svg>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            {alert.message && (
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.message}
              </div>
            )}
            {logout && (
              <div className="alert alert-success">You have been logged out.</div>
            )}

            <div className="glass-container">
              <div className="logo-container"></div>
              <h1 className="form-title">Job Application System</h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100" 
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Sign In"}
                </button>

                <div className="links-container">
                  <a href="/register" className="text-white">
                    Create Account
                  </a>
                  <span className="text-white"> | </span>
                  <a href="/forgot-password" className="text-white">
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;