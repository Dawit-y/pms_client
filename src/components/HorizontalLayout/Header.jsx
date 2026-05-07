import React from 'react';
import { FaBars, FaExpand, FaBell, FaCog } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

// Assets
import { logo } from '../../constants/constantTexts';
// Redux actions
import {
  toggleLeftMenu,
  toggleRightSidebar,
} from '../../store/layout/layoutSlice';
// Topbar components
import LanguageDropdown from '../CommonForBoth/TopbarDropdown/LanguageDropdown';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

const Header = () => {
  const dispatch = useDispatch();

  const leftMenu = useSelector((state) => state.layout.leftMenu);

  const handleToggleLeftMenu = () => {
    dispatch(toggleLeftMenu(!leftMenu));
  };

  const handleToggleRightSidebar = () => {
    dispatch(toggleRightSidebar());
  };

  const toggleFullscreen = () => {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  };

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box">
            <Link to="/" className="logo logo-dark">
              <span className="logo-sm">
                <img src={logo} alt="logo" height="22" />
              </span>
              <span className="logo-lg">
                <img src={logo} alt="logo" height="55" />
              </span>
            </Link>
            <Link to="/" className="logo logo-light">
              <span className="logo-sm">
                <img src={logo} alt="logo" height="22" />
              </span>
              <span className="logo-lg">
                <img src={logo} alt="logo" height="55" />
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
            onClick={handleToggleLeftMenu}
            data-target="#topnav-menu-content"
          >
            <FaBars size={20} />
          </button>
        </div>

        <div className="d-flex">
          <LanguageDropdown />
          <div className="dropdown d-none d-lg-inline-block ms-1">
            <button
              type="button"
              className="btn header-item noti-icon"
              onClick={toggleFullscreen}
              data-toggle="fullscreen"
            >
              <FaExpand size={20} />
            </button>
          </div>
          <NotificationDropdown />
          <ProfileMenu />
          <div className="dropdown d-inline-block">
            <button
              onClick={handleToggleRightSidebar}
              type="button"
              className="btn header-item noti-icon right-bar-toggle"
            >
              <FaCog size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
