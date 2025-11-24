import axios from "axios";

const API = axios.create({
  baseURL: "https://sp-finalproject-assessment-bd.onrender.com", // your backend
});

export default API;
