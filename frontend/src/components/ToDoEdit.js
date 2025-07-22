import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

function ToDoEdit({ todo, onUpdate, onCancel }) {
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description || "");
    const [done, setDone] = useState(todo.done);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ ...todo, title, description, done });
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3 border rounded bg-white">
            <h5>Edit Task</h5>
            <Form.Group className="mb-2">
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <Form.Check
                type="checkbox"
                label="Completed"
                checked={done}
                onChange={(e) => setDone(e.target.checked)}
                className="mb-3"
            />
            <Button variant="success" type="submit" className="me-2">Update</Button>
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        </Form>
    );
}

export default ToDoEdit;
