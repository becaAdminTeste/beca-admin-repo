// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://beca-api.onrender.com",
});

export default api;
