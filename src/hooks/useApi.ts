import { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiConfig, Method } from "../types/useApi";

const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT;
const defaultHeaders = {
  Authorization: import.meta.env.VITE_ENDPOINT_TOKEN,
  "Content-Type": "application/json",
};

export const useApi = () => {
  const [data, setData] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError | null | unknown>();
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the API
  const fetchData = async (
    method: Method,
    params: Record<string, string | boolean | number> = {},
    data: string = ""
  ) => {
    try {
      setLoading(true);
      setError(null);

      const config: ApiConfig = {
        method,
        url: apiUrl,
        headers: defaultHeaders,
      };
      
      // Handle request parameters based on the HTTP method
      if (method === "GET") {
        config.params = { ...params };
      } else if (method === "PUT") {
        config.data = data;
      }
      const response = await axios(config);

      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};
