import axios from "../api/axios"; // axios with interceptor

export const getUsers = () =>
  axios.get("/api/admin/users");

export const approveUser = (id) =>
  axios.put(`/api/admin/users/${id}/approve`);

export const lockUser = (id) =>
  axios.put(`/api/admin/users/${id}/lock`);

export const increaseBalance = (id, amount) =>
  axios.put(`/api/admin/users/${id}/balance`, { amount });
