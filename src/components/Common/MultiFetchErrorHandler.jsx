import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Card, CardBody } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaRedo,
  FaExclamationCircle,
  FaNetworkWired,
  FaServer,
  FaLock,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const RETRYABLE_STATUS_CODES = [408, 502, 503, 504];

const MultiFetchErrorHandler = ({
  errors = [],
  retryButtonText = 'Retry All',
  retryButtonIcon = <FaRedo />,
  showErrorDetails = false,
  logError = false,
  onTree = false,
}) => {
  const { t } = useTranslation();
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetchAll = async () => {
    if (!navigator.onLine) {
      toast.error(
        t('You are offline. Please check your internet connection.'),
        { autoClose: 2000 }
      );
      return;
    }

    setIsRefetching(true);
    try {
      await Promise.all(
        errors
          .filter((item) => item && typeof item.refetch === 'function')
          .map(({ refetch }) => refetch())
      );
    } catch (err) {
      if (logError) console.error('Error during refetch all:', err);
    } finally {
      setIsRefetching(false);
    }
  };

  if (!errors || errors.length === 0) return null;

  const renderErrorDetails = (error) => {
    if (!showErrorDetails || !error) return null;

    return (
      <div className={`mt-2 text-muted ${onTree ? 'small' : ''}`}>
        {error.message && (
          <p className="mb-1">
            <strong>{t('Error Message')}:</strong> {error.message}
          </p>
        )}
        {error.response?.status && (
          <p className="mb-0">
            <strong>{t('Status Code')}:</strong> {error.response.status}
          </p>
        )}
      </div>
    );
  };

  const getErrorIconAndMessage = (error) => {
    // Default values
    let result = {
      icon: (
        <FaExclamationCircle
          size={onTree ? 40 : 60}
          className="text-danger mb-3"
        />
      ),
      title: t('An error occurred'),
      message: t('Something went wrong. Please try again later.'),
    };

    if (!error) return result;

    // Check for timeout
    if (
      error.code === 'ECONNABORTED' ||
      error.message?.toLowerCase().includes('timeout')
    ) {
      return {
        icon: (
          <FaServer size={onTree ? 40 : 60} className="text-warning mb-3" />
        ),
        title: t('Connection Timeout'),
        message: t(
          'The server took too long to respond. Please try again later.'
        ),
      };
    }

    // Network error (request made but no response)
    if (error.request && !error.response) {
      return {
        icon: (
          <FaNetworkWired
            size={onTree ? 40 : 60}
            className="text-danger mb-3"
          />
        ),
        title: t('Network Error'),
        message: t('Please check your internet connection and try again.'),
      };
    }

    // HTTP status code errors
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 400:
          return {
            ...result,
            title: t('Bad Request'),
            message: t('The request could not be processed.'),
          };
        case 401:
          return {
            icon: (
              <FaLock size={onTree ? 40 : 60} className="text-warning mb-3" />
            ),
            title: t('Unauthorized'),
            message: t('You must be authenticated.'),
          };
        case 403:
          return {
            icon: (
              <FaLock size={onTree ? 40 : 60} className="text-warning mb-3" />
            ),
            title: t('Forbidden'),
            message: t("You don't have permission."),
          };
        case 404:
          return {
            ...result,
            title: t('Not Found'),
            message: t('The requested resource was not found.'),
          };
        case 429:
          return {
            ...result,
            title: t('Too Many Requests'),
            message: t("You've made too many requests. Try again later."),
          };
        case 500:
          return {
            icon: (
              <FaServer size={onTree ? 40 : 60} className="text-danger mb-3" />
            ),
            title: t('Server Error'),
            message: t('Something went wrong on our end.'),
          };
        case 502:
          return {
            ...result,
            title: t('Bad Gateway'),
            message: t('Server received an invalid response.'),
          };
        case 503:
          return {
            ...result,
            title: t('Service Unavailable'),
            message: t('Server is temporarily unavailable.'),
          };
        case 504:
          return {
            ...result,
            title: t('Gateway Timeout'),
            message: t('Server did not respond in time.'),
          };
        default:
          return result;
      }
    }

    return result;
  };

  const renderErrorCard = (error, index) => {
    const { icon, title, message } = getErrorIconAndMessage(error);

    return (
      <Card key={index} className={onTree ? '' : 'mb-3'}>
        <CardBody className={`text-center ${onTree ? 'p-3' : ''}`}>
          {icon}
          <div>
            <h2 className={`${onTree ? 'h5' : 'h4'} text-danger mb-2`}>
              {title}
            </h2>
            <p className={`${onTree ? 'small' : 'lead'} text-muted mb-2`}>
              {message}
            </p>
          </div>
          {renderErrorDetails(error)}
        </CardBody>
      </Card>
    );
  };

  // Filter out invalid errors before rendering
  const validErrors = errors.filter((item) => item && item.error);

  if (validErrors.length === 0) return null;

  return (
    <div
      className={
        onTree
          ? ''
          : 'd-flex flex-column align-items-center justify-content-center vh-100 bg-light'
      }
    >
      {validErrors.map(({ error }, idx) => renderErrorCard(error, idx))}

      {validErrors.some(
        (item) =>
          item.error?.response &&
          RETRYABLE_STATUS_CODES.includes(item.error.response.status)
      ) && (
        <button
          onClick={handleRefetchAll}
          className={`btn btn-primary mt-3 ${onTree ? 'btn-sm' : 'btn-lg'}`}
          disabled={isRefetching}
        >
          {isRefetching ? (
            <>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">{t('Loading...')}</span>
              </div>
              <span className="ms-2">{t('Retrying...')}</span>
            </>
          ) : (
            <>
              {retryButtonIcon}
              <span className="ms-2">{t(retryButtonText)}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

MultiFetchErrorHandler.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      error: PropTypes.object,
      refetch: PropTypes.func,
    })
  ),
  retryButtonText: PropTypes.string,
  retryButtonIcon: PropTypes.element,
  showErrorDetails: PropTypes.bool,
  logError: PropTypes.bool,
  onTree: PropTypes.bool,
};

MultiFetchErrorHandler.defaultProps = {
  errors: [],
  retryButtonText: 'Retry All',
  retryButtonIcon: <FaRedo />,
  showErrorDetails: false,
  logError: false,
  onTree: false,
};

export default MultiFetchErrorHandler;
