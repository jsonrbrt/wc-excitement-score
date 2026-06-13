let fixtures = [];
let chronologicalFixtures = [];
let topFixtures = [];

async function loadData() {
  const response = await fetch("../data/scored_fixtures.json");
  const data = await response.json();
  fixtures = data.fixtures;
  window.fixtures = fixtures;
  chronologicalFixtures = [...fixtures].sort((a, b) => a.matchId - b.matchId);
  topFixtures = [...fixtures].sort(
    (a, b) => b.excitementScore - a.excitementScore,
  );

  console.log(fixtures.length);
  console.log(fixtures[0]);
  populateDropdown();
  renderTopMatches();
  renderMatch(chronologicalFixtures[0]);
}

function populateDropdown() {
  const select = document.getElementById("fixture-select");

  chronologicalFixtures.forEach((fixture) => {
    const option = document.createElement("option");
    option.value = fixture.matchId;
    option.textContent = `${fixture.homeTeamName} vs ${fixture.awayTeamName}`;
    select.appendChild(option);
  });
}

const select = document.getElementById("fixture-select");
select.addEventListener("change", () => {
  const selectedId = Number(select.value);

  const selectedFixture = fixtures.find((fixture) => {
    return fixture.matchId === selectedId;
  });
  renderMatch(selectedFixture);
});

function renderTopMatches() {
  const topMatchesContainer = document.getElementById("top-matches");

  topMatchesContainer.innerHTML = "";

  topFixtures.slice(0, 10).forEach((fixture, index) => {
    const item = document.createElement("button");

    item.classList.add("top-match-item");
    item.value = fixture.matchId;

    item.innerHTML = `
    <span class="top-match-rank">#${index + 1}</span>
    <span class="top-match-name">
        ${fixture.homeTeamName} vs ${fixture.awayTeamName}
    </span>
    <span class="top-match-score">${fixture.excitementScore}</span>
    `;

    item.addEventListener("click", () => {
      renderMatch(fixture);

      const select = document.getElementById("fixture-select");
      select.value = fixture.matchId;
    });

    topMatchesContainer.appendChild(item);
  });
}

function renderMatch(selectedFixture) {
  if (!selectedFixture) return;
  const matchName = document.getElementById("match-name");
  const score = document.getElementById("score");
  const watchTier = document.getElementById("watch-tier");
  const starPlayers = document.getElementById("star-players");
  const whyWatch = document.getElementById("why-watch");
  const kickoffElement = document.getElementById("kickoff-time");
  const finalScore = document.getElementById("final-score");
  const actualExcitement = document.getElementById("actual-excitement");

  matchName.textContent = `${selectedFixture.homeTeamName} vs ${selectedFixture.awayTeamName}`;
  score.textContent = `Excitement Score: ${selectedFixture.excitementScore}`;
  watchTier.textContent = `Watchability: ${selectedFixture.watchTier}`;
  starPlayers.textContent = `${selectedFixture.starPlayers?.join(", ") || "Coming Soon"}`;
  whyWatch.textContent = `${selectedFixture.whyWatch || "Check back after 6/17"}`;
  if (selectedFixture.kickoffUTC) {
    const kickoff = new Date(selectedFixture.kickoffUTC);

    kickoffElement.textContent = kickoff.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } else {
    kickoffElement.textContent = "Kickoff time TBA";
  }

  const breakdownContainer = document.getElementById("score-breakdown");
  const breakdown = selectedFixture.scoreBreakdown;

  const breakdownLabels = {
    attackingScore: "Attacking Score",
    chaosScore: "Chaos Score",
    starPowerScore: "Star Power",
    upsetPotential: "Upset Potential",
    matchImportance: "Match Importance",
    rivalryScore: "Rivalry / Narrative",
  };

  const breakdownExplanations = {
    attackingScore: "How much attacking output both teams usually produce.",
    chaosScore: "How open the match could be based on goals conceded.",
    starPowerScore:
      "How many recognizable or high-impact players are involved.",
    upsetPotential: "How balanced the matchup is based on Elo gap.",
    matchImportance: "How meaningful the fixture is in the tournament context.",
    rivalryScore: "Extra narrative from history, rivalry, or storyline.",
  };

  breakdownContainer.innerHTML = "";

  Object.entries(breakdown).forEach(([key, value]) => {
    const row = document.createElement("div");

    const label = breakdownLabels[key] || key;
    const explanation =
      breakdownExplanations[key] || "No description available";
    const width = Math.min(value * 10, 100);

    row.innerHTML = `
    <div class="breakdown-row">
        <span>
            ${label}
            <span class="info-icon" title="${explanation}">i</span>
        </span>
        <span>${value}</span>
    </div>

    <div class="progress-track">
        <div class="progress-fill" style="width: ${width}%"></div>
    </div>
    `;

    breakdownContainer.appendChild(row);
  });

  if (selectedFixture.status === "completed") {
    finalScore.textContent = `Final Score: ${selectedFixture.finalScore}`;
    //actualExcitement.textContent = `Actual Excitement: ${selectedFixture.actualExcitementScore}`;
  } else {
    finalScore.textContent = "Final Score: Not played yet";
    //actualExcitement.textContent = "TBC";
  }
}

loadData();
