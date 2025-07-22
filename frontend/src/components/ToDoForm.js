import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

function ToDoForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({ title, description, done: false });
        setTitle("");
        setDescription("");
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
            <h4 className="mb-3">Add New Task</h4>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit">Add</Button>
        </Form>
    );
}

export default ToDoForm;
