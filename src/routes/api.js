// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://beca-api.onrender.com" /*   "http://localhost:3030" */,
});

export default api;
