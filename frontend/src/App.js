import React, { useState, useEffect } from "react";
import ToDoList from "./components/ToDoList";
import ToDoForm from "./components/ToDoForm";
import { Container } from "react-bootstrap";

function App() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/todos/")
            .then((res) => res.json())
            .then((data) => setTodos(data));
    }, []);

    const handleAdd = (todo) => {
        fetch("http://localhost:8000/todos/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo),
        })
            .then((res) => res.json())
            .then((newTodo) => setTodos([...todos, newTodo]));
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8000/todos/${id}`, { method: "DELETE" })
            .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
    };

    const handleEdit = (updatedTodo) => {
        fetch(`http://localhost:8000/todos/${updatedTodo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTodo),
        })
            .then((res) => res.json())
            .then((data) => {
                setTodos(todos.map((t) => (t.id === data.id ? data : t)));
            });
    };

    return (
        <Container className="py-5">
            <h1 className="text-center mb-4">📝 FastAPI TasKify App</h1>
            <ToDoForm onAdd={handleAdd} />
            <ToDoList todos={todos} onDelete={handleDelete} onEdit={handleEdit} />
        </Container>
    );
}

export default App;
