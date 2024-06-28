import requests from "../api";
import request from "./formApi"

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
  createForm: async (body) => {
    return request.post("/api/temp-form-save-by-user", body);
  },
  formList: async (body) => {
    return request.get(`/api/temp-form-type-list`);
  },
  deleteForm: async (id) => {
    return request.get(`/api/temp-form-type/${id}/delete`);
  },

};

export default UserGroupServices;
