import axios from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const baseApiCall = async (tokenType) => {
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  // some comment
  try {
    const axiosInstance = axios.create({
      headers,
    });

    return axiosInstance;
  } catch (error) {
    //handle errors here
  }
};

export const cancelRequest = () => {
  source.cancel("Operation canceled due to new request.");
};

const apiCall = async (url, httpMethod, body, additionalParams, tokenType) => {
  const axiosInstance = await baseApiCall(tokenType);
  switch (httpMethod) {
    case "post":
    case "put":
      return axiosInstance[httpMethod](url, body, additionalParams);
    case "get":
      return axiosInstance[httpMethod](url, body);
    case "delete":
      return axiosInstance[httpMethod](url);
    default:
      return axiosInstance[httpMethod](url);
  }
};

const apiRequest = async (
  url,
  httpMethod,
  body = {},
  additionalParams = {}
) => {
  return new Promise(function (resolve, reject) {
    // Let user make request if their device can reach the internet
      apiCall(url, httpMethod, body, additionalParams)
        .then((response) => {
          if (response.status < 400) {
            if (response.data.status >= 400) {
              // not really success so we reject
              reject(response.data);
            } else {
              // not an error so respond
              resolve(response.data);
            }
          } else {
            // we reject for now
            reject(response.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
  });
};

export {apiRequest};
