# NyondoStock

Web app for **NYONDO General Hardware** — stock, sales, supplier credit, transport rules, and salary-earner deposit scheme (course project).

## Repository layout

| Folder | Stack |
|--------|--------|
| `backend/Nyondoproject/` | Django + SQLite (`manage.py` lives here) |
| `frontend/` | React (Vite) |

## Prerequisites

- Python 3.11+ (or version your team uses)
- Node.js 20 LTS (includes `npm`)

## Backend (Django)

```bash
cd backend
python -m venv .venv
```

**Windows (cmd):** `.venv\Scripts\activate`  
**Windows (PowerShell):** `.venv\Scripts\Activate.ps1`  
**macOS / Linux:** `source .venv/bin/activate`

```bash
pip install -r requirements.txt
cd Nyondoproject
python manage.py migrate
python manage.py runserver
```

Open http://127.0.0.1:8000/ — admin: http://127.0.0.1:8000/admin/ (create a superuser with `python manage.py createsuperuser`).

## Frontend (React + Vite)

In a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed in the terminal (often http://localhost:5173).

## Git

```bash
git clone <your-repo-url>
cd NyondoStock
```

## Contributing

Use branches and Pull Requests. Keep commits small and describe what changed in the commit message.