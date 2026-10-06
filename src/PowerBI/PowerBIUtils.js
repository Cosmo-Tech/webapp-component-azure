// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { PowerBIReportEmbedSimpleFilter, PowerBIReportEmbedMultipleFilter } from './PowerBIReportEmbedFilter';
import { ScenarioDTO } from './ScenarioDTO';

function constructDynamicValue(filterValue, objectToFilter) {
  if (filterValue === undefined) {
    throw new Error('value path is undefined');
  }
  const res = filterValue.split('.').reduce(function (o, k) {
    return o && o[k];
  }, objectToFilter);
  if (res === undefined) {
    console.warn(`"${filterValue}" is not a valid path. Please adapt the configuration`);
  }
  return res;
}

const constructDynamicFilter = (filterConfig, objectToFilter) => {
  const { values: filterValues, target } = filterConfig;

  if (Array.isArray(filterValues)) {
    // Value constructed dynamically can be an array of values (e.g. for the list of visible scenarios): use
    // flatMap here to flatten the resulting array
    const values = filterValues.flatMap((filterValue) => {
      const value = constructDynamicValue(filterValue, objectToFilter);
      if (value === undefined) return []; // Will be filtered out by flatMap
      return Array.isArray(value) ? value : [value];
    });
    return values.length === 0 ? undefined : new PowerBIReportEmbedMultipleFilter(target.table, target.column, values);
  }

  if (typeof filterValues !== 'string') return undefined;

  const value = constructDynamicValue(filterValues, objectToFilter);
  return value === undefined ? undefined : new PowerBIReportEmbedSimpleFilter(target.table, target.column, [value]);
};

const constructDynamicFilters = (filtersConfig, objectToFilter) => {
  if (!objectToFilter || !filtersConfig) return [];

  return filtersConfig.map((filterConfig) => constructDynamicFilter(filterConfig, objectToFilter)).filter(Boolean);
};

const constructScenarioDTO = (targetScenario, visibleScenarios) => {
  const visibleScenariosIds = visibleScenarios?.map((scenario) => scenario.id) ?? [];
  const visibleScenariosLastRunIds =
    visibleScenarios?.map((scenario) => scenario?.lastRunInfo?.lastRunId).filter((item) => item != null) ?? [];

  const NO_SCENARIO_VALUE = ['None'];
  return new ScenarioDTO(
    targetScenario?.id,
    targetScenario?.name,
    targetScenario?.lastRunInfo?.lastRunId ?? null,
    targetScenario?.lastRunInfo?.lastRunStatus,
    targetScenario?.rootId,
    targetScenario?.parentId,
    targetScenario?.createInfo?.userId,
    targetScenario?.solutionId,
    visibleScenariosIds.length === 0 ? NO_SCENARIO_VALUE : visibleScenariosIds,
    visibleScenariosLastRunIds.length === 0 ? NO_SCENARIO_VALUE : visibleScenariosLastRunIds
  );
};

export const PowerBIUtils = {
  constructDynamicFilters,
  constructScenarioDTO,
};
