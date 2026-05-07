import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaBars, FaExpand, FaCog } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';

import { logo } from '../../constants/constantTexts';
// Redux Store
import { toggleRightSidebar } from '../../store/layout/layoutSlice';
// Import menuDropdown
import LanguageDropdown from '../CommonForBoth/TopbarDropdown/LanguageDropdown';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';

const Header = () => {
  const dispatch = useDispatch();

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
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
  }

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle('sidebar-enable');
    } else {
      body.classList.toggle('vertical-collpsed');
      body.classList.toggle('sidebar-enable');
    }
  }

  function handleToggleRightSidebar() {
    dispatch(toggleRightSidebar());
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logo} alt="" height="55" />
                </span>
              </Link>
              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logo} alt="" height="55" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle();
              }}
              className="btn btn-sm px-3 font-size-16 header-item"
              id="vertical-menu-btn"
            >
              <FaBars size={20} />
            </button>
          </div>
          <div className="d-flex">
            <LanguageDropdown />
            <Dropdown className="d-none d-lg-inline-block ms-1"></Dropdown>
            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon"
                data-toggle="fullscreen"
              >
                <FaExpand size={20} />
              </button>
            </div>
            <NotificationDropdown />
            <ProfileMenu />
            <div className="dropdown d-inline-block">
              <button
                onClick={() => {
                  handleToggleRightSidebar();
                }}
                type="button"
                className="btn header-item noti-icon right-bar-toggle"
              >
                <FaCog size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
