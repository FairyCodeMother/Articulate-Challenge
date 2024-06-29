// import { clientLogger } from "./components/ClientLogger";

const API_URL = "http://localhost:5001";

export const getFullBlocksApi = async () => {
  const response = await fetch(`${API_URL}/get-full-blocks`);
  // clientLogger(response, "client/api:getFullBlocksApi");
  // const jsonResponse = response;
  return response.json();
};
