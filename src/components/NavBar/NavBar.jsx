import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import styles from './NavBar.module.css';

import logo from '../../assets/images/logo.png';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleHomeClick = (e) => {
    // Let users open in new tab/window, etc.
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

    // If we're already on the Landing route, force a reload.
    if (location.pathname === '/') {
      e.preventDefault();
      // This uses the browser history API: history.go(0) == reload current page
      navigate(0);
      // альтернативно (also fine): window.location.reload();
    }
  };

  return (
    <nav className={styles.container}>
      {/* Left edge */}
      <div className={styles.left}>
        <Link className={styles.edgeLink} to="/" onClick={handleHomeClick}>
          Home
        </Link>
      </div>

      {/* Center brand */}
      <div className={styles.center}>
        <div className={styles.brandLink} aria-label="TrailCast">
          <span className={styles.brandTrail}>Trail</span>
          <img src={logo} alt="TrailCast logo" className={styles.logo} />
          <span className={styles.brandCast}>Cast</span>
        </div>
      </div>

      {/* Right edge */}
      <div className={styles.right}>
        {user ? (
          <ul className={styles.menu}>
            <li>
              <Link to="/my-profile">My Profile</Link>
            </li>
            <li>
              <Link to="/" onClick={handleSignOut}>
                Sign Out
              </Link>
            </li>
          </ul>
        ) : (
          <ul className={styles.menu}>
            <li>
              <Link to="/sign-up">Sign up</Link>
            </li>
            <li>
              <Link to="/sign-in">Sign in</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
