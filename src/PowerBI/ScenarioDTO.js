// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export class ScenarioDTO {
  constructor(
    id,
    name,
    lastRunId,
    lastRunStatus,
    rootId,
    parentId,
    ownerId,
    solutionId,
    visibleScenariosIds,
    visibleScenariosLastRunIds
  ) {
    this.id = id;
    this.name = name;
    this.lastRunId = lastRunId;
    this.lastRunStatus = lastRunStatus;
    this.rootId = rootId === null ? id : rootId;
    this.parentId = parentId;
    this.ownerId = ownerId;
    this.solutionId = solutionId;
    this.visibleScenariosIds = visibleScenariosIds;
    this.visibleScenariosLastRunIds = visibleScenariosLastRunIds;
  }
}
