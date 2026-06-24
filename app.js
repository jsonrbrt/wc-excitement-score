let fixtures = [];
let chronologicalFixtures = [];
let topFixtures = [];

const breakdownDescriptions = {
  attackingScore: {
    label: "Attacking Score",
    description: "How much attacking output both teams usually produce.",
    low: "Less Attacking",
    high: "More Attacking",
  },
  chaosScore: {
    label: "Chaos Score",
    description:
      "How open the match would be based on goals concded by both teams.",
    low: "More Controlled",
    high: "More Chaotic",
  },
  starPowerScore: {
    label: "Star Players",
    description:
      "How many recognizable stars and high-impact players from both teams.",
    low: "Fewer Stars",
    high: "More Stars",
  },
  competitiveBalance: {
    label: "Competitive Balance",
    description:
      "How balanced the matchup is based on Elo ratings and rank difference.",
    low: "One-sided",
    high: "Evenly Matched",
  },
  matchImportance: {
    label: "Match Importance",
    description: "How important the game is for both sides.",
    low: "Less Important",
    high: "More Important",
  },
  rivalryScore: {
    label: "Rivalry/Narrative",
    description: "Extra narrative from history, rivalry, or storyline.",
    low: "Low Rivalry",
    high: "Intense Rivalry",
  },
};

async function loadData() {
  const response = await fetch("./data/scored_fixtures.json");
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
  renderKnockoutStage();
  renderMatch(chronologicalFixtures[0]);
}

function formatDateForICS(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICSText(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

function downloadCalendarEvent(fixture) {
  const start = new Date(fixture.kickoffUTC);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const title = `${fixture.homeTeamName} vs ${fixture.awayTeamName}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//World Cup Excitement Score//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${fixture.matchId}@wc-excitement-score`,
    `DTSTAMP:${formatDateForICS(new Date())}`,
    `DTSTART:${formatDateForICS(start)}`,
    `DTEND:${formatDateForICS(end)}`,
    `SUMMARY:${escapeICSText(title)}`,
    `DESCRIPTION:${escapeICSText(`Excitement Score: ${fixture.excitementScore} - ${fixture.watchTier}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const icsContent = lines.join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fixture.homeTeamName}-vs-${fixture.awayTeamName}.ics`;
  link.click();

  URL.revokeObjectURL(url);
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
    const resultText =
      fixture.status === "completed" && fixture.finalScore
        ? `FT ${fixture.finalScore}`
        : fixture.watchTier;

    const item = document.createElement("button");

    item.classList.add("top-match-item");
    item.value = fixture.matchId;

    item.innerHTML = `
    <span class="top-match-rank">#${index + 1}</span>
    <span class="top-match-name">
        ${fixture.homeTeamName} vs ${fixture.awayTeamName}
    </span>
    <span class="top-match-meta">
      ${resultText}
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
  const calendarButton = document.getElementById("calendar-button");

  matchName.textContent = `${selectedFixture.homeTeamName} vs ${selectedFixture.awayTeamName}`;
  score.textContent = `Excitement Score: ${selectedFixture.excitementScore}`;
  watchTier.textContent = `Watchability: ${selectedFixture.watchTier}`;
  starPlayers.textContent = `${selectedFixture.starPlayers?.join(", ") || "Coming Soon"}`;
  whyWatch.textContent = `${selectedFixture.whyWatch || "Check back after 6/23"}`;

  if (selectedFixture.kickoffUTC) {
    const kickoff = new Date(selectedFixture.kickoffUTC);
    const now = new Date();

    kickoffElement.textContent = kickoff.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    calendarButton.style.display = kickoff > now ? "inline-block" : "none";
  } else {
    kickoffElement.textContent = "Kickoff time TBA";
    calendarButton.style.display = "none";
  }

  const kickoff = new Date(selectedFixture.kickoffUTC);
  const now = new Date();

  calendarButton.onclick = () => {
    downloadCalendarEvent(selectedFixture);
  };

  const breakdownContainer = document.getElementById("score-breakdown");
  const breakdown = selectedFixture.scoreBreakdown;

  breakdownContainer.innerHTML = "";

  Object.entries(breakdown).forEach(([key, value]) => {
    const row = document.createElement("div");

    const metric = breakdownDescriptions[key];

    if (!metric) return;

    const width = Math.min(value * 10, 100);

    row.innerHTML = `
    <div class="metric-header">
        <span>${metric.label}</span>
        <span>${value}</span>
    </div>

    <p class="metric-description">
      ${metric.description}
    </p>

    <div class="metric-scale-labels">
      <span>${metric.low}</span>
      <span>${metric.high}</span>
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

function renderKnockoutStage() {
  const roundOf32 = fixtures.filter(
    fixture => fixture.stage === "Round of 32"
  );
  const roundOf16 = fixtures.filter(
    (fixture) => fixture.stage === "Round of 16",
  );
  const quarterfinals = fixtures.filter(
    (fixture) => fixture.stage === "Quarterfinals",
  );

  renderKnockoutCards(roundOf32, "round-of-32");
}

function renderKnockoutCards(stageFixtures, containerId) {
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  stageFixtures.forEach((fixture) => {
    const card = document.createElement("div");
    card.classList.add("knockout-card");

    card.innerHTML = `
    <div class="knockout-match-title">
    ${fixture.homeTeamName} <br />vs <br />${fixture.awayTeamName}
    </div>

    <div class="knockout-status">
    ${fixture.watchTier || "TBD"}
    <div>
    `

    container.appendChild(card);
  })
}

loadData();
