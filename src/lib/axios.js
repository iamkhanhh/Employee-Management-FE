import axios from "axios";
import { apiUrl } from "./utils";

export const axiosInstance = axios.create({
	baseURL: apiUrl.baseURL,
	withCredentials: true,
});