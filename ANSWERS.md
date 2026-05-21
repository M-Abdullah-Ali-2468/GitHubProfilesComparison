# Assessment Answers

## Q1 — How to Run the Project

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Open in browser
http://localhost:3000
```

Enter two GitHub usernames and click **Compare** to see the results.

---

## Q2 — Why This Stack?

I chose **Node.js + Express** for the backend and **HTML/CSS/JS** for the frontend because:

- **Simplicity:** No complex frameworks or build tools needed
- **Lightweight:** Express is minimal and easy to set up
- **No database required:** All data comes directly from the GitHub REST API
- **Fast to develop:** Vanilla frontend means no compilation step
- **Axios:** Reliable HTTP client with built-in timeout support

This stack is ideal for a small, focused project like this.

---

## Q3 — Edge Case Handled

**Edge Case:** Invalid GitHub username (user does not exist)

**Where:** `services/githubService.js` — inside the `getUserData()` function

**How:** When the GitHub API returns a 404 status code, the service throws a custom error with a clear message like `GitHub user "xyz" not found`. This error is caught in `routes/githubRoutes.js` and returned to the frontend as a user-friendly error message.

Other edge cases handled:
- Empty usernames (frontend + backend validation)
- Same usernames entered twice
- GitHub API timeout (5 second limit)
- General API failure

---

## Q4 — AI Tools Used

AI tools such as :contentReference[oaicite:0]{index=0} were used during development for limited assistance in:

- Discussing project structure ideas
- Clarifying implementation concepts
- Minor debugging and code improvement suggestions

The project implementation, integration, and customization were completed according to the project requirements.

---

## Q5 — Honest Gap

The **UI is basic** — it is functional and clean, but not highly polished. Given more time, I would:

- Add animations for smoother transitions
- Include user bio and profile links
- Add a chart comparing stats visually
- Make the comparison shareable via URL
- Add dark/light theme toggle

The focus was on **working functionality** and **proper error handling** over visual complexity.
