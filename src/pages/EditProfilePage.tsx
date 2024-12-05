import React, { useState, useEffect } from "react";
import "../styles/edit-profile-page.scss";
import { API_URL, logout } from "../utils/constants";
import { useParams } from "react-router-dom";
import useAuthRedirect from "../utils/useAuthRedirect";

interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  resume: string; // Added resume field
}

const ProfileEditPage: React.FC = () => {
  useAuthRedirect(true);
  const [applicant, setApplicant] = useState<Applicant | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { id } = useParams();

  useEffect(() => {
    fetch(API_URL + "/applicants/" + id)
      .then((response) => response.json())
      .then((data) => setApplicant(data))
      .catch(() => setErrorMessage("Applicant not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (submitting) return;
    setErrorMessage("");

    if (applicant) {
      setSubmitting(true);
      fetch(API_URL + `/applicants/${applicant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicant),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setMessage("Your profile has been updated successfully!");
          }
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Failed to update profile");
        })
        .finally(() => setSubmitting(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (applicant) {
      const { name, value } = e.target;
      setApplicant((prevApplicant) => ({ ...prevApplicant!, [name]: value }));
    }
  };

  // Handle resume file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setApplicant((prevApplicant) => ({
        ...prevApplicant!,
        resume: file.name,
      }));
    }
  };

  return (
    <div className="edit-profile-page">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src="https://example.com/logo.jpg"
              width="40"
              height="40"
              alt="job-application-logo"
            />
            JOB APPLICATION SYSTEM
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/profile">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/logout" onClick={logout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="languageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {navigator.language === "en"
                  ? "English"
                  : navigator.language === "rw"
                  ? "Kinyarwanda"
                  : "Français"}
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="languageDropdown"
              >
                <li>
                  <a className="dropdown-item" href="?lang=en">
                    English
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="?lang=rw">
                    Kinyarwanda
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="?lang=fr">
                    Français
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <div className="row col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">Edit Profile</h2>
            </div>
            {message && <div className="alert alert-info">{message}</div>}
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            {loading && (
              <div className="d-flex justify-content-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="card-body">
              {applicant && !errorMessage && (
                <form onSubmit={handleSubmit}>
                  <input type="hidden" name="id" value={applicant.id} />
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter first name"
                      value={applicant.firstName}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter last name"
                      value={applicant.lastName}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      name="email"
                      value={applicant.email}
                      readOnly
                      type="email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number
                    </label>
                    <input
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      value={applicant.phoneNumber}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth" className="form-label">
                      Date of Birth
                    </label>
                    <input
                      className="form-control"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={applicant.dateOfBirth}
                      onChange={handleChange}
                      type="date"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="resume" className="form-label">
                      Upload Resume
                    </label>
                    <input
                      className="form-control"
                      id="resume"
                      name="resume"
                      type="file"
                      onChange={handleFileChange}
                    />
                    {applicant.resume && (
                      <p>Current Resume: {applicant.resume}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <button className="btn btn-primary" type="submit">
                      {submitting ? "Updating..." : "Update Profile"}
                    </button>
                    <a href="/applicants" className="btn btn-secondary">
                      Cancel
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
