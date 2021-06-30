import axios from "axios";
const clientConfig = {
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	}
};

let axiosInstance = axios.create(clientConfig);

export { axiosInstance };
