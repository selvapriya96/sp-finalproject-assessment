export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("user"); // optional if you stored user info
  window.location.href = "/login"; // force redirect
};
