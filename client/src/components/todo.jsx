import { useEffect, useRef, useState } from "react";
import styles from "../styles/todo.module.css";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { BiCheckbox, BiCheckboxSquare } from "react-icons/bi";
import withAuth from "../checkLogin";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function Todo() {
  const [todoItem, setTodoItem] = useState("");
  const [todoArray, setTodoArray] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [updateList, setUpdateList] = useState(0);
  const checkbox = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const email = decodedToken.email;
    setEmail(email);
    setUsername(email.replace("@gmail.com", ""));
  }, [navigate]);

  function handleChange(e) {
    e.preventDefault();
    setTodoItem(e.target.value);
  }

  useEffect(() => {
    setUpdateList(updateList + 1);
  }, []);

  useEffect(() => {
    async function getTodo() {
      try {
        const response = await fetch(
          `http://localhost:5000/getTodo?email=${email}`
        );
        const data = await response.json();
        const newArray = data.map(
          (x) => x.item + "#" + x._id + "#" + Number(x.state)
        );
        setTodoArray([...newArray]);
      } catch (e) {
        console.log(e);
      }
    }
    getTodo();
  }, [updateList]);

  async function postTodo() {
    try {
      const response = await fetch("http://localhost:5000/postTodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoItem, email }),
      });
      if (response) {
        setUpdateList(updateList + 1);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (todoItem != "") {
      postTodo();
      setTodoItem("");
    }
  }

  function handleKeyDown(e) {
    if (e.key == "Enter") {
      handleSubmit(e);
    }
  }

  async function deleteItem(e, index) {
    e.preventDefault();
    const arr = [...todoArray];
    const item = arr[index];
    const id = item.split("#")[1];
    // arr.splice(index, 1);
    try {
      const response = await fetch(`http://localhost:5000/deleteItem?id=${id}`);
      const data = await response.json();
      if (response) {
        setUpdateList(updateList + 1);
      }
      console.log(data);
    } catch (e) {
      console.log(e);
    }
    // setTodoArray(arr);
  }
  async function updateState(e, index) {
    e.preventDefault();
    const arr = [...todoArray];
    const item = arr[index];
    const id = item.split("#")[1];
    const state = item.split("#")[2];
    // arr.splice(index, 1);
    try {
      const response = await fetch(
        `http://localhost:5000/updateItem?state=${state}&id=${id}`
      );
      const data = await response.json();
      if (response) {
        setUpdateList(updateList + 1);
      }
      console.log(data);
    } catch (e) {
      console.log(e);
    }
    // setTodoArray(arr);
  }

  function logout() {
    sessionStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className={styles.todo}>
      <button onClick={logout} className={styles.logout}>
        <p>{username}</p>
        <FiLogOut size={20} />
      </button>
      <div className={styles.inputwala}>
        <input
          type="text"
          placeholder="type todo item here"
          value={todoItem}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button onClick={handleSubmit}>+</button>
      </div>

      {todoArray.length != 0 && (
        <div className={styles.listwala}>
          {todoArray.map((x, index) => (
            <div
              className={`${styles.item}  ${
                x.split("#")[2] == 0 ? styles.uncheck : styles.check
              }`}
              key={index}
              onClick={(e) => updateState(e, index)}
            >
              <div className={styles.textcontainer}>
                {/* <input name="todo" ref={checkbox} type="checkbox" /> */}
                {x.split("#")[2] == 0 ? (
                  <BiCheckbox size={25} color="white" />
                ) : (
                  <BiCheckboxSquare size={24} color="white" />
                )}
                <label name="todo">{x.split("#")[0]}</label>
              </div>
              <AiTwotoneDelete
                size={30}
                color="white"
                onClick={(e) => deleteItem(e, index)}
                className={styles.delete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(Todo);
