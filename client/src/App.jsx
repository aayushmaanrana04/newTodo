import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Todo from "./components/todo";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Todo} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
