import axios from "../api/axios"; // axios with interceptor

export const getUsers = () =>
  axios.get("/admin/users");

export const approveUser = (id) =>
  axios.put(`/admin/users/${id}/approve`);

export const lockUser = (id) =>
  axios.put(`/admin/users/${id}/lock`);

export const increaseBalance = (id, amount) =>
  axios.put(`/admin/users/${id}/balance`, { amount });
