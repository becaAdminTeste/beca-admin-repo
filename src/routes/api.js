// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.obeca.com.br",
});

export default api;
