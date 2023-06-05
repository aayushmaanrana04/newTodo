import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const checkToken = sessionStorage.getItem("token");
    if (checkToken) {
      sessionStorage.removeItem("token");
    }
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data.msg);
    if (!response.ok) {
      return alert(data.msg);
    }
    if (response.ok) {
      const token = data.token;
      sessionStorage.setItem("token", token);
      navigate("/");
    }
  }

  return (
    <form className={styles.form}>
      <input
        type="email"
        placeholder="email"
        onChange={(e) => {
          e.preventDefault();
          setEmail(e.target.value);
        }}
        value={email}
        required
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => {
          e.preventDefault();
          setPassword(e.target.value);
        }}
        value={password}
        required
      />
      <button type="submit" onClick={handleSubmit}>
        Login
      </button>
      <p className={styles.bottomtext}>
        new user?{" "}
        <NavLink className={styles.link} to={"/register"}>
          register
        </NavLink>
      </p>
    </form>
  );
}

export default Login;
