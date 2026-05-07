import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { layoutTypes } from '../../constants/layout';
import {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  setRightSidebar,
} from '../../store/layout/layoutSlice';
import {
  selectLayoutModeType,
  selectLeftSidebarType,
  selectLayoutWidth,
  selectTopbarTheme,
  selectShowRightSidebar,
  selectLeftSidebarTheme,
  selectIsPreloader,
} from '../../store/layout/layoutSlice';
import RightSidebar from '../CommonForBoth/RightSidebar';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  const isPreloader = useSelector(selectIsPreloader);
  const layoutWidth = useSelector(selectLayoutWidth);
  const leftSideBarType = useSelector(selectLeftSidebarType);
  const topbarTheme = useSelector(selectTopbarTheme);
  const showRightSidebar = useSelector(selectShowRightSidebar);
  const leftSideBarTheme = useSelector(selectLeftSidebarTheme);
  const layoutModeType = useSelector(selectLayoutModeType);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    dispatch(
      changeSidebarType({
        sidebarType: leftSideBarType === 'default' ? 'condensed' : 'default',
        isMobile,
      })
    );
  };

  const hideRightbar = useCallback(
    (event) => {
      const rightbar = document.getElementById('right-bar');
      if (rightbar && rightbar.contains(event.target)) return;
      dispatch(setRightSidebar(false));
    },
    [dispatch]
  );

  useEffect(() => {
    document.body.addEventListener('click', hideRightbar, true);

    return () => {
      document.body.removeEventListener('click', hideRightbar, true);
    };
  }, [hideRightbar]);

  useEffect(() => {
    if (isPreloader) {
      document
        .getElementById('preloader')
        ?.style.setProperty('display', 'block');
      document.getElementById('status')?.style.setProperty('display', 'block');

      setTimeout(() => {
        document
          .getElementById('preloader')
          ?.style.setProperty('display', 'none');
        document.getElementById('status')?.style.setProperty('display', 'none');
      }, 2500);
    } else {
      document
        .getElementById('preloader')
        ?.style.setProperty('display', 'none');
      document.getElementById('status')?.style.setProperty('display', 'none');
    }
  }, [isPreloader]);

  // Initialize layout state once
  useEffect(() => {
    dispatch(changeLayout(layoutTypes.VERTICAL));
    dispatch(changeLayoutMode(layoutModeType));
    dispatch(changeSidebarTheme(leftSideBarTheme));
    dispatch(changeLayoutWidth(layoutWidth));
    dispatch(
      changeSidebarType({
        sidebarType: leftSideBarType,
        isMobile,
      })
    );
    dispatch(changeTopbarTheme(topbarTheme));
  }, [
    dispatch,
    layoutModeType,
    leftSideBarTheme,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    isMobile,
  ]);

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
        <Header toggleMenuCallback={toggleMenuCallback} />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">{children}</div>
        <Footer />
      </div>

      {showRightSidebar && <RightSidebar />}
      <div className="rightbar-overlay"></div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
