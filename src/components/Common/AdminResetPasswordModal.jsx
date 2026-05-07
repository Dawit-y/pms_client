import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useChangePassword } from '../../queries/users_query';
import { checkPasswordStrength } from '../../utils/validations';

const AdminResetPasswordModal = ({ isOpen, toggle, userId, userName }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const { mutateAsync: resetPassword, isPending } = useChangePassword();

  const handleSubmit = async (values) => {
    try {
      await resetPassword({
        user_id: userId,
        password: values.password,
      });
      toast.success(t('password_changed_successfully'), { autoClose: 3000 });
      toggle();
    } catch {
      toast.error(t('password_change_failed'), { autoClose: 3000 });
    }
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(
          8,
          t('password_min_length') || 'Password must be at least 8 characters'
        )
        .max(
          12,
          t('password_max_length') || 'Password must not exceed 12 characters'
        )
        .required(t('new_password_required') || 'New password is required'),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref('password'), null],
          t('passwords_must_match') || 'Passwords must match'
        )
        .required(
          t('confirm_password_required') || 'Please confirm your password'
        ),
    }),
    onSubmit: handleSubmit,
  });

  const handlePasswordInputChange = (e) => {
    formik.handleChange(e);
    const strength = checkPasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setPasswordStrength('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={toggle} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaKey className="me-2 text-success" />
          {t('reset_password')}
          {userName && (
            <small className="text-muted fs-6 fw-normal ms-2">
              — {userName}
            </small>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t('new_password')}</Form.Label>
            <InputGroup>
              <Form.Control
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('enter_new_password')}
                maxLength={12}
                onChange={handlePasswordInputChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isInvalid={formik.touched.password && !!formik.errors.password}
              />
              <InputGroup.Text
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </InputGroup>

            {formik.values.password && (
              <div
                className={`mt-1 text-sm ${
                  passwordStrength === 'Strong'
                    ? 'text-success'
                    : passwordStrength === 'Moderate'
                      ? 'text-warning'
                      : 'text-danger'
                }`}
              >
                {t(passwordStrength)}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>{t('confirm_password')}</Form.Label>
            <InputGroup>
              <Form.Control
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('confirm_password')}
                maxLength={12}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                isInvalid={
                  formik.touched.confirmPassword &&
                  !!formik.errors.confirmPassword
                }
              />
              <InputGroup.Text
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{ cursor: 'pointer' }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {formik.errors.confirmPassword}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={toggle} disabled={isPending}>
              {t('cancel')}
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={isPending || !formik.isValid || !formik.dirty}
            >
              {isPending ? (
                <span>
                  <Spinner size="sm" className="me-1" />
                  {t('reset_password')}
                </span>
              ) : (
                t('reset_password')
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdminResetPasswordModal;
