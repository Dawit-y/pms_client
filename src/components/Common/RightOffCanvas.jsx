import classnames from 'classnames';
import React, { useState, useEffect } from 'react';
import {
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
} from 'react-bootstrap';

/**
 * A reusable right-side off-canvas component with dynamic navigation tabs.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.handleClick - Function to toggle the off-canvas visibility.
 * @param {boolean} props.showCanvas - Boolean to determine whether the off-canvas is open.
 * @param {number} props.canvasWidth - The width of the off-canvas as a percentage of the viewport width (e.g., 84 for 84vw).
 * @param {string} props.name - The title displayed in the off-canvas header.
 * @param {string | number} props.id - An identifier passed to each rendered component via the `passedId` prop.
 * @param {Object} props.components - An object where keys are the navigation item labels, and values are React components to be rendered in corresponding tabs.
 *
 * @returns {JSX.Element} The RightOffCanvas component.
 *
 * @example
 * <RightOffCanvas
 *   handleClick={handleToggle}
 *   showCanvas={true}
 *   canvasWidth={80}
 *   name="Project Overview"
 *   id={123}
 *   components={{
 *     Documents: ProjectDocument,
 *     Payments: ProjectPayment,
 *     Stakeholder: ProjectStakeholder,
 *   }}
 * />
 */
import { usePermissions } from '../../hooks/usePermissions';

const RightOffCanvas = ({
  handleClick,
  showCanvas,
  canvasWidth,
  name,
  id,
  components,
}) => {
  const { hasPermission } = usePermissions();

  // Filter components based on permissions
  const navItems = Object.keys(components).filter((key) => {
    const item = components[key];
    if (item && typeof item === 'object' && item.permission) {
      return hasPermission(item.permission);
    }
    return true;
  });

  const firstTab = navItems[0];

  const [activeTab1, setActiveTab1] = useState(firstTab);

  useEffect(() => {
    if (showCanvas && firstTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab1(firstTab);
    }
  }, [showCanvas, firstTab]);

  const toggle1 = (tab) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab);
    }
  };

  return (
    <React.Fragment>
      <Offcanvas
        show={showCanvas}
        placement="end"
        onHide={handleClick}
        className={classnames('custom-offcanvas', {
          'custom-offcanvas-close': !showCanvas,
        })}
        style={{ width: `${canvasWidth}vw` }}
      >
        <OffcanvasHeader
          closeButton
          onHide={handleClick}
          className="ms-4 me-3 card-title"
        >
          {name}
        </OffcanvasHeader>
        <OffcanvasBody>
          <Col lg={12}>
            <Card className={navItems.length === 0 ? 'm-0 p-0' : ''}>
              <CardBody className={navItems.length === 0 ? 'm-0 p-0' : ''}>
                {navItems && (
                  <Nav variant="pills" className="navtab-bg nav-justified">
                    {navItems.map((navItem) => (
                      <NavItem
                        key={navItem}
                        className="me-3 mb-3"
                        style={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <NavLink
                          style={{
                            cursor: 'pointer',
                            borderColor:
                              activeTab1 === navItem ? '#007bff' : '#ccc',
                          }}
                          className={classnames({
                            active: activeTab1 === navItem,
                            'bg-light': activeTab1 !== navItem,
                            'w-25': navItems.length === 1,
                          })}
                          onClick={() => {
                            toggle1(navItem);
                          }}
                        >
                          <span className="d-none d-sm-block">{navItem}</span>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                )}
                <div className="p-3 text-muted mt-4">
                  {showCanvas &&
                    navItems.map((navItem) => {
                      const item = components[navItem];
                      const Component =
                        item && typeof item === 'object' && item.component
                          ? item.component
                          : item;

                      return (
                        <div
                          key={navItem}
                          style={{
                            display: activeTab1 === navItem ? 'block' : 'none',
                          }}
                        >
                          {React.createElement(Component, {
                            passedId: id,
                            isActive: activeTab1 === navItem,
                            projectName: name,
                          })}
                        </div>
                      );
                    })}
                </div>
              </CardBody>
            </Card>
          </Col>
        </OffcanvasBody>
      </Offcanvas>
    </React.Fragment>
  );
};

export default RightOffCanvas;
