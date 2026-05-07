import PropTypes from 'prop-types';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as FaIcons from 'react-icons/fa';
import { Link, useLocation } from 'react-router';
import SimpleBar from 'simplebar-react';

import { usePermissions } from '../../hooks/usePermissions';

// Icon mapping function
const getIcon = (iconName, size = 16) => {
  if (!iconName) return null;
  const Icon = FaIcons[iconName];
  return Icon ? <Icon className="me-2" size={size} /> : null;
};

const SidebarContent = (props) => {
  const ref = useRef();
  const path = useLocation();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [openItems, setOpenItems] = useState({});
  const [activeItem, setActiveItem] = useState(null); // Track the active item

  // Filter menu data based on permissions
  const filteredMenuData = React.useMemo(() => {
    return props.sidedata
      .filter(
        (menu) =>
          !menu.permissions || hasPermission(menu.permissions, { match: 'any' })
      )
      .map((menu) => {
        if (menu.submenu) {
          return {
            ...menu,
            submenu: menu.submenu.filter(
              (sub) =>
                !sub.permissions ||
                hasPermission(sub.permissions, { match: 'any' })
            ),
          };
        }
        return menu;
      })
      .filter((menu) => !menu.submenu || menu.submenu.length > 0);
  }, [props.sidedata, hasPermission]);

  // Helper function to check if a submenu is open
  const isOpen = (index) => openItems[index] || false;

  const toggleOpen = (index) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const setActiveMenuItem = (itemPath) => {
    setActiveItem(itemPath);
  };

  // Function to open parent dropdown based on current path
  const openParentDropdown = useCallback(() => {
    const pathName = path.pathname;
    const menuData = filteredMenuData;

    // Iterate over the menu to find the matching submenu
    menuData.forEach((menu, index) => {
      if (menu.submenu) {
        menu.submenu.forEach((submenu) => {
          if (submenu.path === pathName) {
            setOpenItems((prevState) => ({
              ...prevState,
              [index]: true,
            }));
            setActiveMenuItem(submenu.path); // Set the active submenu
          }
        });
      }
    });
  }, [path.pathname, filteredMenuData]);

  useEffect(() => {
    openParentDropdown();
  }, [openParentDropdown]);

  const renderMenu = (menuData) => {
    return menuData.map((menu, index) => (
      <li
        key={index}
        className={`menu-item ${isOpen(index) ? 'mm-active' : ''}`}
        style={{
          color: activeItem === menu.path ? '#fff' : '', // Change text color when active
        }}
      >
        <Link
          to="#"
          className="nav-link"
          onClick={() => {
            toggleOpen(index);
            setActiveMenuItem(menu.path); // Set the active menu on click
          }}
          style={{
            color: activeItem === menu.path ? '#fff' : '', // Change text color when active
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {getIcon(menu.icon)}
            <span>{t(menu.title)}</span>
          </div>
          {menu.submenu && (
            <FaIcons.FaChevronDown
              size={12}
              style={{
                transform: isOpen(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                marginLeft: '8px',
              }}
            />
          )}
        </Link>
        {menu.submenu && isOpen(index) && (
          <ul className="sub-menu" aria-expanded="true">
            {menu.submenu.map((submenu, subIndex) => (
              <li
                key={subIndex}
                className={`submenu-item ${
                  activeItem === submenu.path ? 'active' : ''
                }`}
                style={{
                  color: activeItem === submenu.path ? '#fff' : '',
                }}
              >
                <Link
                  to={submenu.path}
                  onClick={() => setActiveMenuItem(submenu.path)} // Set active submenu on click
                  style={{
                    color: activeItem === submenu.path ? '#fff' : '', // Change text color when active
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '40px', // Add left padding for submenu items
                  }}
                >
                  {t(submenu.name)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {renderMenu(filteredMenuData)}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  sidedata: PropTypes.array.isRequired,
};

export default SidebarContent;
