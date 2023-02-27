import axios from "axios";
import { BASE_URL } from "../config";

export const baseApi = axios.create({ baseURL: BASE_URL })