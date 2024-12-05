import "../styles/home-page.scss";
import useAuthRedirect from "../utils/useAuthRedirect";

const HomePage = () => {
  useAuthRedirect();
  const language = "en";
  return (
    <div className="home-page">
      {/* Hero Background */}
      <div className="hero-background"></div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src="https://example.com/logo.jpg"
              width="50"
              height="50"
              alt="Job Application"
            />
            JOB APPLICATION SYSTEM
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/register">
                  Register
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/jobs">
                  Job Listings
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-globe me-1"></i>
                  {language === "en"
                    ? "English"
                    : language === "rw"
                    ? "Kinyarwanda"
                    : "Français"}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 hero-content">
              <h1 className="mb-4">Welcome to the Job Application Portal</h1>
              <p className="lead">
                Explore various job opportunities, submit your applications, and
                take the next step in your career journey. Join our growing
                workforce today!
              </p>
              <div className="mt-5 d-flex gap-3 justify-content-center">
                <a href="/register" className="btn btn-primary">
                  <i className="fas fa-user-plus me-2"></i> Register
                </a>
                <a href="/login" className="btn btn-secondary">
                  <i className="fas fa-sign-in-alt me-2"></i> Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Highlights */}
      <section className="job-highlights">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <h3>Browse Jobs</h3>
              <p>
                Find a variety of job positions available across different
                industries. Explore and apply for the perfect job.
              </p>
              <a href="/jobs" className="btn btn-primary">
                View Jobs
              </a>
            </div>
            <div className="col-md-4">
              <h3>Upload Your Resume</h3>
              <p>
                Ensure your profile is up to date and increase your chances of
                being hired. Upload your resume today.
              </p>
              <a href="/profile" className="btn btn-secondary">
                Update Resume
              </a>
            </div>
            <div className="col-md-4">
              <h3>Career Resources</h3>
              <p>
                Access career advice, interview tips, and other resources to
                help you in your job search.
              </p>
              <a href="/resources" className="btn btn-secondary">
                Career Resources
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container text-center">
          <p className="m-0">
            © 2024 Job Application System. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
