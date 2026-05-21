// DOM Elements
const username1Input = document.getElementById("username1");
const username2Input = document.getElementById("username2");
const compareBtn = document.getElementById("compareBtn");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");
const resultsDiv = document.getElementById("results");

// Event Listener
compareBtn.addEventListener("click", handleCompare);

// Allow pressing Enter to compare
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleCompare();
});

async function handleCompare() {
  const user1 = username1Input.value.trim();
  const user2 = username2Input.value.trim();

  // Frontend validation
  if (!user1 || !user2) {
    showError("Please enter both usernames.");
    return;
  }

  if (user1.toLowerCase() === user2.toLowerCase()) {
    showError("Please enter two different usernames.");
    return;
  }

  // Show loading, hide others
  hideError();
  hideResults();
  showLoading();
  compareBtn.disabled = true;

  try {
    const response = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user1, user2 }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error || "Something went wrong.");
      return;
    }

    displayResults(data);
  } catch (err) {
    showError("Could not connect to server. Please try again.");
  } finally {
    hideLoading();
    compareBtn.disabled = false;
  }
}

function displayResults(data) {
  const { user1, user2 } = data;

  // Avatars & names
  document.getElementById("avatar1").src = user1.avatar;
  document.getElementById("avatar2").src = user2.avatar;
  document.getElementById("name1").textContent = user1.username;
  document.getElementById("name2").textContent = user2.username;
  document.getElementById("th1").textContent = user1.username;
  document.getElementById("th2").textContent = user2.username;

  // Fill table cells
  setCellWithWinner("followers", user1.followers, user2.followers);
  setCellWithWinner("following", user1.following, user2.following);
  setCellWithWinner("repos", user1.publicRepos, user2.publicRepos);

  // Top repo
  const topRepo1 = user1.topStarredRepo;
  const topRepo2 = user2.topStarredRepo;
  document.getElementById("topRepo1").textContent = topRepo1.name + " ⭐ " + topRepo1.stars;
  document.getElementById("topRepo2").textContent = topRepo2.name + " ⭐ " + topRepo2.stars;
  highlightWinner("topRepo", topRepo1.stars, topRepo2.stars);

  // Language
  document.getElementById("language1").textContent = user1.mostUsedLanguage;
  document.getElementById("language2").textContent = user2.mostUsedLanguage;

  // Account age
  document.getElementById("age1").textContent = user1.accountAge;
  document.getElementById("age2").textContent = user2.accountAge;

  resultsDiv.classList.remove("hidden");
}

function setCellWithWinner(metric, val1, val2) {
  const el1 = document.getElementById(metric + "1");
  const el2 = document.getElementById(metric + "2");
  el1.textContent = val1.toLocaleString();
  el2.textContent = val2.toLocaleString();
  highlightWinner(metric, val1, val2);
}

function highlightWinner(metric, val1, val2) {
  const el1 = document.getElementById(metric + "1");
  const el2 = document.getElementById(metric + "2");
  el1.classList.remove("winner");
  el2.classList.remove("winner");

  if (val1 > val2) el1.classList.add("winner");
  else if (val2 > val1) el2.classList.add("winner");
}

// UI helpers
function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  errorDiv.classList.add("hidden");
}

function showLoading() {
  loadingDiv.classList.remove("hidden");
}

function hideLoading() {
  loadingDiv.classList.add("hidden");
}

function hideResults() {
  resultsDiv.classList.add("hidden");
}
