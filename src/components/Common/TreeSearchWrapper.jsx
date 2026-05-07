import React, { useState, useEffect, useMemo, useCallback } from 'react';

import AdvancedSearch from './AdvancedSearch';
import TreeForLists from './TreeForLists';

export default function TreeSearchWrapper({
  children,
  searchHook,
  pageFilter,
  searchConfig,
  Component,
  component_params = {},
  setExportSearchParams,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { filters } = pageFilter;

  // Local tree state (NOT synced to URL until Search is clicked)
  const [localTreeSelection, setLocalTreeSelection] = useState({
    regionId: filters.regionId,
    zoneId: filters.zoneId,
    woredaId: filters.woredaId,
    include: filters.include,
  });

  // Sync tree UI when URL changes (back/forward, deep links)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalTreeSelection((prev) => {
      const next = {
        regionId: filters.regionId,
        zoneId: filters.zoneId,
        woredaId: filters.woredaId,
        include: filters.include,
      };

      // shallow compare — no update if nothing changed
      if (
        prev.regionId === next.regionId &&
        prev.zoneId === next.zoneId &&
        prev.woredaId === next.woredaId &&
        prev.include === next.include
      ) {
        return prev;
      }

      return next;
    });
  }, [filters.regionId, filters.zoneId, filters.woredaId, filters.include]);

  // API params derived from URL filters
  const projectParams = useMemo(
    () => ({
      ...(filters.regionId && {
        prj_location_region_id: filters.regionId,
      }),
      ...(filters.zoneId && {
        prj_location_zone_id: filters.zoneId,
      }),
      ...(filters.woredaId && {
        prj_location_woreda_id: filters.woredaId,
      }),
      ...(filters.include === 1 && { include: 1 }),
    }),
    [filters]
  );

  // Tree handlers (functional updates = safe)
  const handleNodeSelect = useCallback((node) => {
    setLocalTreeSelection((prev) => {
      if (node.level === 'region') {
        return {
          regionId: node.id,
          zoneId: null,
          woredaId: null,
          include: prev.include,
        };
      }

      if (node.level === 'zone') {
        return {
          ...prev,
          zoneId: node.id,
          woredaId: null,
        };
      }

      if (node.level === 'woreda') {
        return {
          ...prev,
          woredaId: node.id,
        };
      }

      return prev;
    });
  }, []);

  const handleIncludeChange = useCallback((include) => {
    setLocalTreeSelection((prev) => ({
      ...prev,
      include: include ? 1 : 0,
    }));
  }, []);

  // Passed to AdvancedSearch → merged into URL on Search click
  const getTreeSelectionValues = useCallback(
    () => ({
      regionId: localTreeSelection.regionId,
      zoneId: localTreeSelection.zoneId,
      woredaId: localTreeSelection.woredaId,
      include: localTreeSelection.include,
    }),
    [localTreeSelection]
  );

  const clearTreeSelection = useCallback(() => {
    setLocalTreeSelection({
      regionId: null,
      zoneId: null,
      woredaId: null,
      include: 0,
    });
  }, []);

  return (
    <div className="w-100 d-flex gap-2">
      <TreeForLists
        onNodeSelect={handleNodeSelect}
        setInclude={handleIncludeChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeRegionId={localTreeSelection.regionId}
        activeZoneId={localTreeSelection.zoneId}
        activeWoredaId={localTreeSelection.woredaId}
        include={localTreeSelection.include}
      />

      <div
        style={{
          flex: isCollapsed ? '1 1 auto' : '0 0 80%',
          minWidth: 0,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <AdvancedSearch
          searchHook={searchHook}
          pageFilter={pageFilter}
          textSearchKeys={searchConfig.textSearchKeys}
          dropdownSearchKeys={searchConfig.dropdownSearchKeys}
          checkboxSearchKeys={searchConfig.checkboxSearchKeys}
          dateSearchKeys={searchConfig.dateSearchKeys}
          secondaryTextSearchKeys={searchConfig.secondaryTextSearchKeys}
          secondaryDropdownSearchKeys={searchConfig.secondaryDropdownSearchKeys}
          Component={Component}
          component_params={component_params}
          additionalParams={projectParams}
          onSearchClick={getTreeSelectionValues}
          onClearClick={clearTreeSelection}
          treeSelection={localTreeSelection}
          onSearchLabels={setExportSearchParams}
        >
          {children}
        </AdvancedSearch>
      </div>
    </div>
  );
}
