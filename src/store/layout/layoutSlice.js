// @flow
import { createSlice, createSelector } from '@reduxjs/toolkit';

//constants
import {
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  leftBarThemeImageTypes,
  leftSidebarTypes,
  leftSideBarThemeTypes,
} from '../../constants/layout';
import { persistLayout, getLayout } from '../../utils/layoutStorage';

// Helper functions for DOM manipulation
const changeBodyAttribute = (attribute, value) => {
  if (document.body) document.body.setAttribute(attribute, value);
};

const changeHtmlAttribute = (attribute, value) => {
  if (document.documentElement)
    document.documentElement.setAttribute(attribute, value);
};

const manageBodyClass = (cssClass, action = 'toggle') => {
  if (!document.body) return;

  switch (action) {
    case 'add':
      document.body.classList.add(cssClass);
      break;
    case 'remove':
      document.body.classList.remove(cssClass);
      break;
    default:
      document.body.classList.toggle(cssClass);
      break;
  }
};

const initialState = {
  layoutType: getLayout('layoutType') || layoutTypes.HORIZONTAL,
  layoutModeType: getLayout('layoutModeType') || layoutModeTypes.LIGHT,
  layoutWidth: getLayout('layoutWidth') || layoutWidthTypes.FLUID,
  leftSideBarTheme:
    getLayout('leftSideBarTheme') || leftSideBarThemeTypes.COLORED,
  leftSideBarThemeImage:
    getLayout('leftSideBarThemeImage') || leftBarThemeImageTypes.NONE,
  leftSideBarType: getLayout('leftSideBarType') || leftSidebarTypes.DEFAULT,
  topbarTheme: getLayout('topbarTheme') || topBarThemeTypes.LIGHT,
  isPreloader: getLayout('isPreloader') || false,
  showRightSidebar: getLayout('showRightSidebar') || false,
  isMobile: false,
  showSidebar: true,
  leftMenu: false,
};

// Apply initial layout settings
const applyInitialLayoutSettings = () => {
  const layoutMode = getLayout('layoutModeType');
  const layoutType = getLayout('layoutType');
  const layoutWidth = getLayout('layoutWidth');
  const leftSidebarTheme = getLayout('leftSideBarTheme');
  const topbarTheme = getLayout('topbarTheme');

  if (layoutMode) changeHtmlAttribute('data-bs-theme', layoutMode);
  if (layoutType) changeBodyAttribute('data-layout', layoutType);
  if (layoutWidth) changeBodyAttribute('data-layout-size', layoutWidth);
  if (leftSidebarTheme) changeBodyAttribute('data-sidebar', leftSidebarTheme);
  if (topbarTheme) changeBodyAttribute('data-topbar', topbarTheme);
};

// Apply initial settings
applyInitialLayoutSettings();

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    changeLayout: (state, action) => {
      const layout = action.payload;
      persistLayout('layoutType', layout);
      state.layoutType = layout;

      if (layout === 'horizontal') {
        document.body.removeAttribute('data-sidebar');
        document.body.removeAttribute('data-sidebar-image');
        document.body.removeAttribute('data-sidebar-size');
      }
      changeBodyAttribute('data-layout', layout);
    },
    changePreloader: (state, action) => {
      persistLayout('isPreloader', action.payload);
      state.isPreloader = action.payload;
    },
    changeLayoutMode: (state, action) => {
      const mode = action.payload;
      persistLayout('layoutModeType', mode);
      state.layoutModeType = mode;
      changeHtmlAttribute('data-bs-theme', mode);
    },
    changeLayoutWidth: (state, action) => {
      const width = action.payload;
      persistLayout('layoutWidth', width);
      state.layoutWidth = width;

      if (width === 'boxed') {
        state.leftSideBarType = 'icon';
        changeBodyAttribute('data-layout-size', width);
        changeBodyAttribute('data-layout-scrollable', false);
      } else if (width === 'scrollable') {
        state.leftSideBarType = 'default';
        changeBodyAttribute('data-layout-scrollable', true);
      } else {
        state.leftSideBarType = 'default';
        changeBodyAttribute('data-layout-size', width);
        changeBodyAttribute('data-layout-scrollable', false);
      }
    },
    changeSidebarTheme: (state, action) => {
      const theme = action.payload;
      persistLayout('leftSideBarTheme', theme);
      state.leftSideBarTheme = theme;
      changeBodyAttribute('data-sidebar', theme);
    },
    changeSidebarThemeImage: (state, action) => {
      const theme = action.payload;
      persistLayout('leftSideBarThemeImage', theme);
      state.leftSideBarThemeImage = theme;
      changeBodyAttribute('data-sidebar-image', theme);
    },
    changeSidebarType: (state, action) => {
      const { sidebarType, isMobile } = action.payload;
      persistLayout('leftSideBarType', action.payload);
      state.leftSideBarType = sidebarType;

      switch (sidebarType) {
        case 'compact':
          changeBodyAttribute('data-sidebar-size', 'small');
          manageBodyClass('sidebar-enable', 'remove');
          manageBodyClass('vertical-collpsed', 'remove');
          break;
        case 'icon':
          changeBodyAttribute('data-sidebar-size', '');
          changeBodyAttribute('data-keep-enlarged', 'true');
          manageBodyClass('vertical-collpsed', 'add');
          break;
        case 'condensed':
          manageBodyClass('sidebar-enable', 'add');
          if (window.screen.width >= 992) {
            manageBodyClass('vertical-collpsed', 'remove');
            manageBodyClass('sidebar-enable', 'remove');
            manageBodyClass('vertical-collpsed', 'add');
            manageBodyClass('sidebar-enable', 'add');
          } else {
            manageBodyClass('sidebar-enable', 'add');
            manageBodyClass('vertical-collpsed', 'add');
          }
          break;
        default:
          changeBodyAttribute('data-sidebar-size', '');
          manageBodyClass('sidebar-enable', 'remove');
          if (!isMobile) manageBodyClass('vertical-collpsed', 'remove');
          break;
      }
    },
    changeTopbarTheme: (state, action) => {
      const theme = action.payload;
      persistLayout('topbarTheme', theme);
      state.topbarTheme = theme;
      changeBodyAttribute('data-topbar', theme);
    },
    toggleRightSidebar: (state) => {
      const newValue = !state.showRightSidebar;
      persistLayout('showRightSidebar', newValue);
      state.showRightSidebar = newValue;
      manageBodyClass('right-bar-enabled', newValue ? 'add' : 'remove');
    },
    setRightSidebar: (state, action) => {
      const newValue = action.payload;
      persistLayout('showRightSidebar', newValue);
      state.showRightSidebar = newValue;
      manageBodyClass('right-bar-enabled', newValue ? 'add' : 'remove');
    },
    showSidebar: (state, action) => {
      persistLayout('showSidebar', action.payload);
      state.showSidebar = action.payload;
    },
    toggleLeftMenu: (state, action) => {
      persistLayout('leftMenu', action.payload);
      state.leftMenu = action.payload;
    },
  },
});

// actions

export const {
  changeLayout,
  changePreloader,
  changeLayoutMode,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeTopbarTheme,
  toggleRightSidebar,
  setRightSidebar,
  showSidebar,
  toggleLeftMenu,
} = layoutSlice.actions;

//selectors

const selectLayoutState = (state) => state.layout;

export const selectLayoutType = createSelector(
  [selectLayoutState],
  (layout) => layout.layoutType
);

export const selectLayoutModeType = createSelector(
  [selectLayoutState],
  (layout) => layout.layoutModeType
);

export const selectLayoutWidth = createSelector(
  [selectLayoutState],
  (layout) => layout.layoutWidth
);

export const selectLeftSidebarType = createSelector(
  [selectLayoutState],
  (layout) => layout.leftSideBarType
);

export const selectLeftSidebarTheme = createSelector(
  [selectLayoutState],
  (layout) => layout.leftSideBarTheme
);

export const selectTopbarTheme = createSelector(
  [selectLayoutState],
  (layout) => layout.topbarTheme
);

export const selectShowRightSidebar = createSelector(
  [selectLayoutState],
  (layout) => layout.showRightSidebar
);

export const selectIsMobile = createSelector(
  [selectLayoutState],
  (layout) => layout.isMobile
);

export const selectShowSidebar = createSelector(
  [selectLayoutState],
  (layout) => layout.showSidebar
);

export const selectLeftMenu = createSelector(
  [selectLayoutState],
  (layout) => layout.leftMenu
);

export const selectIsPreloader = createSelector(
  [selectLayoutState],
  (layout) => layout.isPreloader
);

export const layoutSelectors = {
  selectLayoutType,
  selectLayoutModeType,
  selectLayoutWidth,
  selectLeftSidebarType,
  selectLeftSidebarTheme,
  selectTopbarTheme,
  selectShowRightSidebar,
  selectIsMobile,
  selectShowSidebar,
  selectLeftMenu,
  selectIsPreloader,
};

export default layoutSlice.reducer;
