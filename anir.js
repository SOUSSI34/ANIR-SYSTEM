// ========================================
// ANIR SYSTEM V4
// ========================================

const quests = [
  {
    name: "Future Quest",
    description: "Practice programming for 45 minutes.",
    icon: "💻",
    xp: 10,
    stat: "int"
  },
  {
    name: "Body Quest",
    description: "Train or run for 30–60 minutes.",
    icon: "🏃",
    xp: 10,
    stat: "vit"
  },
  {
    name: "Mind Quest",
    description: "Learn something useful for 15 minutes.",
    icon: "🧠",
    xp: 10,
    stat: "int"
  }
];

const STORAGE_KEY = "ANIR_SYSTEM_V4";

let system =
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    totalXP: 0,
    streak: 0,
    lastDate: null,
    completedToday: [],
    todayXP: 0,

    stats: {
      str: 1,
      agi: 1,
      vit: 1,
      int: 1
    },

    challengeStart: null
  };


// ========================================
// DATE
// ========================================

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const today = getToday();


// ========================================
// SAVE
// ========================================

function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(system)
  );
}


// ========================================
// NEW DAY
// ========================================

function checkNewDay() {

  if (!system.challengeStart) {
    system.challengeStart = today;
  }

  if (system.lastDate === today) {
    return;
  }

  if (system.lastDate) {

    const last = new Date(system.lastDate);
    const current = new Date(today);

    const difference =
      Math.floor(
        (current - last) /
        (1000 * 60 * 60 * 24)
      );

    // If more than one day was missed
    if (difference > 1) {
      system.streak = 0;
    }
  }

  system.completedToday = [];
  system.todayXP = 0;
  system.lastDate = today;

  save();
}


// ========================================
// LEVEL
// ========================================

function getLevel() {

  return Math.floor(
    system.totalXP / 100
  ) + 1;

}


// ========================================
// RANK
// ========================================

function getRank(level) {

  if (level >= 50) return "S-RANK";
  if (level >= 30) return "A-RANK";
  if (level >= 20) return "B-RANK";
  if (level >= 10) return "C-RANK";
  if (level >= 5) return "D-RANK";

  return "E-RANK";
}


// ========================================
// XP
// ========================================

function addXP(amount) {

  const oldLevel = getLevel();

  system.totalXP += amount;
  system.todayXP += amount;

  const newLevel = getLevel();

  if (newLevel > oldLevel) {

    alert(
      `⚔️ LEVEL UP!\n\n` +
      `You reached Level ${newLevel}!`
    );
  }
}


// ========================================
// COMPLETE QUEST
// ========================================

function completeQuest(index) {

  if (
    system.completedToday.includes(index)
  ) {
    return;
  }

  const quest = quests[index];

  if (!quest) {
    return;
  }

  // XP
  addXP(quest.xp);

  // Mark completed
  system.completedToday.push(index);

  // Increase main stat
  system.stats[quest.stat] += 1;


  // Body Quest → AGI bonus
  if (index === 1) {
    system.stats.agi += 1;
  }


  // ====================================
  // DAILY COMPLETE BONUS
  // ====================================

  if (
    system.completedToday.length ===
    quests.length
  ) {

    addXP(20);

    system.streak += 1;

    alert(
      "⚔️ DAILY QUEST COMPLETE!\n\n" +
      "+20 BONUS XP\n" +
      `🔥 STREAK: ${system.streak} DAYS`
    );
  }


  save();
  render();
}


// ========================================
// QUEST HTML
// ========================================

function createQuestHTML(
  quest,
  index
) {

  const completed =
    system.completedToday.includes(index);


  return `
    <article
      class="quest ${completed ? "completed" : ""}"
    >

      <div class="quest-icon">
        ${quest.icon}
      </div>

      <div class="quest-info">

        <h3>
          ${quest.name}
        </h3>

        <p>
          ${quest.description}
        </p>

        <span>
          +${quest.xp} XP
        </span>

      </div>

      <button
        class="complete-btn"
        data-index="${index}"
        ${completed ? "disabled" : ""}
      >
        ${completed ? "✓" : "+"}
      </button>

    </article>
  `;
}


// ========================================
// BUTTONS
// ========================================

function attachQuestButtons(container) {

  container
    .querySelectorAll(".complete-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          completeQuest(
            Number(button.dataset.index)
          );

        }
      );

    });
}


// ========================================
// HOME
// ========================================

function renderHome() {

  const level = getLevel();

  const currentXP =
    system.totalXP % 100;


  document.getElementById("level")
    .textContent = level;


  document.getElementById("rank")
    .textContent =
    getRank(level);


  document.getElementById("xpText")
    .textContent =
    `${currentXP} / 100 XP`;


  document.getElementById("xpBar")
    .style.width =
    `${currentXP}%`;


  document.getElementById("streak")
    .textContent =
    system.streak;


  document.getElementById("todayXP")
    .textContent =
    system.todayXP;


  document.getElementById("totalXP")
    .textContent =
    system.totalXP;


  document.getElementById("questCount")
    .textContent =
    `${system.completedToday.length} / ${quests.length}`;


  const container =
    document.getElementById("homeQuests");


  container.innerHTML = "";


  quests.forEach(
    (quest, index) => {

      container.innerHTML +=
        createQuestHTML(
          quest,
          index
        );

    }
  );


  attachQuestButtons(container);
}


// ========================================
// QUESTS PAGE
// ========================================

function renderQuests() {

  const container =
    document.getElementById("allQuests");


  container.innerHTML = "";


  quests.forEach(
    (quest, index) => {

      container.innerHTML +=
        createQuestHTML(
          quest,
          index
        );

    }
  );


  attachQuestButtons(container);


  const start =
    new Date(system.challengeStart);

  const now =
    new Date(today);


  const difference =
    Math.floor(
      (now - start) /
      (1000 * 60 * 60 * 24)
    ) + 1;


  const day =
    Math.min(
      Math.max(difference, 1),
      90
    );


  document.getElementById(
    "challengeDay"
  ).textContent =
    `DAY ${day} / 90`;
}


// ========================================
// STATS
// ========================================

function renderStats() {

  const stats =
    system.stats;


  document.getElementById("strValue")
    .textContent = stats.str;


  document.getElementById("agiValue")
    .textContent = stats.agi;


  document.getElementById("vitValue")
    .textContent = stats.vit;


  document.getElementById("intValue")
    .textContent = stats.int;


  document.getElementById("strBar")
    .style.width =
    `${Math.min(stats.str, 100)}%`;


  document.getElementById("agiBar")
    .style.width =
    `${Math.min(stats.agi, 100)}%`;


  document.getElementById("vitBar")
    .style.width =
    `${Math.min(stats.vit, 100)}%`;


  document.getElementById("intBar")
    .style.width =
    `${Math.min(stats.int, 100)}%`;


  const power =
    stats.str +
    stats.agi +
    stats.vit +
    stats.int;


  document.getElementById("powerValue")
    .textContent = power;


  renderAchievements();
}


// ========================================
// ACHIEVEMENTS
// ========================================

function renderAchievements() {

  const achievements = [

    {
      icon: "🌱",
      name: "First Step",
      description:
        "Complete your first quest.",
      unlocked:
        system.totalXP >= 10
    },

    {
      icon: "⚔️",
      name: "Warrior",
      description:
        "Reach 100 total XP.",
      unlocked:
        system.totalXP >= 100
    },

    {
      icon: "🔥",
      name: "Consistency",
      description:
        "Reach a 7 day streak.",
      unlocked:
        system.streak >= 7
    },

    {
      icon: "👑",
      name: "Elite",
      description:
        "Reach Level 10.",
      unlocked:
        getLevel() >= 10
    }

  ];


  const container =
    document.getElementById(
      "achievementList"
    );


  container.innerHTML = "";


  achievements.forEach(
    achievement => {

      container.innerHTML += `

        <div class="
          achievement
          ${achievement.unlocked
            ? ""
            : "locked"}
        ">

          <div class="achievement-icon">
            ${achievement.icon}
          </div>

          <div>

            <strong>
              ${achievement.name}
            </strong>

            <p>
              ${achievement.description}
            </p>

          </div>

        </div>

      `;

    }
  );
}


// ========================================
// NAVIGATION
// ========================================

document
  .querySelectorAll(".nav-item")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const page =
          button.dataset.page;


        document
          .querySelectorAll(".page")
          .forEach(section => {

            section.classList.remove(
              "active-page"
            );

          });


        document
          .getElementById(page)
          .classList.add(
            "active-page"
          );


        document
          .querySelectorAll(".nav-item")
          .forEach(item => {

            item.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );

      }
    );

  });


// ========================================
// RESET
// ========================================

document
  .getElementById("resetBtn")
  .addEventListener(
    "click",
    () => {

      if (
        !confirm(
          "Are you sure you want to reset ALL progress?"
        )
      ) {
        return;
      }


      localStorage.removeItem(
        STORAGE_KEY
      );


      location.reload();

    }
  );


// ========================================
// SERVICE WORKER
// ========================================

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register(
    "./sw.js"
  );

}


// ========================================
// START SYSTEM
// ========================================

checkNewDay();

render();
