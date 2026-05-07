import { useQuery } from '@tanstack/react-query';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { post } from '../../helpers/axios';
import { useSearchDepartments } from '../../queries/department_query';
import AsyncSelectField from './AsyncSelectField';

const fetchDepartmentsByParent = async (parentId = null) => {
  const response = await post(
    `department/departmentbyparent?parent_id=${parentId}`
  );
  return response?.data || [];
};

const CascadingDepartmentDropdowns = ({
  formik,
  dropdown1name,
  dropdown2name,
  dropdown3name,
  dropdown4name,
  required = false,
  disabled,
  layout = 'horizontal',
  colSizes = { md: 3 },
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Helper function to get department name based on current language
  const getDepartmentName = (dept) => {
    switch (lang) {
      case 'am':
        return dept.dep_name_am || dept.name;
      case 'en':
        return dept.dep_name_en || dept.name;
      default:
        return dept.name || dept.dep_name_or;
    }
  };

  // Fetch initial departments
  const params = { dep_id: 1 };
  const { data: departments = [], isLoading: loadingDepartments } =
    useSearchDepartments(params);

  // Fetch sub-departments level 1 (for dropdown2name)
  const {
    data: subDepartments1 = [],
    isLoading: loadingSub1,
    refetch: refetchSub1,
  } = useQuery({
    queryKey: ['subDepartments1', formik?.values?.[dropdown1name]],
    queryFn: () => fetchDepartmentsByParent(formik?.values?.[dropdown1name]),
    enabled: !!formik?.values?.[dropdown1name],
  });

  // Fetch sub-departments level 2 (for dropdown3name)
  const {
    data: subDepartments2 = [],
    isLoading: loadingSub2,
    refetch: refetchSub2,
  } = useQuery({
    queryKey: ['subDepartments2', formik?.values?.[dropdown2name]],
    queryFn: () => fetchDepartmentsByParent(formik?.values?.[dropdown2name]),
    enabled: !!formik?.values?.[dropdown2name],
  });

  // Fetch sub-departments level 3 (for dropdown4name)
  const {
    data: subDepartments3 = [],
    isLoading: loadingSub3,
    refetch: refetchSub3,
  } = useQuery({
    queryKey: ['subDepartments3', formik?.values?.[dropdown3name]],
    queryFn: () => fetchDepartmentsByParent(formik?.values?.[dropdown3name]),
    enabled: !!formik?.values?.[dropdown3name],
  });

  // Handle department change (level 1)
  const handleDepartmentChange = (value) => {
    formik?.setFieldValue?.(dropdown1name, value);
    formik?.setFieldValue?.(dropdown2name, '');
    formik?.setFieldValue?.(dropdown3name, '');
    formik?.setFieldValue?.(dropdown4name, '');
    refetchSub1();
  };

  // Handle sub-department level 1 change
  const handleSub1Change = (value) => {
    formik?.setFieldValue?.(dropdown2name, value);
    formik?.setFieldValue?.(dropdown3name, '');
    formik?.setFieldValue?.(dropdown4name, '');
    refetchSub2();
  };

  // Handle sub-department level 2 change
  const handleSub2Change = (value) => {
    formik?.setFieldValue?.(dropdown3name, value);
    formik?.setFieldValue?.(dropdown4name, '');
    refetchSub3();
  };

  // Build option maps for AsyncSelectField
  const departmentsMap = departments?.data?.reduce((acc, dept) => {
    acc[dept.dep_id] = getDepartmentName(dept);
    return acc;
  }, {});

  const subDepartments1Map = subDepartments1.reduce((acc, dept) => {
    acc[dept.id] = getDepartmentName(dept);
    return acc;
  }, {});

  const subDepartments2Map = subDepartments2.reduce((acc, dept) => {
    acc[dept.id] = getDepartmentName(dept);
    return acc;
  }, {});

  const subDepartments3Map = subDepartments3.reduce((acc, dept) => {
    acc[dept.id] = getDepartmentName(dept);
    return acc;
  }, {});

  // Render dropdown group (vertical layout)
  const renderDropdownGroup = () => (
    <>
      <AsyncSelectField
        fieldId={dropdown1name}
        formik={formik}
        label={t('department')}
        optionMap={departmentsMap}
        onChange={handleDepartmentChange}
        touched={!!formik?.touched?.[dropdown1name]}
        error={formik?.errors?.[dropdown1name]}
        isRequired={required}
        className="col-md-12 mb-3"
        isDisabled={disabled}
        isLoading={loadingDepartments}
      />

      <AsyncSelectField
        fieldId={dropdown2name}
        formik={formik}
        label={t(dropdown2name)}
        optionMap={subDepartments1Map}
        onChange={handleSub1Change}
        touched={!!formik?.touched?.[dropdown2name]}
        error={formik?.errors?.[dropdown2name]}
        isRequired={required}
        className="col-md-12 mb-3"
        isLoading={loadingSub1}
        isDisabled={
          disabled ||
          !formik?.values?.[dropdown1name] ||
          subDepartments1.length === 0
        }
      />

      <AsyncSelectField
        fieldId={dropdown3name}
        formik={formik}
        label={t(dropdown3name)}
        optionMap={subDepartments2Map}
        onChange={handleSub2Change}
        touched={!!formik?.touched?.[dropdown3name]}
        error={formik?.errors?.[dropdown3name]}
        isRequired={required}
        className="col-md-12 mb-3"
        isLoading={loadingSub2}
        isDisabled={
          disabled ||
          !formik?.values?.[dropdown2name] ||
          subDepartments2.length === 0
        }
      />

      <AsyncSelectField
        fieldId={dropdown4name}
        formik={formik}
        label={t(dropdown4name)}
        optionMap={subDepartments3Map}
        onChange={(value) => formik?.setFieldValue?.(dropdown4name, value)}
        touched={!!formik?.touched?.[dropdown4name]}
        error={formik?.errors?.[dropdown4name]}
        isRequired={required}
        className="col-md-12 mb-3"
        isLoading={loadingSub3}
        isDisabled={
          disabled ||
          !formik?.values?.[dropdown3name] ||
          subDepartments3.length === 0
        }
      />
    </>
  );

  // Render horizontal layout
  const renderHorizontalLayout = () => (
    <Row>
      {/* Level 1 - Department */}
      <Col {...colSizes}>
        <AsyncSelectField
          fieldId={dropdown1name}
          formik={formik}
          label={t('department')}
          optionMap={departmentsMap}
          onChange={handleDepartmentChange}
          touched={!!formik?.touched?.[dropdown1name]}
          error={formik?.errors?.[dropdown1name]}
          isRequired={required}
          withCol={false}
          isDisabled={disabled}
          isLoading={loadingDepartments}
        />
      </Col>

      {/* Level 2 - Sub Department 1 */}
      <Col {...colSizes}>
        <AsyncSelectField
          fieldId={dropdown2name}
          formik={formik}
          label={t(dropdown2name)}
          optionMap={subDepartments1Map}
          onChange={handleSub1Change}
          touched={!!formik?.touched?.[dropdown2name]}
          error={formik?.errors?.[dropdown2name]}
          isRequired={required}
          withCol={false}
          isLoading={loadingSub1}
          isDisabled={
            disabled ||
            !formik?.values?.[dropdown1name] ||
            subDepartments1.length === 0
          }
        />
      </Col>

      {/* Level 3 - Sub Department 2 */}
      <Col {...colSizes}>
        <AsyncSelectField
          fieldId={dropdown3name}
          formik={formik}
          label={t(dropdown3name)}
          optionMap={subDepartments2Map}
          onChange={handleSub2Change}
          touched={!!formik?.touched?.[dropdown3name]}
          error={formik?.errors?.[dropdown3name]}
          isRequired={required}
          withCol={false}
          isLoading={loadingSub2}
          isDisabled={
            disabled ||
            !formik?.values?.[dropdown2name] ||
            subDepartments2.length === 0
          }
        />
      </Col>

      {/* Level 4 - Sub Department 3 */}
      <Col {...colSizes}>
        <AsyncSelectField
          fieldId={dropdown4name}
          formik={formik}
          label={t(dropdown4name)}
          optionMap={subDepartments3Map}
          onChange={(value) => formik?.setFieldValue?.(dropdown4name, value)}
          touched={!!formik?.touched?.[dropdown4name]}
          error={formik?.errors?.[dropdown4name]}
          isRequired={required}
          withCol={false}
          isLoading={loadingSub3}
          isDisabled={
            disabled ||
            !formik?.values?.[dropdown3name] ||
            subDepartments3.length === 0
          }
        />
      </Col>
    </Row>
  );

  return layout === 'horizontal'
    ? renderHorizontalLayout()
    : renderDropdownGroup();
};

export default CascadingDepartmentDropdowns;
