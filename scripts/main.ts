import { world, system } from "@minecraft/server";

// globals
let isSassy = false;
let hasRespondedRecently = false;
let hasTiredRespondedRecently = false;
let responseTime = 0;
let timeBetweenResponses = 50;
let goodResponses: string[] = [
  "Yes, definitely.",
  "It is certain.",
  "Without a doubt.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Dont count on it.",
  "My sources say no.",
  "Outlook not so good.",
];

let sassyResponses: string[] = [
  "Are you serious?",
  "Not in a million years.",
  "You wish.",
  "Ask someone who cares.",
  "Dont hold your breath.",
  "Yeah, right.",
  "In your dreams.",
  "Not a chance.",
  "Why do you even bother?",
  "Absolutely not.",
];

let tiredResponses: string[] = [
  "Seriously, again?",
  "Give it a rest.",
  "Im tired, ask later.",
  "Not this again…",
  "Do I look like I care?",
  "Enough already!",
  "Stop bothering me.",
  "Ask someone else.",
  "Im done answering.",
  "Please, no more questions.",
];

let sassyDestroyResponses: string[] = [
  "Oh, youre still here? Bye.",
  "Finally, some peace and quiet.",
  "Dont let the door hit you on the way out.",
  "Im out, deal with it.",
  "Later, if I care.",
  "Good luck without me.",
  "Im done with your questions.",
  "See ya, wouldnt wanna be ya.",
  "Im off, figure it out yourself.",
  "Bye, Felicia.",
];

let goodDestroyResponses: string[] = [
  "Im outta here.",
  "Peace out!",
  "Catch you later.",
  "Im done for today.",
  "See you never.",
  "Time to roll.",
  "Im off the clock.",
  "Goodbye, and good luck.",
  "Thats all, folks!",
  "Im signing off.",
];

function init() {
  try {
    subscribeEvents();
  } catch (e) {
    console.error(e);
  }
}

function subscribeEvents() {
  world.afterEvents.entityHitBlock.subscribe((data) => {
    if (
      (!hasRespondedRecently || responseTime + timeBetweenResponses <= world.getTimeOfDay()) &&
      data.hitBlock.typeId === "eightball:eightball"
    ) {
      responseTime = world.getTimeOfDay();
      hasRespondedRecently = true;
      hasTiredRespondedRecently = false;
      postRandomString(isSassy ? sassyResponses : goodResponses);
    } else if (!hasTiredRespondedRecently && data.hitBlock.typeId === "eightball:eightball") {
      hasTiredRespondedRecently = true;
      isSassy = true;
      postRandomString(tiredResponses);
    }
  });

  world.beforeEvents.playerBreakBlock.subscribe((data) => {
    if (data.block.typeId === "eightball:eightball") {
      postRandomString(isSassy ? sassyDestroyResponses : goodDestroyResponses);
      isSassy = false;
      hasRespondedRecently = false;
    }
  });
}

function postRandomString(arr: string[]) {
  if (arr.length === 0) return "";
  const randomIndex = Math.floor(Math.random() * arr.length);
  world.sendMessage(arr[randomIndex]);
}

system.run(init);
