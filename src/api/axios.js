import axios from "axios";

const API = axios.create({
  baseURL: "https://sp-finalproject-assessment-bd.onrender.com/api",
});

export default API;
