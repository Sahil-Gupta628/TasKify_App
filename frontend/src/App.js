// import React, { useState, useEffect } from "react";
// import ToDoList from "./components/ToDoList";
// import ToDoForm from "./components/ToDoForm";
// import { Container } from "react-bootstrap";

// function App() {
//     const [todos, setTodos] = useState([]);

//     useEffect(() => {
//         fetch("http://localhost:8000/todos/")
//             .then((res) => res.json())
//             .then((data) => setTodos(data));
//     }, []);

//     const handleAdd = (todo) => {
//         fetch("http://localhost:8000/todos/", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(todo),
//         })
//             .then((res) => res.json())
//             .then((newTodo) => setTodos([...todos, newTodo]));
//     };

//     const handleDelete = (id) => {
//         fetch(`http://localhost:8000/todos/${id}`, { method: "DELETE" })
//             .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
//     };

//     const handleEdit = (updatedTodo) => {
//         fetch(`http://localhost:8000/todos/${updatedTodo.id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(updatedTodo),
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 setTodos(todos.map((t) => (t.id === data.id ? data : t)));
//             });
//     };

//     return (
//         <Container className="py-5">
//             <h1 className="text-center mb-4">📝 FastAPI TasKify App</h1>
//             <ToDoForm onAdd={handleAdd} />
//             <ToDoList todos={todos} onDelete={handleDelete} onEdit={handleEdit} />
//         </Container>
//     );
// }

// export default App;

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ToDoList  from "./components/ToDoList";
import Login     from "./components/Login";
import Register  from "./components/Register";
import "./App.css";

function App() {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem("tk-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tk-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  // ── Auth state — this is the KEY fix ─────────────────────────────────────
  // Use actual React state so the app re-renders when the token changes
  const [token, setToken] = useState(
    () => localStorage.getItem("tk-token") || ""
  );

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("tk-token", newToken);
    setToken(newToken);              // triggers re-render → route changes to /
  };

  const handleLogout = () => {
    localStorage.removeItem("tk-token");
    setToken("");                    // triggers re-render → route changes to /login
  };

  return (
    <BrowserRouter>
      <div className="tk-container">
        <header className="tk-header">
          <h1>TasKify ✓</h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {token && (
              <button
                className="tk-btn tk-btn-sm tk-btn-outline"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
            <button className="tk-theme-btn" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </header>

        <Routes>
          {/* Pass the callback down so Login/Register can trigger state update */}
          <Route path="/login"    element={<Login    onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
          <Route
            path="/"
            element={token ? <ToDoList token={token} /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;