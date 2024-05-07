import request from './request';

const resource = '/api/v1';
async function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
export default {
  getFlowToken() {
    return request.$http.get(`${resource}/internal/user-api-token`);
  },
  getProject({ uuid }) {
    return request.$http().get(`/v1/organization/project/${uuid}/`);
  },
  async getFlowOrganization(projectUuid) {
    const { data: project } = await this.getProject({ uuid: projectUuid });

    if (project.organization) {
      return project.organization;
    } else {
      sleep(3);
      return await this.getFlowOrganization(projectUuid);
    }
  },
};
