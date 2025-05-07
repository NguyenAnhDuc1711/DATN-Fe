import axios, { AxiosError } from "axios";
export const serverUrl: string = "http://localhost:4000";

interface ApiOptions {
  path: string;
  params?: Record<string, any>;
  payload?: Record<string, any>;
  showToast?: (title: string, message: string, type: string) => void;
}

export const GET = async ({ path, params, showToast }: ApiOptions) => {
  try {
    const url = serverUrl + "/api" + path;
    let result = null;
    if (params) {
      result = (
        await axios.get(url, {
          params: params,
        })
      )?.data;
    } else {
      result = (await axios.get(url))?.data;
    }
    return result;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (showToast && err.response?.data) {
        const errorMsg = err.response.data;
        showToast("", errorMsg, "error");
      } else {
        throw new Error(err.response?.data);
      }
    }
    return undefined;
  }
};

export const POST = async ({ path, payload, params }: ApiOptions) => {
  try {
    const url = serverUrl + "/api" + path;
    const { data } = await axios.post(url, payload, { params });
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const errorResponse = err.response?.data || {
        errorType: "UNKNOWN_ERROR",
        error: "An unknown error occurred!",
      };
      throw errorResponse; // Throw structured error
    }
    return undefined;
  }
};

export const PUT = async ({ path, payload, showToast }: ApiOptions) => {
  try {
    const url = serverUrl + "/api" + path;
    const { data } = await axios.put(url, payload);
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (showToast && err.response?.data) {
        const errorMsg = err.response.data;
        showToast("", errorMsg, "error");
      } else {
        throw new Error(err.response?.data);
      }
    }
    return undefined;
  }
};

export const PATCH = async ({ path, payload, showToast }: ApiOptions) => {
  try {
    const url = serverUrl + "/api" + path;
    const { data } = await axios.patch(url, payload);
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (showToast && err.response?.data) {
        const errorMsg = err.response.data;
        showToast("", errorMsg, "error");
      } else {
        throw new Error(err.response?.data);
      }
    }
    return undefined;
  }
};

export const DELETE = async ({ path, params, showToast }: ApiOptions) => {
  try {
    const url = serverUrl + "/api" + path;
    const { data } = await axios.delete(url, {
      params: params,
    });
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (showToast && err.response?.data) {
        const errorMsg = err.response.data;
        showToast("", errorMsg, "error");
      } else {
        throw new Error(err.response?.data);
      }
    }
    return undefined;
  }
};
