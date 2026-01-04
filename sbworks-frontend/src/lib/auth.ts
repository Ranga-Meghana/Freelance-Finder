export const getToken = () => {
  return localStorage.getItem("token");
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const getUserRole = (): "client" | "freelancer" | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
};
