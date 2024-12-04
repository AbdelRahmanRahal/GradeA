export const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};
