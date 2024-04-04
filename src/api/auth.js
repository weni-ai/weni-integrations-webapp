import request from './request';

const resource = '/api/v1';
export default {
  getFlowToken() {
    return request.$http.get(`${resource}/internal/user-api-token`);
  },
  async getFlowOrganization(projectUuid) {
    const { data: project } = await projects.getProject({ uuid: projectUuid });

    if (project.flow_organization) {
      return project.flow_organization;
    } else {
      sleep(3);

      return await getFlowOrganization(projectUuid);
    }
  }
}
