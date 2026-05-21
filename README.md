# GitHub Profile Comparator

A simple web app to compare two GitHub profiles side by side.

## Features

- Compare followers, following, public repos, top starred repo, most used language, and account age
- Clean side-by-side comparison UI
- Error handling for invalid usernames, API failures, and slow responses
- No API key required

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, Vanilla JS
- **API Calls:** Axios

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

## Open

```
http://localhost:3000
```

## How It Works

1. Enter two GitHub usernames
2. Click **Compare**
3. The app fetches data from the GitHub REST API (no authentication needed)
4. Results are displayed in a comparison table

## Project Structure

```
├── server.js              # Express server
├── routes/
│   └── githubRoutes.js    # API route for /api/compare
├── services/
│   └── githubService.js   # GitHub API calls & data processing
├── public/
│   ├── index.html         # Frontend UI
│   ├── style.css          # Styles
│   └── app.js             # Frontend logic
```

## Error Handling

| Scenario             | Handled |
| -------------------- | ------- |
| Empty input          | ✅      |
| Same usernames       | ✅      |
| Invalid username     | ✅      |
| GitHub API failure   | ✅      |
| Slow API (timeout)   | ✅      |

## License

ISC
