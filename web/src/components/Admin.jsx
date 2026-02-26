import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

/* 🔑 SAME PATTERN AS Search.jsx */
const API_BASE = import.meta.env.VITE_API_URL;

function Admin() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [currentFile, setCurrentFile] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  /* =====================
     LOGIN
  ===================== */
  const login = (e) => {
    e.preventDefault();
    setMessage("");

    fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setLoggedIn(true);
      })
      .catch(() => setMessage("Invalid username or password"));
  };

  /* =====================
     FETCH CURRENT FILE
  ===================== */
  useEffect(() => {
    if (!loggedIn) return;

    fetch(`${API_BASE}/api/admin/current-file`)
      .then(res => res.json())
      .then(data => setCurrentFile(data.file));
  }, [loggedIn]);

  /* =====================
     UPLOAD EXCEL
  ===================== */
  const uploadExcel = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch(`${API_BASE}/api/admin/upload-excel`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setCurrentFile(file.name);
        setFile(null);
      })
      .catch(() => setMessage("Upload failed"));
  };

  /* =====================
     LOGOUT
  ===================== */
  const logout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setMessage("");
    navigate("/");
  };

  /* =====================
     LOGIN VIEW
  ===================== */
  if (!loggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h2>Admin Login</h2>

          <form onSubmit={login} className="admin-form">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          {message && <p className="error">{message}</p>}
        </div>
      </div>
    );
  }

  /* =====================
     ADMIN PANEL
  ===================== */
  return (
    <div className="admin-page">
      <div className="admin-card">
        <h2>Admin Panel</h2>

        <p>
          <strong>Current Excel File:</strong> {currentFile}
        </p>

        <form onSubmit={uploadExcel} className="admin-form">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button type="submit">Upload New Excel</button>
        </form>

        {message && <p className="success">{message}</p>}
      </div>

      {/* BELOW CONTAINER */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Admin;