import React, { useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import ToDoEdit from "./ToDoEdit";

function ToDoList({ todos, onDelete, onEdit }) {
    const [editingTodo, setEditingTodo] = useState(null);

    return (
        <div>
            <h4 className="my-3">Your Tasks</h4>
            {todos.length === 0 && <p>No Tasks Found. Add some!</p>}
            {todos.map((todo) => (
                <Card key={todo.id} className="mb-3 shadow-sm">
                    <Card.Body>
                        {editingTodo?.id === todo.id ? (
                            <ToDoEdit
                                todo={editingTodo}
                                onUpdate={(updatedTodo) => {
                                    onEdit(updatedTodo);
                                    setEditingTodo(null);
                                }}
                                onCancel={() => setEditingTodo(null)}
                            />
                        ) : (
                            <>
                                <Card.Title className="d-flex justify-content-between align-items-center">
                                    {todo.title}
                                    {todo.done && <Badge bg="success">Done</Badge>}
                                </Card.Title>
                                <Card.Text>{todo.description}</Card.Text>
                                <Button
                                    variant="outline-primary"
                                    className="me-2"
                                    size="sm"
                                    onClick={() => setEditingTodo(todo)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => onDelete(todo.id)}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default ToDoList;
