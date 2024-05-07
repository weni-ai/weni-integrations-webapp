import request from './request';

const resource = '/api/v1';
<<<<<<< HEAD
=======
async function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
export default {
  getFlowToken() {
    return request.$http.get(`${resource}/internal/user-api-token`);
  },
<<<<<<< HEAD
=======
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
>>>>>>> 2b3650211d3352b076cdf8f0ba61d30be889da5b
};
