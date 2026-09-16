import api from "./axios.js";

export const createUser = async (data) => {
  try {
    const response = await api.post("/users", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.message);
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.message);
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post("/users/login", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.message);
  }
};

export const userLogout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.message);
  }
};
