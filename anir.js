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


let system =
  JSON.parse(localStorage.getItem("ANIR_SYSTEM_V3")) || {

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


const today =
  new Date().toISOString().split("T")[0];


function save() {

  localStorage.setItem(
    "ANIR_SYSTEM_V3",
    JSON.stringify(system)
  );

}


function checkNewDay() {

  if (!system.challengeStart) {

    system.challengeStart = today;

  }


  if (system.lastDate === today) {
    return;
  }


  if (system.lastDate) {

    const yesterday = new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const yesterdayString =
      yesterday.toISOString().split("T")[0];


    if (
      system.lastDate !==
      yesterdayString
    ) {

      system.streak = 0;

    }

  }


  system.completedToday = [];

  system.todayXP = 0;

  system.lastDate = today;

  save();

}


function getLevel() {

  return Math.floor(
    system.totalXP / 100
  ) + 1;

}


function getRank(level) {

  if (level >= 50) return "S-RANK";
  if (level >= 30) return "A-RANK";
  if (level >= 20) return "B-RANK";
  if (level >= 10) return "C-RANK";
  if (level >= 5) return "D-RANK";

  return "E-RANK";

}


function completeQuest(index) {

  if (
    system.completedToday.includes(index)
  ) {

    return;

  }


  const quest = quests[index];


  system.totalXP += quest.xp;

  system.todayXP += quest.xp;


  system.completedToday.push(index);


  // Increase related stat

  system.stats[quest.stat] += 1;


  // AGI gets a small bonus from running/body

  if (
    index === 1 &&
    system.stats.agi < 100
  ) {

    system.stats.agi += 1;

  }


  if (
    system.completedToday.length ===
    quests.length
  ) {

    system.totalXP += 20;

    system.todayXP += 20;

    system.streak += 1;

    alert(
      "⚔️ DAILY QUEST COMPLETE!\n\n+20 BONUS XP"
    );

  }


  save();

  render();

}


function renderHome() {

  const level = getLevel();

  const currentXP =
    system.totalXP % 100;


  document.getElementById("level")
    .textContent = level;


  document.getElementById("rank")
    .textContent = getRank(level);


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


  quests.forEach((quest, index) => {

    container.innerHTML += createQuestHTML(
      quest,
      index
    );

  });


  attachQuestButtons(container);

}


function renderQuests() {

  const container =
    document.getElementById("allQuests");


  container.innerHTML = "";


  quests.forEach((quest, index) => {

    container.innerHTML += createQuestHTML(
      quest,
      index
    );

  });


  attachQuestButtons(container);


  const start =
    new Date(system.challengeStart);

  const now =
    new Date(today);


  const difference =
    Math.floor(
      (
        now - start
      ) /
      (1000 * 60 * 60 * 24)
    ) + 1;


  const day =
    Math.min(
      Math.max(difference, 1),
      90
    );


  document.getElementById("challengeDay")
    .textContent =
    `DAY ${day} / 90`;

}


function createQuestHTML(
  quest,
  index
) {

  const completed =
    system.completedToday.includes(index);


  return `

    <article
      class="quest
      ${completed ? "completed" : ""}"
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


function attachQuestButtons(container) {

  container
    .querySelectorAll(".complete-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          completeQuest(
            Number(
              button.dataset.index
            )
          );

        }
      );

    });

}


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
    .textContent =
    power;


  renderAchievements();

}


function renderAchievements() {

  const achievements = [

    {
      icon: "🌱",
      name: "First Step",
      description: "Complete your first quest.",
      unlocked:
        system.totalXP >= 10
    },

    {
      icon: "⚔️",
      name: "Warrior",
      description: "Reach 100 total XP.",
      unlocked:
        system.totalXP >= 100
    },

    {
      icon: "🔥",
      name: "Consistency",
      description: "Reach a 7 day streak.",
      unlocked:
        system.streak >= 7
    },

    {
      icon: "👑",
      name: "Elite",
      description: "Reach Level 10.",
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


function render() {

  renderHome();

  renderQuests();

  renderStats();

}


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
        "ANIR_SYSTEM_V3"
      );


      location.reload();

    }
  );


if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register(
    "./sw.js"
  );

}


checkNewDay();

render();