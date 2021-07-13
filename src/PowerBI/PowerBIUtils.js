// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { PowerBIReportEmbedSimpleFilter, PowerBIReportEmbedMultipleFilter } from './PowerBIReportEmbedFilter';
import { ScenarioDTO } from "./ScenarioDTO";

function constructDynamicValue (filterValue, objectToFilter) {
  if (filterValue === undefined) {
    throw new Error('value path is undefined');
  }
  const res = filterValue.split('.').reduce(function (o, k) {
    return o && o[k];
  }, objectToFilter);
  if (res === undefined) {
    console.log(filterValue + ' is not a valid path!!! Please adapt the configuration');
  }
  return res;
}

const constructDynamicFilters = (filtersConfig, objectToFilter) => {
  const result = [];
  for (const filterConfig of filtersConfig) {
    const filterValues = filterConfig.values;
    let filter;
    if (Array.isArray(filterValues)) {
      const values = [];
      for (const filterValue of filterValues) {
        const value = constructDynamicValue(filterValue, objectToFilter, filterConfig);
        if(value !== undefined){
          values.push(value);
        }
      }
      if(values.length !== 0){
        filter = new PowerBIReportEmbedMultipleFilter(filterConfig.target.table, filterConfig.target.column, values);
        result.push(filter);
      }
    } else if (typeof filterValues === 'string') {
      const filterValue = filterConfig.values;
      const value = constructDynamicValue(filterValue, objectToFilter, filterConfig);
      if(value !== undefined){
        filter = new PowerBIReportEmbedSimpleFilter(filterConfig.target.table, filterConfig.target.column, [value]);
        result.push(filter);
      }
    }
  }
  return result;
};

const constructScenarioDTO = (scenario) => {
  let result;
  let csmSimRun = scenario?.lastRun?.csmSimulationRun === undefined
    ? null
    : scenario?.lastRun?.csmSimulationRun;
  if (scenario !== undefined) {
    result = new ScenarioDTO(scenario.id,
      scenario.name,
      scenario.state,
      csmSimRun,
      scenario.rootId,
      scenario.parentId,
      scenario.ownerId,
      scenario.solutionId)
  }
  return result;
}


export const PowerBIUtils = {
  constructDynamicFilters,
  constructScenarioDTO
};