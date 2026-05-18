import { useState } from "react";

export default function Login() {

  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/accounts/google/login/";
  };

  const handleAdminLogin = async () => {
    console.log("Admin login attempt:", adminUser, adminPass);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/login/", {  // ✅ FIXED: Changed from /admin-auth/login/ to /api/admin/login/
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: adminUser,
          password: adminPass
        })
      });

      console.log("Response status:", res.status);

      const data = await res.json();

      console.log("Server response:", data);

      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        window.location.href = "/admin";
      } else {
        alert(data.error || "Admin login failed");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-modal">
        <h1 className="modal-title">Welcome Back</h1>
        <p className="modal-subtitle">Sign in to continue to your account</p>

        <button onClick={handleGoogleLogin} className="auth-btn google-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.621 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <div className="admin-login">
          <h3>Admin Access</h3>

          <input
            type="text"
            placeholder="Admin Username"
            className="admin-input"
            value={adminUser}
            onChange={(e) => setAdminUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="admin-input"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
          />

          <button className="admin-btn" onClick={handleAdminLogin}>
            Login as Admin
          </button>
        </div>
        <p className="footer-note">
          By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');
        body, .login-page { background: #0d0d0d; }
        .login-page {
          min-height: 100vh; display: flex; align-items: center;
          justify-content: center; padding: 2rem; position: relative; overflow: hidden;
        }
        .login-page::before {
          content: ''; position: fixed; top: -30%; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-modal {
          background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 16px;
          padding: 2.5rem 2rem; width: 100%; max-width: 420px; text-align: center;
          animation: fadeUp 0.4s ease both;
          box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .modal-title { font-size: 1.75rem; font-weight: 600; color: #f0f0f0; margin-bottom: 0.6rem; letter-spacing: -0.02em; font-family: 'Sora', sans-serif; }
        .modal-subtitle { font-size: 0.88rem; color: #888; font-weight: 300; line-height: 1.6; margin-bottom: 2rem; font-family: 'Sora', sans-serif; }
        .auth-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.65rem;
          width: 100%; padding: 0.75rem 1rem; border-radius: 10px;
          border: 1px solid #2e2e2e; background: #222; color: #d4d4d4;
          font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 500;
          cursor: pointer; transition: background 0.18s, border-color 0.18s, transform 0.12s;
          margin-bottom: 0.75rem;
        }
        .auth-btn:hover { background: #2a2a2a; border-color: #3a3a3a; color: #fff; transform: translateY(-1px); }
        .auth-btn:focus {
          outline: none;
          box-shadow: none;
        }
        .footer-note { margin-top: 1.5rem; font-size: 0.75rem; color: #555; line-height: 1.6; font-family: 'Sora', sans-serif; }
        .footer-note a { color: #888; text-decoration: underline; text-underline-offset: 2px; }
        button:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        button:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        .admin-login{
          margin-top:20px;
          padding-top:20px;
          border-top:1px solid #2a2a2a;
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .admin-login h3{
          font-size:0.9rem;
          color:#888;
        }

        .admin-input{
          padding:0.65rem;
          background:#222;
          border:1px solid #2e2e2e;
          border-radius:8px;
          color:white;
          font-size:0.85rem;
        }

        .admin-input:focus{
          outline:none;
          border-color:#3a3a3a;
        }

        .admin-btn{
          margin-top:5px;
          padding:0.65rem;
          background:#00c8ff;
          border:none;
          border-radius:8px;
          color:black;
          font-weight:600;
          cursor:pointer;
        }

        .admin-btn:hover{
          background:#00a8d4;
        }
      `}</style>
    </div>
  )
}