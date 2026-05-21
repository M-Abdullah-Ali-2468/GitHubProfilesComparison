const axios = require("axios");

// Create axios instance with timeout
const github = axios.create({
  baseURL: "https://api.github.com",
  timeout: 5000,
  headers: {
    "Accept": "application/vnd.github.v3+json",
  },
});

// Fetch user profile data
async function getUserData(username) {
  try {
    const response = await github.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      const timeoutError = new Error("GitHub API timeout");
      timeoutError.code = "ECONNABORTED";
      throw timeoutError;
    }

    if (error.response && error.response.status === 404) {
      const notFoundError = new Error(`GitHub user "${username}" not found`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    if (error.response && error.response.status === 403) {
      const rateLimitError = new Error("GitHub API rate limit exceeded. Please try again later.");
      rateLimitError.statusCode = 403;
      throw rateLimitError;
    }

    throw new Error("Failed to fetch GitHub data");
  }
}

// Fetch user repos (up to 100)
async function getUserRepos(username) {
  try {
    const response = await github.get(`/users/${username}/repos`, {
      params: {
        per_page: 100,
        sort: "updated",
      },
    });
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      const timeoutError = new Error("GitHub API timeout");
      timeoutError.code = "ECONNABORTED";
      throw timeoutError;
    }

    // If repos fail, return empty array instead of crashing
    console.error(`Could not fetch repos for ${username}:`, error.message);
    return [];
  }
}

// Find the most used programming language across repos
function getMostUsedLanguage(repos) {
  const languageCount = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });

  // Find the language with highest count
  let topLanguage = "N/A";
  let maxCount = 0;

  for (const [language, count] of Object.entries(languageCount)) {
    if (count > maxCount) {
      maxCount = count;
      topLanguage = language;
    }
  }

  return topLanguage;
}

// Find the repo with most stars
function getTopStarredRepo(repos) {
  if (repos.length === 0) {
    return { name: "N/A", stars: 0 };
  }

  let topRepo = repos[0];

  repos.forEach((repo) => {
    if (repo.stargazers_count > topRepo.stargazers_count) {
      topRepo = repo;
    }
  });

  return {
    name: topRepo.name,
    stars: topRepo.stargazers_count,
  };
}

module.exports = {
  getUserData,
  getUserRepos,
  getMostUsedLanguage,
  getTopStarredRepo,
};
