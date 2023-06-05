import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function checkLogin(Component) {
  function Auth() {
    const navigate = useNavigate();

    useEffect(() => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
      const decodedToken = jwt_decode(token);
      //   console.log(decodedToken);

      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    }, [navigate]);

    return <Component />;
  }
  return Auth;
}

export default checkLogin;
