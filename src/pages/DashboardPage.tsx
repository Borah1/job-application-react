import axios from "axios";
import { useState } from "react";
import "../styles/dashboard-page.scss";
import useAuthRedirect from "../utils/useAuthRedirect";

const DashboardPage = () => {
  const { user } = useAuthRedirect(true);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const uploadProfilePicture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return; // Ensure user exists
    if (uploading) return;

    const formData = new FormData();
    const profilePicture = e.currentTarget.profilePicture.files[0];
    if (!profilePicture) return;

    formData.append("profilePicture", profilePicture);
    formData.append("userId", user.id.toString()); // Convert number to string

    setUploading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/uploadProfilePicture",
        formData
      );

      const data = response.data;

      if (data.success) {
        const localUser = localStorage.getItem("user");
        if (localUser) {
          const updatedUser = { ...JSON.parse(localUser), profilePicture: data.profilePicture };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        alert("Profile picture uploaded successfully");
        window.location.reload();
      } else {
        alert("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("An error occurred while uploading the profile picture.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src="ass.jpg"
              width="40"
              height="40"
              alt="Job Application System"
            />
            Job Application System
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/applications">
                  <i className="fas fa-clipboard-list me-2"></i>Applications
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container my-5">
        <div className="row gy-4">
          <div className="col-12 mt-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4>
                  <i className="fas fa-user-circle me-2"></i>Applicant Information
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <div className="text-muted">Name</div>
                      <div>{user.firstName} {user.lastName}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-muted">Email</div>
                      <div>{user.email}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-muted">Role</div>
                      <div>{user.roles[0]?.name}</div>
                    </div>
                  </div>
                  <div className="col-md-8">
                    {user.profilePicture ? (
                      <div className="profile-picture-card mx-auto">
                        <img
                          src={`http://localhost:8000/download-profile?fileName=${user.profilePicture}`}
                          className="card-img-top"
                          alt="Profile Picture"
                        />
                        <div className="card-body text-center">
                          <a
                            href={`http://localhost:8000/download-profile?fileName=${user.profilePicture}`}
                            className="btn btn-primary"
                            download={`${user.firstName} ${user.lastName}`}
                          >
                            <i className="fas fa-download me-2"></i>Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-picture-card mx-auto">
                        <img
                          src="https://via.placeholder.com/250"
                          className="card-img-top"
                          alt="Profile Picture"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="upload-form mt-4">
                  <form onSubmit={uploadProfilePicture}>
                    <div className="mb-3">
                      <label htmlFor="profilePicture" className="form-label">
                        <i className="fas fa-upload me-2"></i>Upload New Profile Picture
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/*"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-cloud-upload-alt me-2"></i>
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
