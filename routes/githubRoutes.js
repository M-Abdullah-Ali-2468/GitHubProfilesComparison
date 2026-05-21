const express = require("express");
const router = express.Router();
const { getUserData, getUserRepos, getMostUsedLanguage, getTopStarredRepo } = require("../services/githubService");

// POST /api/compare
router.post("/compare", async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    // Validate input - empty or missing
    if (!user1 || !user2) {
      return res.status(400).json({ error: "Please enter both usernames" });
    }

    // Validate input - trim and check again
    const username1 = user1.trim();
    const username2 = user2.trim();

    if (!username1 || !username2) {
      return res.status(400).json({ error: "Usernames cannot be empty" });
    }

    // Validate input - same usernames
    if (username1.toLowerCase() === username2.toLowerCase()) {
      return res.status(400).json({ error: "Please enter two different usernames" });
    }

    // Fetch data for both users in parallel
    const [userData1, userData2, repos1, repos2] = await Promise.all([
      getUserData(username1),
      getUserData(username2),
      getUserRepos(username1),
      getUserRepos(username2),
    ]);

    // Calculate account age
    const getAccountAge = (createdAt) => {
      const created = new Date(createdAt);
      const now = new Date();
      const years = now.getFullYear() - created.getFullYear();
      const months = now.getMonth() - created.getMonth();
      const totalMonths = years * 12 + months;

      if (totalMonths < 12) {
        return `${totalMonths} month${totalMonths !== 1 ? "s" : ""}`;
      }
      const y = Math.floor(totalMonths / 12);
      const m = totalMonths % 12;
      return m > 0 ? `${y} yr${y !== 1 ? "s" : ""} ${m} mo` : `${y} yr${y !== 1 ? "s" : ""}`;
    };

    // Build comparison result
    const result = {
      user1: {
        username: userData1.login,
        avatar: userData1.avatar_url,
        followers: userData1.followers,
        following: userData1.following,
        publicRepos: userData1.public_repos,
        accountAge: getAccountAge(userData1.created_at),
        mostUsedLanguage: getMostUsedLanguage(repos1),
        topStarredRepo: getTopStarredRepo(repos1),
      },
      user2: {
        username: userData2.login,
        avatar: userData2.avatar_url,
        followers: userData2.followers,
        following: userData2.following,
        publicRepos: userData2.public_repos,
        accountAge: getAccountAge(userData2.created_at),
        mostUsedLanguage: getMostUsedLanguage(repos2),
        topStarredRepo: getTopStarredRepo(repos2),
      },
    };

    res.json(result);
  } catch (error) {
    // Handle specific error types
    if (error.statusCode === 404 || error.statusCode === 403) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ error: "GitHub API is taking too long. Please try again." });
    }

    console.error("Error comparing profiles:", error.message);
    res.status(500).json({ error: "Failed to fetch GitHub data. Please try again." });
  }
});

module.exports = router;
