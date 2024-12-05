import React, { ChangeEvent, FormEvent, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "../styles/register-page.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    profilePicture: "",
    dateOfBirth: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: formData.fullName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber?.trim() || "",
        profilePicture: formData.profilePicture?.trim() || "",
        dateOfBirth: formData.dateOfBirth || null,
      };

      const response = await fetch("http://localhost:8080/register/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      try {
        const data = JSON.parse(responseText);
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
        setAlert({ type: "success", message: data.message });
      } catch (error) {
        if (response.ok) {
          setAlert({ type: "success", message: responseText });
        } else {
          throw new Error("Unexpected response from server.");
        }
      }

      setFormData({
        fullName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        profilePicture: "",
        dateOfBirth: "",
        terms: false,
      });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setAlert({ type: "danger", message: errMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="registration-card">
              <h3 className="text-center mb-3">Register</h3>
              {alert.message && (
                <div className={`alert alert-${alert.type}`} role="alert">
                  {alert.message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="fullName"
                    className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                  {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                  />
                  {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    name="terms"
                    className="form-check-input"
                    checked={formData.terms}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label">
                    I agree to the terms
                  </label>
                  {errors.terms && <small className="text-danger d-block">{errors.terms}</small>}
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
                <p className="text-center">
                  Already have an account? <a href="/login">Login</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
