import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link className="brand" to="/dashboard" onClick={closeMenu}>
        Subscription Manager
      </Link>

      <button
        type="button"
        className="menu-button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((currentValue) => !currentValue)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={menuOpen ? "nav-links open" : "nav-links"}>
        <NavLink to="/dashboard" onClick={closeMenu}>
          Dashboard
        </NavLink>
        <NavLink to="/subscriptions" onClick={closeMenu}>
          Subscriptions
        </NavLink>
        <NavLink to="/subscriptions/add" onClick={closeMenu}>
          Add Subscription
        </NavLink>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
