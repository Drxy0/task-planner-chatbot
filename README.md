# Daily Task Planner fullstack app with LLM integration

This is a fullstack web application featuring:

- **ASP.NET Core** backend API
- **SQL Server** for database
- **React** frontend SPA
- **Ollama** with `gemma:2b` as a local LLM for chatbot interaction

## Features
- Creating tasks
- Sharing tasks with other users
- View your tasks by week/month
- Ask Chatbot about your tasks
- i18n localisation

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js (v18+)](https://nodejs.org/)
- [Ollama](https://ollama.com/) installed and running locally
- `gemma:2b` model pulled in Ollama (`ollama pull gemma:2b`)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Drxy0/todo-chatbot
cd aspnetcore-react-ollama-chatbot
```

### 2. Ollama setup
```bash
ollama run gemma:2b
```

### 3. React setup
```bash
cd frontend
npm install
npm start
```
