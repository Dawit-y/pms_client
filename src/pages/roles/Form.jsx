import { useFormik } from 'formik';
import { memo, useRef, useState, useEffect } from 'react';
import { Form, Row, Card, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import * as Yup from 'yup';

import FormActionButtons from '../../components/Common/FormActionButtons';
import Input from '../../components/Common/Input';
import { useFetchPermissions } from '../../queries/permissions_query';
import { useAddRole, useUpdateRole } from '../../queries/roles_query';

const RolesForm = ({ isEdit = false, rowData }) => {
  const submitActionRef = useRef(null);

  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();

  const addRoleMutation = useAddRole();
  const updateRoleMutation = useUpdateRole();

  // Fetch all permissions, assuming per_page: 1000 can fetch most/all, or adjust accordingly
  const { data: permissionsResult, isLoading: isPermissionsLoading } =
    useFetchPermissions({ per_page: 1000 });
  const allPermissions = permissionsResult?.data || [];

  const [unassignedPermissions, setUnassignedPermissions] = useState([]);
  const [assignedPermissions, setAssignedPermissions] = useState([]);

  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);

  useEffect(() => {
    if (!isPermissionsLoading && allPermissions.length > 0) {
      if (rowData?.permissions) {
        const assignedIds = rowData.permissions.map((p) => p.id);
        const unassigned = allPermissions.filter(
          (p) => !assignedIds.includes(p.id)
        );
        const assigned = allPermissions.filter((p) =>
          assignedIds.includes(p.id)
        );
        setUnassignedPermissions(unassigned);
        setAssignedPermissions(assigned);
      } else if (!isEdit) {
        setUnassignedPermissions(allPermissions);
        setAssignedPermissions([]);
      }
    }
  }, [allPermissions, rowData?.id, isPermissionsLoading, isEdit]);

  // Build validation schema dynamically
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('field_required')),
  });

  const formik = useFormik({
    initialValues: {
      name: isEdit ? rowData?.name || '' : rowData?.name || '',
    },
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          permission_ids: assignedPermissions.map((p) => p.id),
        };

        if (isEdit) {
          await updateRoleMutation.mutateAsync({
            id: id || rowData.id,
            ...payload,
          });
        } else {
          await addRoleMutation.mutateAsync(payload);
        }

        if (submitActionRef.current === 'close') {
          navigate(-1);
        }

        if (submitActionRef.current === 'view') {
          const search = searchParams.toString();
          navigate(`/roles${search ? `?${search}` : ''}`);
        }
      } catch {
        // Error handling is managed globally by QueryProvider
      } finally {
        setSubmitting(false);
        submitActionRef.current = null;
      }
    },
  });

  const handleSaveAndClose = () => {
    submitActionRef.current = 'close';
    formik.submitForm();
  };

  const handleSaveAndView = () => {
    submitActionRef.current = 'view';
    formik.submitForm();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const moveToRight = () => {
    const toMove = unassignedPermissions.filter((p) =>
      leftSelected.includes(p.id)
    );
    setAssignedPermissions([...assignedPermissions, ...toMove]);
    setUnassignedPermissions(
      unassignedPermissions.filter((p) => !leftSelected.includes(p.id))
    );
    setLeftSelected([]);
  };

  const moveToLeft = () => {
    const toMove = assignedPermissions.filter((p) =>
      rightSelected.includes(p.id)
    );
    setUnassignedPermissions([...unassignedPermissions, ...toMove]);
    setAssignedPermissions(
      assignedPermissions.filter((p) => !rightSelected.includes(p.id))
    );
    setRightSelected([]);
  };

  const toggleLeftSelection = (id) => {
    setLeftSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleRightSelection = (id) => {
    setRightSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredUnassigned = unassignedPermissions.filter((p) =>
    p.name.toLowerCase().includes(leftSearch.toLowerCase())
  );
  const filteredAssigned = assignedPermissions.filter((p) =>
    p.name.toLowerCase().includes(rightSearch.toLowerCase())
  );

  const isMutationPending =
    addRoleMutation.isPending || updateRoleMutation.isPending;

  return (
    <Card>
      <Card.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row className="mb-4">
            <Col md={12}>
              <Input formik={formik} fieldId={'name'} />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={5}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-muted">
                  {t('unassigned_permissions')} ({unassignedPermissions.length})
                </span>
                <span className="badge bg-secondary">
                  {leftSelected.length} {t('selected')}
                </span>
              </div>
              <div className="mb-2">
                <Form.Control
                  type="text"
                  placeholder={t('search')}
                  value={leftSearch}
                  onChange={(e) => setLeftSearch(e.target.value)}
                />
              </div>
              <div
                className="border rounded p-2"
                style={{ height: '400px', overflowY: 'auto' }}
              >
                {filteredUnassigned.map((permission) => (
                  <div
                    key={permission.id}
                    className={`p-2 mb-1 cursor-pointer rounded ${
                      leftSelected.includes(permission.id)
                        ? 'bg-primary text-white'
                        : 'bg-light'
                    }`}
                    onClick={() => toggleLeftSelection(permission.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {permission.name}
                  </div>
                ))}
              </div>
            </Col>

            <Col
              md={2}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <Button
                variant="outline-primary"
                className="mb-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
                onClick={moveToRight}
                disabled={leftSelected.length === 0}
              >
                <FaArrowRight />
              </Button>
              <Button
                variant="outline-primary"
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
                onClick={moveToLeft}
                disabled={rightSelected.length === 0}
              >
                <FaArrowLeft />
              </Button>
            </Col>

            <Col md={5}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-muted">
                  {t('assigned_permissions')} ({assignedPermissions.length})
                </span>
                <span className="badge bg-secondary">
                  {rightSelected.length} {t('selected')}
                </span>
              </div>
              <div className="mb-2">
                <Form.Control
                  type="text"
                  placeholder={t('search')}
                  value={rightSearch}
                  onChange={(e) => setRightSearch(e.target.value)}
                />
              </div>
              <div
                className="border rounded p-2"
                style={{ height: '400px', overflowY: 'auto' }}
              >
                {filteredAssigned.map((permission) => (
                  <div
                    key={permission.id}
                    className={`p-2 mb-1 cursor-pointer rounded ${
                      rightSelected.includes(permission.id)
                        ? 'bg-primary text-white'
                        : 'bg-light'
                    }`}
                    onClick={() => toggleRightSelection(permission.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {permission.name}
                  </div>
                ))}
              </div>
            </Col>
          </Row>

          <FormActionButtons
            isSubmitting={formik.isSubmitting}
            isPending={isMutationPending}
            isEdit={isEdit}
            isValid={formik.isValid}
            dirty={formik.dirty || assignedPermissions.length > 0}
            onCancel={handleCancel}
            onSaveAndClose={handleSaveAndClose}
            onSaveAndView={handleSaveAndView}
          />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default memo(RolesForm);
