import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const FormActionButtons = ({
  isSubmitting,
  isPending,
  isEdit,
  dirty,
  onCancel,
  onSaveAndClose,
  onSaveAndView,
  buttonWrapperClassName = 'd-flex justify-content-end mt-3 gap-2',
  renderSeparator,
}) => {
  const { t } = useTranslation();
  const isLoading = isSubmitting || isPending;
  const isDisabled = isLoading || !dirty;

  return (
    <div className={buttonWrapperClassName}>
      <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
        {t('cancel')}
      </Button>
      {renderSeparator && renderSeparator()}
      <Button variant="primary" onClick={onSaveAndClose} disabled={isDisabled}>
        {isLoading && <Spinner size="sm" className="me-2" />}
        {isEdit ? t('update_and_close') : t('save_and_close')}
      </Button>
      {renderSeparator && renderSeparator()}
      <Button variant="success" onClick={onSaveAndView} disabled={isDisabled}>
        {isLoading && <Spinner size="sm" className="me-2" />}
        {isEdit ? t('update_and_view') : t('save_and_view')}
      </Button>
    </div>
  );
};

export default FormActionButtons;
