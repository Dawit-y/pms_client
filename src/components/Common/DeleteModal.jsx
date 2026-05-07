import PropTypes from 'prop-types';
import { Spinner, Modal, ModalBody } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaTrash } from 'react-icons/fa';

const DeleteModal = ({
  isOpen,
  onDeleteClick,
  toggle,
  isPending,
  itemName,
}) => {
  const { t } = useTranslation();
  return (
    <Modal size="md" show={isOpen} onHide={toggle} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button
            type="button"
            onClick={toggle}
            className="btn-close position-absolute end-0 top-0 m-3"
          ></button>
          <div className="avatar-sm mb-4 mx-auto">
            <div className="avatar-title bg-primary text-danger bg-opacity-10 font-size-20 rounded-3">
              <FaTrash className="align-middle" color="danger" />
            </div>
          </div>
          <p className="text-muted font-size-16 mb-4">{t('confirm_erase')}</p>
          {itemName && (
            <p className="text-muted font-size-16 mb-4">
              <strong>{itemName}</strong>
            </p>
          )}

          <div className="hstack gap-2 justify-content-center mb-0">
            {isPending ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDeleteClick}
                disabled={isPending}
              >
                <Spinner size={'sm'} color="light" className="me-1" />
                <span> {t('delete_now')}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDeleteClick}
              >
                {t('delete_now')}
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggle}
            >
              {t('close')}
            </button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

DeleteModal.propTypes = {
  toggle: PropTypes.func,
  onDeleteClick: PropTypes.func,
  isOpen: PropTypes.any,
  itemName: PropTypes.string,
  isPending: PropTypes.bool,
};

export default DeleteModal;
