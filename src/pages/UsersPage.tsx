import React, { useState, useEffect } from "react";
import { API_URL, logout } from "../utils/constants";
import useAuthRedirect from "../utils/useAuthRedirect";

interface JobApplication {
  id: number;
  applicantName: string;
  email: string;
  phoneNumber: string;
  resume: string; // File URL or Base64
  position: string;
  dateApplied: string;
  status: string; // e.g., "Pending", "Accepted", "Rejected"
}

const JobApplicationsPage: React.FC = () => {
  useAuthRedirect(true);

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [size] = useState<number>(10);
  const [sortField, setSortField] = useState<string>("dateApplied");
  const [sortDir, setSortDir] = useState<string>("desc");
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setMessageError(null);
      try {
        const response = await fetch(
          `${API_URL}/applications?page=${currentPage}&size=${size}&sort=${sortField}&dir=${sortDir}&search=${search}`
        );
        const data = await response.json();
        setApplications(data.applications);
        setTotalPages(data.totalPages);
      } catch{
        setMessageError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [search, currentPage, size, sortField, sortDir]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortDir((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="job-applications-page">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/logout" onClick={logout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1>Job Applications</h1>

        {messageError && (
          <div className="alert alert-danger">{messageError}</div>
        )}
        {messageSuccess && (
          <div className="alert alert-success">{messageSuccess}</div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <form method="get" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={search}
                  onChange={handleSearchChange}
                />
                <button className="btn" type="submit">
                  Search
                </button>
              </div>
            </form>

            <table className="table">
              <thead>
                <tr>
                  <th>
                    <a href="#" onClick={() => handleSort("applicantName")}>
                      Applicant Name
                    </a>
                  </th>
                  <th>
                    <a href="#" onClick={() => handleSort("email")}>
                      Email
                    </a>
                  </th>
                  <th>
                    <a href="#" onClick={() => handleSort("phoneNumber")}>
                      Phone Number
                    </a>
                  </th>
                  <th>
                    <a href="#" onClick={() => handleSort("position")}>
                      Position
                    </a>
                  </th>
                  <th>
                    <a href="#" onClick={() => handleSort("dateApplied")}>
                      Date Applied
                    </a>
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.applicantName}</td>
                    <td>{application.email}</td>
                    <td>{application.phoneNumber}</td>
                    <td>{application.position}</td>
                    <td>
                      {new Date(application.dateApplied).toLocaleDateString()}
                    </td>
                    <td>{application.status}</td>
                    <td>
                      <a
                        href={`/applications/edit/${application.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </a>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${i === currentPage ? "active" : ""}`}
                  >
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </a>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages - 1 ? "disabled" : ""
                  }`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsPage;
