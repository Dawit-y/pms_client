import { createSelector } from '@reduxjs/toolkit';
import React, { useEffect, useState, useCallback } from 'react';
// Redux
import { useSelector, useDispatch } from 'react-redux';

// Constants
import { layoutTypes } from '../../constants/layout';
// Actions
import {
  changeLayout,
  changeTopbarTheme,
  changeLayoutWidth,
  changeLayoutMode,
  setRightSidebar,
} from '../../store/layout/layoutSlice';
import RightSidebar from '../CommonForBoth/RightSidebar';
import Footer from './Footer';
import Header from './Header';
// Components
import Navbar from './Navbar';

// Memoized selectors
const selectLayout = (state) => state.layout;

const selectLayoutProps = createSelector([selectLayout], (layout) => ({
  topbarTheme: layout.topbarTheme,
  layoutWidth: layout.layoutWidth,
  isPreloader: layout.isPreloader,
  showRightSidebar: layout.showRightSidebar,
  layoutModeType: layout.layoutModeType,
}));

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  const {
    topbarTheme,
    layoutWidth,
    isPreloader,
    showRightSidebar,
    layoutModeType,
  } = useSelector(selectLayoutProps);

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const openMenu = () => {
    setIsMenuOpened((prev) => !prev);
  };

  const hideRightbar = useCallback(
    (event) => {
      const rightbar = document.getElementById('right-bar');
      if (rightbar && rightbar.contains(event.target)) return;
      dispatch(setRightSidebar(false));
    },
    [dispatch]
  );

  // Layout initialization
  useEffect(() => {
    dispatch(changeLayout(layoutTypes.HORIZONTAL));
  }, [dispatch]);

  // DOM click for right sidebar
  useEffect(() => {
    document.body.addEventListener('click', hideRightbar, true);
    return () => {
      document.body.removeEventListener('click', hideRightbar, true);
    };
  }, [hideRightbar]);

  // Preloader
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    const status = document.getElementById('status');

    if (isPreloader) {
      preloader?.style.setProperty('display', 'block');
      status?.style.setProperty('display', 'block');
      setTimeout(() => {
        preloader?.style.setProperty('display', 'none');
        status?.style.setProperty('display', 'none');
      }, 2500);
    } else {
      preloader?.style.setProperty('display', 'none');
      status?.style.setProperty('display', 'none');
    }
  }, [isPreloader]);

  // Apply topbar theme
  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [dispatch, topbarTheme]);

  // Apply layout mode
  useEffect(() => {
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType));
    }
  }, [layoutModeType, dispatch]);

  // Apply layout width
  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [dispatch, layoutWidth]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="chase-dot" />
            ))}
          </div>
        </div>
      </div>

      <div id="layout-wrapper">
        <Header
          theme={topbarTheme}
          isMenuOpened={isMenuOpened}
          openLeftMenuCallBack={openMenu}
        />
        <Navbar menuOpen={isMenuOpened} />
        <div className="main-content">
          {children}
        </div>
        <Footer />
      </div>

      {showRightSidebar && <RightSidebar />}
      <div className="rightbar-overlay" />
    </>
  );
};

export default Layout;
