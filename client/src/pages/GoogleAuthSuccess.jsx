import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const GoogleAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);


  useEffect(() => {
    const token = params.get("token");
    const name  = params.get("name");
    const id    = params.get("id");

    console.log("name from URL:", name); // check this

  if (token) {
    loginUser({ name, _id: id }, token);
    setTimeout(() => navigate("/dashboard"), 500);
  } else {
    navigate("/login");
  }
}, []);

  return <div>Signing you in...</div>;
};

export default GoogleAuthSuccess;