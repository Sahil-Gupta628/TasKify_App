# TasKify Project Layout

This file shows where the main project files are located in the TasKify app.

```text
TasKify_App/
├── README.md
├── PROJECT_LAYOUT.md
├── backend/
│   ├── main.py
│   ├── crud.py
│   ├── database.py
│   ├── models.py
│   ├── requirements.txt
│   ├── todos.db
│   ├── venv/
│   └── __pycache__/
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── public/
    │   ├── index.html
    │   ├── favicon.ico
    │   ├── logo192.png
    │   ├── logo512.png
    │   └── manifest.json
    └── src/
        ├── App.js
        ├── App.css
        ├── App.test.js
        ├── index.js
        ├── index.css
        ├── reportWebVitals.js
        ├── setupTests.js
        ├── logo.svg
        └── components/
            ├── Login.js
            ├── Register.js
            ├── ToDoForm.js
            ├── ToDoList.js
            └── ToDoEdit.js
```

## What each part is for

- `backend/` contains the FastAPI app and database-related code.
- `frontend/` contains the React UI.
- `public/` holds static frontend assets.
- `src/` holds the React source code.
- `components/` contains the reusable task UI components, including the auth screens.
- Generated folders such as `frontend/build/` and `frontend/node_modules/` are not listed here.
