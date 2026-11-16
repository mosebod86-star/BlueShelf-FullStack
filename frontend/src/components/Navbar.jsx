import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  function logout() {
    onLogout();
    navigate("/login");
  }

  return (
    <header className="topbar">
      <div className="brand"><span className="brand-mark">B</span><span>BlueShelf</span></div>
      <nav className="nav-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        {user?.role !== "MEMBER" && <NavLink to="/users">Users</NavLink>}
      </nav>
      <div className="account-area">
        <span className="welcome">Hi, {user?.name?.split(" ")[0]}</span>
        <button className="button button-outline button-small" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
