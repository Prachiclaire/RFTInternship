# To-Do API — Advanced


An advanced To-Do REST API focused on backend state management and partial updates. Supports creating, completing, reverting, filtering, and deleting tasks with proper field-level validation.

## Concepts Covered

- Backend state management (completed / pending toggle)
- Partial updates — only update the fields provided
- Status-based filtering using query parameters
- PATCH vs PUT: semantically correct HTTP methods
- Field-level validation with descriptive errors


## Task Structure

```json
{
  "id": "1",
  "title": "Learn Backend",
  "completed": false,
  "createdAt": "2026-05-25T10:00:00.000Z",
  "updatedAt": "2026-05-25T10:00:00.000Z"
}
```

## Project Structure

```
day7/
├── src/
│   ├── middleware/
│   │   ├── logger.js          # Request logger
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   └── tasks.js           # All task routes
│   ├── store/
│   │   └── tasks.js           # In-memory task store
│   └── index.js               # Entry point
├── .env
├── .gitignore
└── package.json
```


## Setup

```bash
npm install
npm run dev
```

Create `.env`:
```
PORT=3000
```


## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /tasks | Add a new task |
| GET | /tasks | Get all tasks |
| GET | /tasks?status=completed | Filter by completed tasks |
| GET | /tasks?status=pending | Filter by pending tasks |
| GET | /tasks/:id | Get one task |
| PUT | /tasks/:id | Partial update (title and/or completed) |
| PATCH | /tasks/:id/complete | Mark task as completed |
| PATCH | /tasks/:id/incomplete | Mark task as incomplete |
| DELETE | /tasks/:id | Delete a task |


## Request Examples

### Add Task
```
POST /tasks
Content-Type: application/json

{ "title": "Learn Backend" }
```

### Update Title Only (Partial Update)
```
PUT /tasks/1
Content-Type: application/json

{ "title": "Learn Express.js" }
```

### Mark as Completed
```
PATCH /tasks/1/complete
```

### Mark as Incomplete
```
PATCH /tasks/1/incomplete
```

### Filter Completed Tasks (Bonus)
```
GET /tasks?status=completed
```

### Filter Pending Tasks (Bonus)
```
GET /tasks?status=pending
```

## Error Handling

| Scenario | Status Code |
|----------|-------------|
| Missing title on POST | 400 |
| No fields on PUT | 400 |
| Invalid completed type (not boolean) | 400 |
| Invalid status filter | 400 |
| Task already completed on PATCH | 400 |
| Task already incomplete on PATCH | 400 |
| Task not found | 404 |


