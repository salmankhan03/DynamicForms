import requests from "../api";

const UserGroupServices = {
  createUserGroup: async (body) => {
    return requests.post("/role/create", body);
  },

  getAllUserGroup: async () => {
    return requests.get("/role/list");
  },

  deleteUserGroup: async (id) => {
    return requests.get(`/role/${id}/delete`);
  },

  userTree: async (id) => {
    return requests.get(`/role/list`);
  },
  permission: async (id) => {
    return requests.get(`/permission/list`);
  },
  addPermission: async (body) => {
    return requests.post(`/role/sync`, body);
  },
};

export default UserGroupServices;
