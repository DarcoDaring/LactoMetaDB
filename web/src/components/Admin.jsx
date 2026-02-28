import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

/* 🔑 BACKEND BASE URL */
const API_BASE = import.meta.env.VITE_API_URL;

function Admin() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [currentFile, setCurrentFile] = useState("");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const [uploading, setUploading] = useState(false); // 🔑 LOADING STATE

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
      .catch(() => {
        setMessage("Invalid username or password.");
        setMessageType("error");
      });
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

    setUploading(true);
    setMessage("");
    setMessageType("");

    const formData = new FormData();
    formData.append("file", file);

    fetch(`${API_BASE}/api/admin/upload-excel`, {
      method: "POST",
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setMessage("Excel file updated successfully. The database is now refreshed.");
        setMessageType("success");
        setCurrentFile(file.name);
        setFile(null);
      })
      .catch(() => {
        setMessage("Upload failed. Please verify the Excel format and try again.");
        setMessageType("error");
      })
      .finally(() => {
        setUploading(false);
      });
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

        <p className="current-file">
          <strong>Current Excel File:</strong> {currentFile}
        </p>

        <form onSubmit={uploadExcel} className="admin-form">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
            required
          />

          <button type="submit" disabled={uploading}>
            {uploading ? (
              <span className="loader"></span>
            ) : (
              "Upload New Excel"
            )}
          </button>
        </form>

        {message && (
          <p className={messageType === "success" ? "success" : "error"}>
            {message}
          </p>
        )}
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Admin;