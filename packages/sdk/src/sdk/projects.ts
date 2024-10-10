/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { projectsCreate } from "../funcs/projectsCreate.js";
import { projectsDelete } from "../funcs/projectsDelete.js";
import { projectsGetAll } from "../funcs/projectsGetAll.js";
import { projectsPause } from "../funcs/projectsPause.js";
import { projectsUnpause } from "../funcs/projectsUnpause.js";
import { projectsUpdate } from "../funcs/projectsUpdate.js";
import { projectsUpdateDataCache } from "../funcs/projectsUpdateDataCache.js";
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import {
  CreateProjectRequest,
  CreateProjectResponseBody,
} from "../models/operations/createproject.js";
import { DeleteProjectRequest } from "../models/operations/deleteproject.js";
import {
  GetProjectsRequest,
  GetProjectsResponse,
} from "../models/operations/getprojects.js";
import { PauseProjectRequest } from "../models/operations/pauseproject.js";
import { UnpauseProjectRequest } from "../models/operations/unpauseproject.js";
import {
  UpdateProjectRequest,
  UpdateProjectResponseBody,
} from "../models/operations/updateproject.js";
import {
  UpdateProjectDataCacheRequest,
  UpdateProjectDataCacheResponseBody,
} from "../models/operations/updateprojectdatacache.js";
import { unwrapAsync } from "../types/fp.js";
import { PageIterator, unwrapResultIterator } from "../types/operations.js";

export class Projects extends ClientSDK {
  /**
   * Update the data cache feature
   *
   * @remarks
   * Update the data cache feature on a project.
   */
  async updateDataCache(
    request: UpdateProjectDataCacheRequest,
    options?: RequestOptions,
  ): Promise<UpdateProjectDataCacheResponseBody> {
    return unwrapAsync(projectsUpdateDataCache(
      this,
      request,
      options,
    ));
  }

  /**
   * Retrieve a list of projects
   *
   * @remarks
   * Allows to retrieve the list of projects of the authenticated user or team. The list will be paginated and the provided query parameters allow filtering the returned projects.
   */
  async getAll(
    request: GetProjectsRequest,
    options?: RequestOptions,
  ): Promise<PageIterator<GetProjectsResponse>> {
    return unwrapResultIterator(projectsGetAll(
      this,
      request,
      options,
    ));
  }

  /**
   * Create a new project
   *
   * @remarks
   * Allows to create a new project with the provided configuration. It only requires the project `name` but more configuration can be provided to override the defaults.
   */
  async create(
    request: CreateProjectRequest,
    options?: RequestOptions,
  ): Promise<CreateProjectResponseBody> {
    return unwrapAsync(projectsCreate(
      this,
      request,
      options,
    ));
  }

  /**
   * Update an existing project
   *
   * @remarks
   * Update the fields of a project using either its `name` or `id`.
   */
  async update(
    request: UpdateProjectRequest,
    options?: RequestOptions,
  ): Promise<UpdateProjectResponseBody> {
    return unwrapAsync(projectsUpdate(
      this,
      request,
      options,
    ));
  }

  /**
   * Delete a Project
   *
   * @remarks
   * Delete a specific project by passing either the project `id` or `name` in the URL.
   */
  async delete(
    request: DeleteProjectRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return unwrapAsync(projectsDelete(
      this,
      request,
      options,
    ));
  }

  /**
   * Pause a project
   *
   * @remarks
   * Pause a project by passing its project `id` in the URL. If the project does not exist given the id then the request will fail with 400 status code. If the project disables auto assigning custom production domains and blocks the active Production Deployment then the request will return with 200 status code.
   */
  async pause(
    request: PauseProjectRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return unwrapAsync(projectsPause(
      this,
      request,
      options,
    ));
  }

  /**
   * Unpause a project
   *
   * @remarks
   * Unpause a project by passing its project `id` in the URL. If the project does not exist given the id then the request will fail with 400 status code. If the project enables auto assigning custom production domains and unblocks the active Production Deployment then the request will return with 200 status code.
   */
  async unpause(
    request: UnpauseProjectRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return unwrapAsync(projectsUnpause(
      this,
      request,
      options,
    ));
  }
}
