// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export class ScenarioDTO {
  constructor(
    id,
    name,
    state,
    csmSimulationRun,
    masterId,
    parentId,
    ownerId,
    solutionId,
    visibleScenariosIds,
    visibleScenariosSimulationRunsIds,
    visibleScenariosCsmSimulationRunsIds,
    lastRunId
  ) {
    this.id = id;
    this.name = name;
    this.state = state;
    this.csmSimulationRun = csmSimulationRun;
    this.masterId = masterId === null ? id : masterId;
    this.parentId = parentId;
    this.ownerId = ownerId;
    this.solutionId = solutionId;
    this.visibleScenariosIds = visibleScenariosIds;
    this.visibleScenariosSimulationRunsIds = visibleScenariosSimulationRunsIds;
    this.visibleScenariosCsmSimulationRunsIds = visibleScenariosCsmSimulationRunsIds;
    this.lastRunId = lastRunId;
  }
}
