import { useState } from "react";
import styles from "../styles/login.module.css";
import { NavLink, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const checkToken = sessionStorage.getItem("token");
    if (checkToken) {
      sessionStorage.removeItem("token");
    }
    const response = await fetch("http://localhost:5000/register", {
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
      <button onClick={handleSubmit}>Register</button>
      <p className={styles.bottomtext}>
        already a user?{" "}
        <NavLink className={styles.link} to={"/login"}>
          Login
        </NavLink>
      </p>
    </form>
  );
}

export default Register;
