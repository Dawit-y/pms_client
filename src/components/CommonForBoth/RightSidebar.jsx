import { FormGroup, Button, ButtonGroup } from 'react-bootstrap';
import { FaWindowClose } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import SimpleBar from 'simplebar-react';

import {
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  leftSidebarTypes,
} from '../../constants/layout';
import {
  changeLayout,
  changeLayoutMode,
  changeLayoutWidth,
  changeSidebarType,
  changeTopbarTheme,
  setRightSidebar,
  layoutSelectors,
} from '../../store/layout/layoutSlice';

const RightSidebar = () => {
  const dispatch = useDispatch();

  // Use selectors from the layout slice
  const {
    selectLayoutType,
    selectLayoutModeType,
    selectLayoutWidth,
    selectLeftSidebarType,
    selectTopbarTheme,
  } = layoutSelectors;

  // Get state values using selectors
  const layoutType = useSelector(selectLayoutType);
  const layoutModeType = useSelector(selectLayoutModeType);
  const layoutWidth = useSelector(selectLayoutWidth);
  const leftSideBarType = useSelector(selectLeftSidebarType);
  const topbarTheme = useSelector(selectTopbarTheme);

  const handleLayoutChange = (layout) => {
    dispatch(changeLayout(layout));
  };

  const handleLayoutWidthChange = (width) => {
    dispatch(changeLayoutWidth(width));
  };

  const handleTopbarThemeChange = (theme) => {
    dispatch(changeTopbarTheme(theme));
  };

  const handleSidebarTypeChange = (sidebarType) => {
    dispatch(changeSidebarType({ sidebarType, isMobile: false }));
  };

  const closeSidebar = () => {
    dispatch(setRightSidebar(false));
  };

  const buttonClass = 'me-2 mb-2 rounded';

  return (
    <>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: '900px' }}>
          <div className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  closeSidebar();
                }}
                className="right-bar-toggle float-end"
              >
                <FaWindowClose className="align-middle" />
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>
            <hr className="my-0" />
            <div className="p-4">
              {/* Layout */}
              <FormGroup>
                <span className="mb-2 d-block">Layouts</span>
                <ButtonGroup>
                  <Button
                    color={
                      layoutType === layoutTypes.VERTICAL ? 'primary' : 'light'
                    }
                    active={layoutType === layoutTypes.VERTICAL}
                    onClick={() => handleLayoutChange(layoutTypes.VERTICAL)}
                    className={buttonClass}
                  >
                    Vertical
                  </Button>
                  <Button
                    color={
                      layoutType === layoutTypes.HORIZONTAL
                        ? 'primary'
                        : 'light'
                    }
                    active={layoutType === layoutTypes.HORIZONTAL}
                    onClick={() => handleLayoutChange(layoutTypes.HORIZONTAL)}
                    className={buttonClass}
                  >
                    Horizontal
                  </Button>
                </ButtonGroup>
              </FormGroup>
              <hr />
              {/* Layout Mode */}
              <FormGroup>
                <span className="mb-2 d-block">Layout Mode</span>
                <ButtonGroup>
                  <Button
                    color={
                      layoutModeType === layoutModeTypes.LIGHT
                        ? 'primary'
                        : 'light'
                    }
                    active={layoutModeType === layoutModeTypes.LIGHT}
                    onClick={() =>
                      dispatch(changeLayoutMode(layoutModeTypes.LIGHT))
                    }
                    className={buttonClass}
                  >
                    Light
                  </Button>
                  <Button
                    color={
                      layoutModeType === layoutModeTypes.DARK
                        ? 'primary'
                        : 'light'
                    }
                    active={layoutModeType === layoutModeTypes.DARK}
                    onClick={() =>
                      dispatch(changeLayoutMode(layoutModeTypes.DARK))
                    }
                    className={buttonClass}
                  >
                    Dark
                  </Button>
                </ButtonGroup>
              </FormGroup>
              <hr />
              {/* Layout Width */}
              <FormGroup>
                <span className="mb-2 d-block">Layout Width</span>
                <ButtonGroup>
                  <Button
                    color={
                      layoutWidth === layoutWidthTypes.FLUID
                        ? 'primary'
                        : 'light'
                    }
                    active={layoutWidth === layoutWidthTypes.FLUID}
                    onClick={() =>
                      handleLayoutWidthChange(layoutWidthTypes.FLUID)
                    }
                    className={buttonClass}
                  >
                    Fluid
                  </Button>
                  <Button
                    color={
                      layoutWidth === layoutWidthTypes.BOXED
                        ? 'primary'
                        : 'light'
                    }
                    active={layoutWidth === layoutWidthTypes.BOXED}
                    onClick={() =>
                      handleLayoutWidthChange(layoutWidthTypes.BOXED)
                    }
                    className={buttonClass}
                  >
                    Boxed
                  </Button>
                  <Button
                    color={
                      layoutWidth === layoutWidthTypes.SCROLLABLE
                        ? 'primary'
                        : 'light'
                    }
                    active={layoutWidth === layoutWidthTypes.SCROLLABLE}
                    onClick={() =>
                      handleLayoutWidthChange(layoutWidthTypes.SCROLLABLE)
                    }
                    className={buttonClass}
                  >
                    Scrollable
                  </Button>
                </ButtonGroup>
              </FormGroup>
              <hr />
              {/* Topbar Theme */}
              <FormGroup>
                <span className="mb-2 d-block">Topbar Theme</span>
                <ButtonGroup>
                  <Button
                    color={
                      topbarTheme === topBarThemeTypes.LIGHT
                        ? 'primary'
                        : 'light'
                    }
                    active={topbarTheme === topBarThemeTypes.LIGHT}
                    onClick={() =>
                      handleTopbarThemeChange(topBarThemeTypes.LIGHT)
                    }
                    className={buttonClass}
                  >
                    Light
                  </Button>
                  <Button
                    color={
                      topbarTheme === topBarThemeTypes.DARK
                        ? 'primary'
                        : 'light'
                    }
                    active={topbarTheme === topBarThemeTypes.DARK}
                    onClick={() =>
                      handleTopbarThemeChange(topBarThemeTypes.DARK)
                    }
                    className={buttonClass}
                  >
                    Dark
                  </Button>
                </ButtonGroup>
              </FormGroup>
              {/* Sidebar Type (Vertical only) */}
              {layoutType === layoutTypes.VERTICAL && (
                <>
                  <hr />
                  <FormGroup>
                    <span className="mb-2 d-block">Left Sidebar Type</span>
                    <ButtonGroup>
                      <Button
                        color={
                          leftSideBarType === leftSidebarTypes.DEFAULT
                            ? 'primary'
                            : 'light'
                        }
                        active={leftSideBarType === leftSidebarTypes.DEFAULT}
                        onClick={() =>
                          handleSidebarTypeChange(leftSidebarTypes.DEFAULT)
                        }
                        className={buttonClass}
                      >
                        Default
                      </Button>
                      <Button
                        color={
                          leftSideBarType === leftSidebarTypes.COMPACT
                            ? 'primary'
                            : 'light'
                        }
                        active={leftSideBarType === leftSidebarTypes.COMPACT}
                        onClick={() =>
                          handleSidebarTypeChange(leftSidebarTypes.COMPACT)
                        }
                        className={buttonClass}
                      >
                        Compact
                      </Button>
                      <Button
                        color={
                          leftSideBarType === leftSidebarTypes.ICON
                            ? 'primary'
                            : 'light'
                        }
                        active={leftSideBarType === leftSidebarTypes.ICON}
                        onClick={() =>
                          handleSidebarTypeChange(leftSidebarTypes.ICON)
                        }
                        className={buttonClass}
                      >
                        Icon
                      </Button>
                    </ButtonGroup>
                  </FormGroup>
                </>
              )}
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay" />
    </>
  );
};

export default RightSidebar;
