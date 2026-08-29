import { BaseApiClient } from './base-client'

/** Completed and ongoing projects. */
class ProjectsApiClient extends BaseApiClient {
  /** @param {{page?: number, page_size?: number, status?: string}} [params] */
  getProjects(params, options) {
    return this.get('/projects', params, options)
  }

  getProject(slug, options) {
    return this.get(`/projects/${slug}`, undefined, options)
  }
}

export const projectsApi = new ProjectsApiClient()
