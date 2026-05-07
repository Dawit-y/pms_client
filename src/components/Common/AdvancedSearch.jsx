import { useFormik } from 'formik';
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { EtCalendar } from 'react-ethiopian-calendar';
import { useTranslation } from 'react-i18next';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import 'react-ethiopian-calendar/dist/index.css';

import { useFetchLocations } from '../../queries/locations_query';
import { parseDateString, toYMDDateString } from '../../utils/commonMethods';
import AsyncSelectField from './AsyncSelectField';
import FetchErrorHandler from './FetchErrorHandler';

const AdvancedSearch = ({
  ref,
  searchHook,
  pageFilter,
  textSearchKeys,
  secondaryTextSearchKeys,
  dropdownSearchKeys,
  secondaryDropdownSearchKeys,
  checkboxSearchKeys,
  dateSearchKeys,
  Component,
  component_params = {},
  additionalParams,
  setAdditionalParams,
  onSearchResult,
  onSearchLabels,
  setIsSearchLoading,
  setSearchResults,
  setShowSearchResult,
  getSearchParams,
  setExportSearchParams,
  setPaginationInfo,
  onClear,
  children,
  onSearchClick,
  onClearClick,
  allowEmptySearch = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const [hasSearched, setHasSearched] = useState(false);
  const moreFiltersButtonRef = useRef(null);
  const searchFormRef = useRef(null);

  // Use URL state from usePageFilters with dynamic search keys
  const { filters, setFilters, getApiParams, hasActiveFilters } = pageFilter;

  // Local state for form inputs (not synced to URL until Search is clicked)
  const [localParams, setLocalParams] = useState(() => {
    const initial = {};
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        initial[key] = filters[key] || '';
      });
    }
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key, defaultValue }) => {
        initial[key] = filters[key] || defaultValue || '';
      });
    }
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        initial[`${key}_start`] = filters[`${key}_start`] || '';
        initial[`${key}_end`] = filters[`${key}_end`] || '';
      });
    }
    if (secondaryTextSearchKeys) {
      secondaryTextSearchKeys.forEach((key) => {
        initial[key] = filters[key] || '';
      });
    }
    if (secondaryDropdownSearchKeys) {
      secondaryDropdownSearchKeys.forEach(({ key, defaultValue }) => {
        initial[key] = filters[key] || defaultValue || '';
      });
    }
    return initial;
  });

  const { regions, zones, woredas } = useFetchLocations();

  // Build search params from URL filters + additional params
  const searchParams = useMemo(() => {
    if (!hasActiveFilters && !allowEmptySearch && !hasSearched) {
      return null;
    }
    const apiParams = getApiParams();
    return {
      ...apiParams,
      ...(additionalParams || {}),
    };
  }, [
    getApiParams,
    additionalParams,
    hasActiveFilters,
    allowEmptySearch,
    hasSearched,
  ]);

  const allFields = useMemo(() => {
    const fields = [];
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) =>
        fields.push({ type: 'date', key, label: t(key) })
      );
    }
    if (textSearchKeys) {
      textSearchKeys.forEach((key) =>
        fields.push({ type: 'text', key, label: t(key) })
      );
    }
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach((config) =>
        fields.push({ type: 'dropdown', ...config })
      );
    }
    return fields;
  }, [dateSearchKeys, textSearchKeys, dropdownSearchKeys, t]);

  const primaryFields = allFields.slice(0, 4);
  const overflowFields = allFields.slice(4);

  const inputStyles = {
    width: '100%',
    maxWidth: '100%',
    minWidth: '0',
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        // Prevent form submission; let our handler run instead
        e.preventDefault();
        handleSearch(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localParams]
  );

  const renderField = (field) => {
    if (field.type === 'date') {
      const { key } = field;
      return (
        <div key={key} role="group" aria-label={t(key)}>
          <InputGroup className="rounded" style={inputStyles}>
            <EtCalendar
              calendarType={true}
              lang="en"
              dateRange={true}
              placeholder={t(key)}
              aria-label={t(key)}
              onChange={(dateRange) => {
                if (dateRange && dateRange.startDate && dateRange.endDate) {
                  const start = toYMDDateString(dateRange.startDate);
                  const end = toYMDDateString(dateRange.endDate);
                  handleSearchKey(`${key}_start`, start, 'date');
                  handleSearchKey(`${key}_end`, end, 'date');
                } else {
                  handleSearchKey(`${key}_start`, '', 'date');
                  handleSearchKey(`${key}_end`, '', 'date');
                }
              }}
              value={
                localParams[`${key}_start`] && localParams[`${key}_end`]
                  ? {
                      startDate: parseDateString(localParams[`${key}_start`]),
                      endDate: parseDateString(localParams[`${key}_end`]),
                    }
                  : null
              }
              style={inputStyles}
              primaryColor={'#0c5c35'}
            />
          </InputGroup>
        </div>
      );
    }

    if (field.type === 'text') {
      const { key } = field;
      return (
        <div key={key}>
          <Form.Control
            type="text"
            id={key}
            name={key}
            autoComplete="off"
            aria-label={t(key)}
            placeholder={t(key)}
            value={localParams[key] || ''}
            onKeyDown={handleKeyDown}
            onChange={(e) => handleSearchKey(key, e.target.value, 'text')}
            style={inputStyles}
          />
        </div>
      );
    }

    if (field.type === 'dropdown') {
      const { key, options, isLoading, isError, isDisabled } = field;
      return (
        <div key={key} style={{ minWidth: 0 }} aria-label={t(key)}>
          <AsyncSelectField
            fieldId={key}
            value={localParams[key] || ''}
            onChange={(value) => {
              handleSearchKey(key, value, 'text');
            }}
            optionMap={options || {}}
            onKeyDown={handleKeyDown}
            isLoading={!!isLoading}
            isError={!!isError}
            isDisabled={!!isDisabled}
            isRequired={false}
            showLabel={false}
            withCol={false}
          />
        </div>
      );
    }
    return null;
  };

  const {
    data = [],
    isFetching,
    refetch,
    isError,
    error,
  } = searchHook(searchParams);

  // Create a map of dependencies for cascading dropdowns
  const dependencyMap = useMemo(() => {
    if (!secondaryDropdownSearchKeys) return {};

    return secondaryDropdownSearchKeys.reduce((acc, { key, dependsOn }) => {
      if (dependsOn) {
        if (!acc[dependsOn]) {
          acc[dependsOn] = [];
        }
        acc[dependsOn].push(key);
      }
      return acc;
    }, {});
  }, [secondaryDropdownSearchKeys]);

  // Check if a dropdown should be disabled
  const isDropdownDisabled = (key, dependsOn) => {
    if (!dependsOn) return false;
    return !localParams[dependsOn] || localParams[dependsOn] === '';
  };

  // Clear dependent fields when parent changes
  const clearDependentFields = (parentKey) => {
    const dependentFields = dependencyMap[parentKey] || [];
    dependentFields.forEach((fieldKey) => {
      handleSearchKey(fieldKey, '', 'text', '');
    });
  };

  // Filter options for cascading dropdowns
  const getFilteredOptions = (options, parents, dependsOn) => {
    if (!parents || !dependsOn || !localParams[dependsOn]) {
      return options || {};
    }

    const parentValue = localParams[dependsOn];

    return Object.entries(options || {})
      .filter(([value]) => {
        const parentId = parents[value];
        return String(parentId) === String(parentValue);
      })
      .reduce((obj, [value, label]) => {
        obj[value] = label;
        return obj;
      }, {});
  };

  // Create initial values
  const createInitialValues = () => {
    const values = {};

    if (component_params) {
      Object.values(component_params).forEach((fieldName) => {
        values[fieldName] = '';
      });
    }

    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        values[key] = localParams[key] || '';
      });
    }

    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key, defaultValue }) => {
        values[key] = localParams[key] || defaultValue || '';
      });
    }

    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        values[`${key}_start`] = localParams[`${key}_start`] || '';
        values[`${key}_end`] = localParams[`${key}_end`] || '';
      });
    }

    if (secondaryTextSearchKeys) {
      secondaryTextSearchKeys.forEach((key) => {
        values[key] = localParams[key] || '';
      });
    }

    if (secondaryDropdownSearchKeys) {
      secondaryDropdownSearchKeys.forEach(({ key, defaultValue }) => {
        values[key] = localParams[key] || defaultValue || '';
      });
    }

    return values;
  };

  const validation = useFormik({
    initialValues: createInitialValues(),
    enableReinitialize: true,
  });

  // Handle updates for all input types
  const handleSearchKey = (key, value, type = 'text') => {
    validation.setFieldValue(key, value);

    setLocalParams((prevParams) => {
      if (type === 'checkbox') {
        const currentValues = prevParams[key] || [];
        const updatedValues = Array.isArray(currentValues)
          ? currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value]
          : [value];

        return { ...prevParams, [key]: updatedValues };
      }

      if (value === '') {
        const updatedParams = { ...prevParams };
        delete updatedParams[key];
        return updatedParams;
      }

      return { ...prevParams, [key]: value };
    });
  };

  const handleSearch = (resetToPageOne = false) => {
    setHasSearched(true);
    const allValues = validation.values;

    const transformedValues = Object.fromEntries(
      Object.entries(allValues).filter(
        //eslint-disable-next-line
        ([_key, value]) => value !== '' && value != null
      )
    );

    const urlUpdates = {};
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        urlUpdates[key] = transformedValues[key] || null;
      });
    }
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key }) => {
        urlUpdates[key] = transformedValues[key] || null;
      });
    }
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        urlUpdates[`${key}_start`] = transformedValues[`${key}_start`] || null;
        urlUpdates[`${key}_end`] = transformedValues[`${key}_end`] || null;
      });
    }
    if (secondaryTextSearchKeys) {
      secondaryTextSearchKeys.forEach((key) => {
        urlUpdates[key] = transformedValues[key] || null;
      });
    }
    if (secondaryDropdownSearchKeys) {
      secondaryDropdownSearchKeys.forEach(({ key }) => {
        urlUpdates[key] = transformedValues[key] || null;
      });
    }

    const treeSelectionValues = onSearchClick ? onSearchClick() : {};

    const finalUpdates = {
      ...treeSelectionValues,
      ...urlUpdates,
      page: resetToPageOne ? 1 : filters.page || 1,
      pageSize: filters.pageSize || 10,
    };

    setFilters(finalUpdates, { shallow: false });

    if (getSearchParams) {
      getSearchParams(searchParams);
    }
  };

  const prevSearchParamsRef = React.useRef(null);

  // Refetch whenever searchParams changes
  useEffect(() => {
    const searchParamsStr = searchParams ? JSON.stringify(searchParams) : null;

    if (prevSearchParamsRef.current === searchParamsStr) {
      return;
    }

    prevSearchParamsRef.current = searchParamsStr;

    // Build and emit labels
    if (searchParams && Object.keys(searchParams).length > 0) {
      const EXCLUDED_KEYS = new Set([
        'page',
        'per_page',
        'pageSize',
        'include',
      ]);

      const findLabel = (list, id) => {
        const match = list?.find((item) => String(item.id) === String(id));
        return match ? match.name : id;
      };

      const addressLabels = {
        ...(additionalParams?.prj_location_region_id && {
          prj_location_region_id: findLabel(
            regions,
            additionalParams.prj_location_region_id
          ),
        }),
        ...(additionalParams?.prj_location_zone_id && {
          prj_location_zone_id: findLabel(
            zones,
            additionalParams.prj_location_zone_id
          ),
        }),
        ...(additionalParams?.prj_location_woreda_id && {
          prj_location_woreda_id: findLabel(
            woredas,
            additionalParams.prj_location_woreda_id
          ),
        }),
      };

      const extraAdditionalLabels = {};
      if (additionalParams) {
        const handledKeys = new Set([
          'prj_location_region_id',
          'prj_location_zone_id',
          'prj_location_woreda_id',
        ]);
        Object.entries(additionalParams).forEach(([key, value]) => {
          if (
            !handledKeys.has(key) &&
            !EXCLUDED_KEYS.has(key) &&
            value != null &&
            value !== ''
          ) {
            const dropdownDef = dropdownSearchKeys?.find((d) => d.key === key);
            if (dropdownDef?.options) {
              extraAdditionalLabels[key] =
                dropdownDef.options[value] || String(value);
            } else {
              extraAdditionalLabels[key] = String(value);
            }
          }
        });
      }

      const urlParamLabels = {};
      if (textSearchKeys) {
        textSearchKeys.forEach((key) => {
          if (filters[key]) urlParamLabels[key] = filters[key];
        });
      }
      if (dropdownSearchKeys) {
        dropdownSearchKeys.forEach(({ key, options }) => {
          if (filters[key]) {
            urlParamLabels[key] = options?.[filters[key]] || filters[key];
          }
        });
      }
      if (dateSearchKeys) {
        dateSearchKeys.forEach((key) => {
          if (filters[`${key}_start`])
            urlParamLabels[`${key}_start`] = filters[`${key}_start`];
          if (filters[`${key}_end`])
            urlParamLabels[`${key}_end`] = filters[`${key}_end`];
        });
      }
      if (secondaryTextSearchKeys) {
        secondaryTextSearchKeys.forEach((key) => {
          if (filters[key]) urlParamLabels[key] = filters[key];
        });
      }
      if (secondaryDropdownSearchKeys) {
        secondaryDropdownSearchKeys.forEach(({ key, options }) => {
          if (filters[key]) {
            urlParamLabels[key] = options?.[filters[key]] || filters[key];
          }
        });
      }

      const combinedParamsLabels = {
        ...urlParamLabels,
        ...addressLabels,
        ...extraAdditionalLabels,
      };

      if (onSearchLabels && Object.keys(combinedParamsLabels).length > 0) {
        onSearchLabels(combinedParamsLabels);
      }
    }

    const fetchData = async () => {
      try {
        if (setIsSearchLoading) setIsSearchLoading(true);
        const result = await refetch();
        const { data, error } = result;
        if (onSearchResult) onSearchResult({ data, error });
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        if (setIsSearchLoading) setIsSearchLoading(false);
      }
    };

    if (searchParams && Object.keys(searchParams).length > 0) {
      fetchData();
    }
  }, [
    searchParams,
    refetch,
    onSearchResult,
    setIsSearchLoading,
    additionalParams,
    dateSearchKeys,
    dropdownSearchKeys,
    secondaryDropdownSearchKeys,
    filters,
    onSearchLabels,
    regions,
    textSearchKeys,
    secondaryTextSearchKeys,
    woredas,
    zones,
  ]);

  // Sync local params with URL state
  useEffect(() => {
    const updatedLocalParams = { ...localParams };
    let hasChanges = false;

    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        const urlValue = filters[key] || '';
        if (updatedLocalParams[key] !== urlValue) {
          updatedLocalParams[key] = urlValue;
          hasChanges = true;
        }
      });
    }

    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key }) => {
        const urlValue = filters[key] || '';
        if (updatedLocalParams[key] !== urlValue) {
          updatedLocalParams[key] = urlValue;
          hasChanges = true;
        }
      });
    }

    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        const startValue = filters[`${key}_start`] || '';
        const endValue = filters[`${key}_end`] || '';
        if (
          updatedLocalParams[`${key}_start`] !== startValue ||
          updatedLocalParams[`${key}_end`] !== endValue
        ) {
          updatedLocalParams[`${key}_start`] = startValue;
          updatedLocalParams[`${key}_end`] = endValue;
          hasChanges = true;
        }
      });
    }

    if (secondaryTextSearchKeys) {
      secondaryTextSearchKeys.forEach((key) => {
        const urlValue = filters[key] || '';
        if (updatedLocalParams[key] !== urlValue) {
          updatedLocalParams[key] = urlValue;
          hasChanges = true;
        }
      });
    }

    if (secondaryDropdownSearchKeys) {
      secondaryDropdownSearchKeys.forEach(({ key }) => {
        const urlValue = filters[key] || '';
        if (updatedLocalParams[key] !== urlValue) {
          updatedLocalParams[key] = urlValue;
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      setLocalParams(updatedLocalParams);
    }
    // Depend on filters object and search key configs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters,
    textSearchKeys,
    dropdownSearchKeys,
    dateSearchKeys,
    secondaryTextSearchKeys,
    secondaryDropdownSearchKeys,
  ]);

  const handleClear = () => {
    setHasSearched(false);
    const clearedLocalParams = {};
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        clearedLocalParams[key] = '';
      });
    }
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key }) => {
        clearedLocalParams[key] = '';
      });
    }
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        clearedLocalParams[`${key}_start`] = '';
        clearedLocalParams[`${key}_end`] = '';
      });
    }
    if (secondaryTextSearchKeys) {
      secondaryTextSearchKeys.forEach((key) => {
        clearedLocalParams[key] = '';
      });
    }
    if (secondaryDropdownSearchKeys) {
      secondaryDropdownSearchKeys.forEach(({ key }) => {
        clearedLocalParams[key] = '';
      });
    }
    setLocalParams(clearedLocalParams);

    if (onClearClick) {
      onClearClick();
    }

    const clearedFilters = {
      regionId: null,
      zoneId: null,
      woredaId: null,
      include: 0,
      page: 1,
    };
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        clearedFilters[key] = null;
      });
    }
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key }) => {
        clearedFilters[key] = null;
      });
    }
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        clearedFilters[`${key}_start`] = null;
        clearedFilters[`${key}_end`] = null;
      });
    }
    if (secondaryTextSearchKeys) {
      secondaryTextSearchKeys.forEach((key) => {
        clearedFilters[key] = null;
      });
    }
    if (secondaryDropdownSearchKeys) {
      secondaryDropdownSearchKeys.forEach(({ key }) => {
        clearedFilters[key] = null;
      });
    }
    setFilters(clearedFilters, { shallow: false });

    if (setSearchResults) setSearchResults(null);
    if (setShowSearchResult) setShowSearchResult(false);
    validation.resetForm();

    if (setAdditionalParams) {
      setAdditionalParams({});
    }
    if (setExportSearchParams) {
      setExportSearchParams({});
    }

    if (setPaginationInfo) {
      setPaginationInfo({
        current_page: 1,
        per_page: 10,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      });
    }
    if (onClear) {
      onClear();
    }
  };

  useImperativeHandle(ref, () => ({
    refreshSearch: async () => refetch(),
    searchWithCurrentPagination: () => handleSearch(false),
  }));

  const hasMoreFilters =
    checkboxSearchKeys?.length > 0 ||
    secondaryDropdownSearchKeys?.length > 0 ||
    secondaryTextSearchKeys?.length > 0 ||
    overflowFields.length > 0 ||
    Component;

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <Card className="p-0 m-0 mb-3 shadow-sm border-0">
        <CardBody className="py-2 px-4">
          <form
            role="search"
            aria-label={t('srch_advanced_search') || 'Advanced search'}
            ref={searchFormRef}
            onKeyDown={handleKeyDown}
            /* Prevent native HTML form submission entirely */
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(true);
            }}
          >
            <Row
              xxl={12}
              lg={12}
              className="pt-1 d-flex flex-row flex-wrap justify-content-start align-items-center gap-3"
            >
              <Row xxl={12} lg={12}>
                <Col xxl={10} lg={10}>
                  <div
                    className="d-grid gap-2 mb-1"
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '1.25rem',
                    }}
                  >
                    {primaryFields.map(renderField)}
                  </div>
                </Col>
                <Col
                  xxl={2}
                  lg={2}
                  md={2}
                  sm={12}
                  className="d-flex flex-row flex-wrap justify-content-center align-items-start gap-1"
                >
                  <div
                    id="search-icon-wrapper"
                    className=" flex-grow-1 mb-1"
                    style={{ display: 'flex' }}
                  >
                    <span className="d-inline-block h-100 w-100">
                      <button
                        data-tooltip={t('srch_search')}
                        id="search-icon"
                        type="button"
                        className="btn btn-primary h-100 w-100 p-2"
                        onClick={() => handleSearch(true)}
                        aria-label={t('srch_search') || 'Search'}
                        title={t('srch_search') || 'Search'}
                      >
                        <FaSearch aria-hidden="true" className="align-middle" />
                      </button>
                    </span>
                  </div>
                  <div className=" flex-grow-1 mb-1">
                    <button
                      type="button"
                      className="btn btn-outline-danger align-middle h-100 w-100 p-2"
                      onClick={handleClear}
                      id="clear-button"
                      data-tooltip={t('srch_clear')}
                      aria-label={t('srch_clear') || 'Clear search'}
                      title={t('srch_clear') || 'Clear search'}
                    >
                      <FaTimes aria-hidden="true" className="align-middle" />
                    </button>
                  </div>

                  {hasMoreFilters && (
                    <div className=" flex-grow-1 mb-1">
                      <button
                        type="button"
                        id="more-filter-icon"
                        ref={moreFiltersButtonRef}
                        onClick={toggle}
                        className="btn btn-secondary h-100 w-100 p-2"
                        data-tooltip={t('srch_more_filters')}
                        aria-label={
                          isOpen
                            ? t('srch_hide_filters') ||
                              'Hide additional filters'
                            : t('srch_more_filters') || 'More filters'
                        }
                        title={
                          isOpen
                            ? t('srch_hide_filters') || 'Hide filters'
                            : t('srch_more_filters') || 'More filters'
                        }
                        aria-expanded={isOpen}
                        aria-controls="advanced-search-extra-filters"
                      >
                        <FaFilter aria-hidden="true" className="align-middle" />
                      </button>
                    </div>
                  )}
                </Col>
              </Row>

              <Collapse in={isOpen} className="w-100">
                <div
                  id="advanced-search-extra-filters"
                  role="group"
                  aria-label={
                    t('srch_additional_filters') || 'Additional filters'
                  }
                >
                  {Component && validation && (
                    <Row className="mb-2">
                      <Col>
                        <Component
                          {...component_params}
                          validation={validation}
                          isEdit={false}
                        />
                      </Col>
                    </Row>
                  )}
                  {Component && (
                    <hr className="my-2" style={{ opacity: 0.1 }} />
                  )}
                  <Row className="pt-1">
                    <Col xs={12}>
                      <div
                        className="d-grid gap-2 mb-1"
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fill, minmax(220px, 1fr))',
                          gap: '1.25rem',
                        }}
                      >
                        {overflowFields.map(renderField)}

                        {secondaryTextSearchKeys &&
                          secondaryTextSearchKeys.map((key) => (
                            <div key={key}>
                              <Form.Control
                                type="text"
                                id={key}
                                name={key}
                                autoComplete="off"
                                aria-label={t(key)}
                                placeholder={t(key)}
                                value={localParams[key] || ''}
                                onChange={(e) =>
                                  handleSearchKey(
                                    key,
                                    e.target.value,
                                    'text',
                                    e.target.value
                                  )
                                }
                                onKeyDown={handleKeyDown}
                                style={inputStyles}
                              />
                            </div>
                          ))}

                        {secondaryDropdownSearchKeys &&
                          secondaryDropdownSearchKeys.map(
                            ({
                              key,
                              options,
                              parents,
                              dependsOn,
                              isLoading,
                              isError,
                              isDisabled: dropdownDisabled,
                            }) => {
                              const dependencyDisabled = isDropdownDisabled(
                                key,
                                dependsOn
                              );
                              const filteredOptions = getFilteredOptions(
                                options,
                                parents,
                                dependsOn
                              );

                              return (
                                <div key={key} style={{ minWidth: 0 }}>
                                  <AsyncSelectField
                                    fieldId={key}
                                    value={localParams[key] || ''}
                                    onChange={(value) => {
                                      // Clear any fields that depend on this one
                                      clearDependentFields(key);
                                      handleSearchKey(
                                        key,
                                        value,
                                        'text',
                                        value
                                      );
                                    }}
                                    onKeyDown={handleKeyDown}
                                    aria-label={t(key)}
                                    optionMap={filteredOptions}
                                    isLoading={!!isLoading}
                                    isError={!!isError}
                                    isDisabled={
                                      dependencyDisabled || !!dropdownDisabled
                                    }
                                    isRequired={false}
                                    showLabel={false}
                                    withCol={false}
                                  />
                                </div>
                              );
                            }
                          )}
                      </div>
                    </Col>

                    {checkboxSearchKeys &&
                      checkboxSearchKeys.map(({ key, options }) => (
                        <Col key={key} xxl={4} lg={6}>
                          <Form.Label className="fw-semibold">
                            {t(key)}
                          </Form.Label>

                          {(options || []).map((item, index) => (
                            <Form.Check
                              inline
                              key={index}
                              type="checkbox"
                              id={`${key}-checkbox-${index}`}
                              label={item.label}
                              value={item.value}
                              checked={(localParams[key] || []).includes(
                                item.value
                              )}
                              onChange={(e) =>
                                handleSearchKey(
                                  key,
                                  e.target.checked ? item.value : null,
                                  'checkbox',
                                  item.label
                                )
                              }
                            />
                          ))}
                        </Col>
                      ))}
                  </Row>
                </div>
              </Collapse>
            </Row>
          </form>
        </CardBody>
      </Card>
      <div>
        {typeof children === 'function' && children
          ? children({ result: data, isLoading: isFetching })
          : children
            ? React.cloneElement(children, {
                result: data,
                isLoading: isFetching,
              })
            : null}
      </div>
    </React.Fragment>
  );
};

export default AdvancedSearch;
