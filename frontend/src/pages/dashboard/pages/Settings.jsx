import { useState, useEffect } from "react";
import api from "../../../api/axios";
import "./Settings.css";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
  });

  const [twoFA, setTwoFA] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [loginActivity, setLoginActivity] = useState([]);

  /* =============================
     FETCH PROFILE
  ============================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/settings/profile");

        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
        });

        setTwoFA(res.data.twoFA || false);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* =============================
     FETCH LOGIN ACTIVITY
  ============================= */
  useEffect(() => {
    if (activeTab !== "activity") return;

    const fetchActivity = async () => {
      try {
        setActivityLoading(true);
        const res = await api.get("/security/login-activity");
        setLoginActivity(res.data || []);
      } catch (err) {
        console.error("Activity fetch error:", err);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivity();
  }, [activeTab]);

  /* =============================
     PROFILE UPDATE
  ============================= */
  const saveProfile = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      alert("Name and email are required");
      return;
    }

    try {
      await api.put("/settings/profile", profile);
      alert("Profile updated");
    } catch (err) {
      console.error("Profile update error:", err);
      alert(err?.response?.data?.error || "Failed to update profile");
    }
  };

  /* =============================
     PASSWORD UPDATE
  ============================= */
  const updatePassword = async () => {
    if (!password.current || !password.newPassword) {
      alert("Fill all password fields");
      return;
    }

    if (password.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    try {
      await api.put("/settings/password", password);

      alert("Password updated");

      setPassword({
        current: "",
        newPassword: "",
      });
    } catch (err) {
      console.error("Password update error:", err);
      alert(err?.response?.data?.error || "Failed to update password");
    }
  };

  /* =============================
     2FA SETUP
  ============================= */
  const setupTwoFA = async () => {
    try {
      const res = await api.post("/settings/2fa/setup");
      setQrCode(res.data.qrCode);
    } catch (err) {
      console.error("2FA setup error:", err);
      alert(err?.response?.data?.error || "Failed to start 2FA setup");
    }
  };

  const verifyTwoFA = async () => {
    if (!twoFACode.trim()) {
      alert("Enter the verification code");
      return;
    }

    try {
      await api.post("/settings/2fa/verify", {
        token: twoFACode.trim(),
      });

      setTwoFA(true);
      setQrCode(null);
      setTwoFACode("");
      alert("2FA enabled successfully");
    } catch (err) {
      console.error("2FA verify error:", err);
      alert(err?.response?.data?.error || "Invalid verification code");
    }
  };

  const disableTwoFA = async () => {
    try {
      await api.post("/settings/2fa/disable");

      setTwoFA(false);
      setQrCode(null);
      setTwoFACode("");
      alert("2FA disabled");
    } catch (err) {
      console.error("2FA disable error:", err);
      alert(err?.response?.data?.error || "Failed to disable 2FA");
    }
  };

  /* =============================
     LOGOUT
  ============================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="settings-container">
      <h1 className="settings-title">Account & Security</h1>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>

          <button
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>

          <button
            className={activeTab === "security" ? "active" : ""}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>

          <button
            className={activeTab === "activity" ? "active" : ""}
            onClick={() => setActiveTab("activity")}
          >
            Login Activity
          </button>

          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
        </div>

        <div className="settings-content">
          {activeTab === "profile" && (
            <div className="settings-card">
              <h3>Profile Information</h3>

              <label>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />

              <label>Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />

              <button className="primary-btn" onClick={saveProfile}>
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "password" && (
            <div className="settings-card">
              <h3>Change Password</h3>

              <label>Current Password</label>
              <input
                type="password"
                value={password.current}
                onChange={(e) =>
                  setPassword({ ...password, current: e.target.value })
                }
              />

              <label>New Password</label>
              <input
                type="password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({ ...password, newPassword: e.target.value })
                }
              />

              <button className="primary-btn" onClick={updatePassword}>
                Update Password
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-card">
              <h3>Security Settings</h3>

              <div className="security-row">
                <div>
                  <strong>Two-Factor Authentication</strong>
                  <p>Protect your account with an authenticator app.</p>
                </div>

                {!twoFA ? (
                  <button className="primary-btn" onClick={setupTwoFA}>
                    Enable 2FA
                  </button>
                ) : (
                  <button className="danger-btn" onClick={disableTwoFA}>
                    Disable 2FA
                  </button>
                )}
              </div>

              {qrCode && !twoFA && (
                <div className="twofa-setup">
                  <p>Scan this QR code with Google Authenticator or Authy.</p>

                  <img src={qrCode} alt="2FA QR Code" className="qr-code" />

                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                  />

                  <button className="primary-btn" onClick={verifyTwoFA}>
                    Verify & Activate
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="settings-card">
              <h3>Login Activity</h3>

              {activityLoading ? (
                <p>Loading activity...</p>
              ) : loginActivity.length === 0 ? (
                <p>No login activity found.</p>
              ) : (
                loginActivity.map((log) => (
                  <div key={log._id} className="activity-row">
                    <span>
                      {log.browser || "Unknown Browser"} /{" "}
                      {log.device || "Unknown Device"}
                    </span>
                    <span>{log.location || "Unknown location"}</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settings-card">
              <h3>Notification Preferences</h3>

              <div className="security-row">
                <div>
                  <strong>Email Notifications</strong>
                  <p>Receive trading updates and important account alerts.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          )}

          <div className="settings-card danger-zone">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}