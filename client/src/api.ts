const API_URL = "http://localhost:5001";

export const getFullBlocksApi = async () => {
    const response = await fetch(`${API_URL}/knowledge-check-blocks`);
    return response.json();
};
