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

const constructDynamicFilters = (filtersConfig, objectToFilter) => {
  const result = [];
  if (!objectToFilter || !filtersConfig) {
    return result;
  }

  for (const filterConfig of filtersConfig) {
    const filterValues = filterConfig.values;
    let filter;
    if (Array.isArray(filterValues)) {
      const values = [];
      for (const filterValue of filterValues) {
        const value = constructDynamicValue(filterValue, objectToFilter, filterConfig);
        if (value !== undefined) {
          // Value constructed dynamically can be an array of values (e.g. for the list of visible scenarios): use
          // spread operator here to add each of these values to the "values" array
          if (Array.isArray(value)) {
            values.push(...value);
          } else {
            values.push(value);
          }
        }
      }
      if (values.length !== 0) {
        filter = new PowerBIReportEmbedMultipleFilter(filterConfig.target.table, filterConfig.target.column, values);
        result.push(filter);
      }
    } else if (typeof filterValues === 'string') {
      const filterValue = filterConfig.values;
      const value = constructDynamicValue(filterValue, objectToFilter, filterConfig);
      if (value !== undefined) {
        filter = new PowerBIReportEmbedSimpleFilter(filterConfig.target.table, filterConfig.target.column, [value]);
        result.push(filter);
      }
    }
  }
  return result;
};

const constructScenarioDTO = (targetScenario, visibleScenarios) => {
  const visibleScenariosIds = visibleScenarios?.map((scenario) => scenario.id);
  const visibleScenariosSimulationRunsIds = visibleScenarios
    ?.map((scenario) => scenario.runId)
    .filter((item) => item != null);
  const visibleScenariosCsmSimulationRunsIds = visibleScenarios
    ?.map((scenario) => scenario.csmSimulationRun)
    .filter((item) => item != null);

  const NO_SCENARIO_VALUE = ['None'];
  return new ScenarioDTO(
    targetScenario?.id,
    targetScenario?.name,
    targetScenario?.state,
    targetScenario?.lastRunId ?? null, // Since API v3.2, csmSimulationRun is equivalent to lastRunId
    targetScenario?.rootId,
    targetScenario?.parentId,
    targetScenario?.ownerId,
    targetScenario?.solutionId,
    visibleScenariosIds.length === 0 ? NO_SCENARIO_VALUE : visibleScenariosIds,
    visibleScenariosSimulationRunsIds.length === 0 ? NO_SCENARIO_VALUE : visibleScenariosSimulationRunsIds,
    visibleScenariosCsmSimulationRunsIds.length === 0 ? NO_SCENARIO_VALUE : visibleScenariosCsmSimulationRunsIds,
    targetScenario?.lastRunId ?? null
  );
};

export const PowerBIUtils = {
  constructDynamicFilters,
  constructScenarioDTO,
};
