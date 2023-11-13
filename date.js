"use strict";

// Global variables
let date = null;
let boy = null;
let currentDateKey = "START";
const stats = {
  "radiation": 0,
  "love": 0,
  "IQ": 80,
  "experience": 0
};
const delay = ms => new Promise(res => setTimeout(res, ms));

// HTML Elements
const landingPageSection = document.getElementById("landing-page");
const background = document.getElementById("background");
const minigame = document.getElementById("minigame");
const portrait = document.getElementById("portrait");
const dateSection = document.getElementById("date");
const promptText = document.getElementById("prompt");
const radiationStat = document.getElementById("radiation");
const IQ = document.getElementById("IQ");
const experience = document.getElementById("experience");
const loveStat = document.getElementById("love");
const button = [document.getElementById("button1"),
                document.getElementById("button2"),
                document.getElementById("button3"),
                document.getElementById("button4")];
const nameParagraph = document.getElementById("nameParagraph");
const titleAnimSource = ["/resources/images/true_befriendone1.png",
                          "/resources/images/true_befriendone2.png",
                          "/resources/images/true_befriendone3.png",
                          "/resources/images/true_befriendone4.png"]
const titleImg = document.getElementById("titleText")
const dateMusic = document.getElementById("date-music");
const menuMusic = document.getElementById("menu-music");
const volume = document.getElementById("volume");

changeVolume();
menuMusic.play();

menuMusic.addEventListener("timeupdate", (e) => {
  const buffer = 0.36;

  if (menuMusic.currentTime > menuMusic.duration - buffer) {
    menuMusic.currentTime = 12.8;
    menuMusic.play();
  }
});

dateMusic.addEventListener("timeupdate", (e) => {
  const buffer = 0.35;

  if (dateMusic.currentTime > dateMusic.duration - buffer) {
    dateMusic.currentTime = 0;
    dateMusic.play();
  }
});

function changeVolume() {
  menuMusic.volume = volume.value/100/5;
  dateMusic.volume = volume.value/100/5;
}

/** 
 * Gets the data for the specified date.
 *
 * @async
 * @param {string} json - The file name of the date .json in folder ./dates.
 * @returns {Array} - The date's data.
 */
async function getDate(json) {
  const response = await fetch(`./dates/${json}`);
  const data = await response.json();

  return data;
}

/** 
 * Starts the date contained in the specified .json.
 *
 * @async
 * @param {string} json - The file name of the date .json in folder ./dates.
 */
async function startDate(json) {
  date = await getDate(json);

  await titleAnimation();

  boy = date["START"]["name"];
  nameParagraph.innerHTML = boy;
  console.log(date);
  landingPageSection.classList.add("hide");
  dateSection.classList.remove("hide");
  menuMusic.pause();

  for (let stat in stats) { // Resets every stat.
    stats[stat] = 0;
  }

  dateMusic.currentTime = 0;
  dateMusic.play();

  proceedText(0);
}

async function titleAnimation() {
  for (let i = 1; i < 4; i++) {
    titleImg.src = titleAnimSource[i];
    await delay(125)
  }
  await delay(1000)
}

/** 
 * Proceeds the text based on the choice chosen.
 *
 * @async
 * @param {number} choice - The number of the previous choice that the player made.
 */
async function proceedText(choice) {
  for (let i = 0; i < button.length; i++) { // Hides all buttons
    button[i].classList.add("hide");
  }

  currentDateKey = date[currentDateKey]["choices"][choice][1]; // Sets the key to the link of the last text.

  if (currentDateKey == "END") {
    landingPageSection.classList.remove("hide");
    dateSection.classList.add("hide");
    currentDateKey = "START";
    titleImg.src = titleAnimSource[0];
    dateMusic.pause();
    menuMusic.currentTime = 0;
    menuMusic.play();
    return;
  }

  updateBackground();
  updatePortrait(); // Updates things!
  updateStats();
  await setPrompt();
  await delay(300); // For animating the choices.
  setChoices();
}

/** 
 * Updates the players' stats.
 */
function updateStats() {
  for (let i = 0; i < date[currentDateKey]["variable"].length; i++) { // For each stat change of the current choice...
    const statToChange = date[currentDateKey]["variable"][i][0];
    const amount = date[currentDateKey]["variable"][i][1];

    stats[statToChange] += amount;
  }

  radiationStat.innerHTML = `Radiation: ${stats["radiation"]}`;
  loveStat.innerHTML = `Love: ${stats["love"]}`;
  IQ.innerHTML = `IQ: ${stats["IQ"]}`;
  experience.innerHTML = `Experience: ${stats["experience"]}`;
}

/** 
 * Sets the current text prompt.
 */
async function setPrompt() {
  let prompt = date[currentDateKey].prompt;

  for (let i = 0; i < prompt.length + 1; i++) { // Draws each letter of the prompt text one by one.
    promptText.innerHTML = prompt.slice(0, i);
    await delay(10);
  }

}

/** 
 * Sets the choice buttons' text.
 */
async function setChoices() {
  if (date[currentDateKey]["choices"] != null) { // If a choice exists...
    for (let i = 0; i < date[currentDateKey]["choices"].length; i++) { // For each choice...
      button[i].innerHTML = date[currentDateKey]["choices"][i][0] // Sets the text for the button associated with the choice..
      button[i].classList.remove("hide") // Unhides the button.
      await delay(150); // Delay (for aesthetics).
    }
  }
}

/** 
 * Updates the portait with the current emote.
 */
function updatePortrait() {
  const emote = date[currentDateKey]["emote"];

  if (emote === "game") {
    minigame.classList.remove("hide");
    portrait.classList.add("hide");

    new Canvas();
  } else {
    if (emote != "none") {
      portrait.src = `/resources/${boy}/emote/${emote}.png`;
      portrait.style.opacity = "100%";
      minigame.classList.add("hide");
      portrait.classList.remove("hide");
    } else {
      portrait.style.opacity = "0%";
      minigame.classList.add("hide");
      portrait.classList.remove("hide");
    }
  }
}

function updateBackground() {
  if (date[currentDateKey]["background"] != null) {
    let bgName = date["START"]["backgrounds"][date[currentDateKey]["background"]];
    background.src = `/resources/${boy}/background/${bgName}.png`;
  }
}
