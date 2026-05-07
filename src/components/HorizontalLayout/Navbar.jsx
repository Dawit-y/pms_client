import classname from 'classnames';
import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as FaIcons from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

import { usePermissions } from '../../hooks/usePermissions';
import { menuItems } from '../Menu';

// Icon mapping function
const getIcon = (iconName) => {
  const Icon = FaIcons[iconName];
  return Icon ? <Icon className="me-2" /> : null;
};

const Navbar = () => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  // Filter menu data based on permissions
  const filteredMenuData = React.useMemo(() => {
    return menuItems
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
  }, [hasPermission]);

  const handleMenuClick = (index) => {
    setActiveMenuIndex(index === activeMenuIndex ? null : index);
  };

  const handleSubmenuClick = () => {
    setActiveMenuIndex(null);
  };

  const leftMenu = useSelector((state) => state.layout.leftMenu);

  return (
    <React.Fragment>
      <div className="topnav" style={{ zIndex: '' }}>
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              in={leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {filteredMenuData.map((menu, index) => (
                  <li key={index} className="nav-item dropdown">
                    <div
                      className="nav-link arrow-none"
                      onClick={() => handleMenuClick(index)}
                    >
                      {getIcon(menu.icon)}
                      {t(menu.title)}
                      <div className="arrow-down"></div>
                    </div>

                    <div
                      style={{
                        zIndex: 2000,
                        maxHeight: '500px',
                        overflowY: 'auto',
                      }}
                      className={classname('dropdown-menu', {
                        show: activeMenuIndex === index,
                      })}
                    >
                      {menu?.submenu &&
                        menu?.submenu?.map((submenu, subIndex) => (
                          <Link
                            key={subIndex}
                            to={submenu.path}
                            className="dropdown-item"
                            onClick={handleSubmenuClick}
                            style={{ zIndex: 200 }}
                          >
                            {t(submenu.name)}
                          </Link>
                        ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Navbar;
