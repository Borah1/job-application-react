import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: { name: string }[];
  phoneNumber: string;
  dateOfBirth: string;
  profilePicture?: string;
}

const useAuthRedirect = (requireAuth?: boolean) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");

    try {
      if (localUser) {
        const parsedUser = JSON.parse(localUser);

        // Optional: Add validation to check if parsedUser has necessary properties
        setUser(parsedUser);
      } else if (requireAuth) {
        // Redirect to login if authentication is required and user is not in localStorage
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user"); // Clear invalid data
      if (requireAuth) navigate("/login");
    }
  }, [navigate, requireAuth]);

  return { user };
};

export default useAuthRedirect;
