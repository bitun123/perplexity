import { usedispatch } from "react-redux";
import {
  register,
  login,
  logout,
  recentVerifiedEmail,
} from "../service/auth.api";
import { setUser, setLoading, setError } from "../states/authSlice";

export const useAuth = () => {
  const dispatch = usedispatch();

  const handleRegister = async ({ username, email, password }) => {
    try {
      dispatch(setLoading(true));
      await register({ username, email, password });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));
      const response = await login({ email, password });
      dispatch(setUser(response.user));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await logout();
      dispatch(setUser(null));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
}

const handleRecentVerifiedEmail = async () => {
    try {
      dispatch(setLoading(true));
      const response = await recentVerifiedEmail();
      return response.email;
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
}

return {
    handleRegister,
    handleLogin,
    handleLogout,
    handleRecentVerifiedEmail,
}


};
