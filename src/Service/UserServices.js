import requests from "../api";

const UserServices = {
  createUser: async (body) => {
    return requests.post("/user/create", body);
  },

  getAllUser: async () => {
    return requests.get("/user/list");
  },

  deleteUser: async (id) => {
    return requests.get(`/user/${id}/delete`);
  },
};

export default UserServices;
