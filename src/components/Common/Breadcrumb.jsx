import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaArrowCircleLeft, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';

import { useIsMobile } from '../../hooks/useIsMobile';

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const lastBreadcrumbLabel = items[items.length - 1]?.label || '';

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          {/* LEFT SIDE (hide on mobile) */}
          {!isMobile && (
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="d-flex align-items-center justify-content-center btn btn-link p-0 border-0"
                style={{ background: 'none' }}
              >
                <FaArrowCircleLeft size={25} />
              </button>

              <h4 className="mb-0 font-size-18 align-middle">
                {t(lastBreadcrumbLabel)}
              </h4>
            </div>
          )}

          {/* RIGHT SIDE (always visible & aligned right) */}
          <div className="page-title-right ms-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0">
                <li
                  className={`breadcrumb-item${
                    items.length === 0 ? ' active' : ''
                  }`}
                >
                  <Link
                    to="/dashboard"
                    className="d-flex align-items-center gap-1"
                  >
                    <FaHome />
                    <span>{t('home_page')}</span>
                  </Link>
                </li>

                {items.map((item, index) => (
                  <li
                    key={index}
                    className={`breadcrumb-item${item.active ? ' active' : ''}`}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    {item.active ? (
                      t(item.label)
                    ) : (
                      <Link to={item.path}>{t(item.label)}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </Col>
    </Row>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      active: PropTypes.bool,
    })
  ),
};

export default Breadcrumb;
