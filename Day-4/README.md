# Random Data API


A REST API that returns random quotes, jokes, and facts with dynamic logic. Implements a no-repetition algorithm that ensures the same item is never returned twice in a row until the full pool has been exhausted.


## Concepts Covered

- Dynamic response generation
- Logic inside API handlers
- State management across requests (no-repetition pool)
- Modular code structure (data, utils, routes)


## Project Structure

```
day4/
├── src/
│   ├── data/
│   │   └── data.js              # Quotes, jokes, and facts arrays
│   ├── routes/
│   │   └── random.js            # /quote, /joke, /fact routes
│   ├── utils/
│   │   └── randomPicker.js      # No-repetition random picker class
│   └── index.js                 # Entry point
├── .env
├── .gitignore
└── package.json
```


## Setup

```bash
npm install
npm run dev
```

Create a `.env` file:
```
PORT=3000
```


## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Lists all available endpoints |
| GET | /quote | Returns a random quote |
| GET | /joke | Returns a random joke |
| GET | /fact | Returns a random fact (bonus) |


## Response Format

All endpoints return the same structure:

```json
{
  "type": "quote",
  "data": "The best way to get started is to quit talking and begin doing. — Walt Disney"
}
```


## No-Repetition Logic (Bonus)

Each endpoint maintains its own pool of items. When a request comes in:

1. The last returned item is excluded from the available pool.
2. A random item is picked from the remaining pool.
3. Once all items have been served, the pool resets automatically.

This guarantees no consecutive repetition across any number of API calls.
