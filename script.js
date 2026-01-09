const flavors = [
  // Classics
  "Glazed Classic",
  "Chocolate Frosted",
  "Vanilla Frosted",
  "Cinnamon Sugar",
  "Powdered Sugar",
  "Old-Fashioned Cake",

  // Filled / Jelly / Cream
  "Strawberry Jelly Filled",
  "Raspberry Jelly Filled",
  "Grape Jelly Filled",
  "Blueberry Jelly Filled",
  "Lemon Filled",
  "Boston Cream",
  "Vanilla Cream Filled",
  "Chocolate Cream Filled",
  "Cookies & Cream Filled",
  "Peanut Butter Filled",

  // Fancy / Topped
  "Sprinkles Party",
  "Oreo Crumble",
  "S'mores Donut",
  "Salted Caramel Crunch",
  "Chocolate Ganache",
  "Toasted Coconut",
  "Churro Donut",
  "Apple Fritter",
  "French Cruller",

  // “Exotic” / Fun flavors
  "Matcha Green Tea",
  "Ube Purple Yam",
  "Mango Tango",
  "Passionfruit Glaze",
  "Lavender Honey",
  "Rose Pistachio",
  "Black Sesame",
  "Tiramisu Donut",
  "Banana Foster",
  "Key Lime Pie Donut",

  // Savory / Weird (for fun)
  "Maple Bacon",
  "Maple Sausage",
  "Everything Bagel Donut",
  "Cheddar Jalapeño",

  // Golden Glaze specials (from your assignment)
  "The IronPig (Maple Bacon)",
  "The Zoo-Nut (Animal Crackers & Frosting)",
  "The Steel Worker (Chocolate Espresso)",
  "The Crayola Classic (Tie-Dye Glaze)",

  // Seasonal / Limited
  "Pumpkin Spice",
  "Gingerbread",
  "Peppermint Mocha",
  "Strawberry Cheesecake",
  "Blueberry Pancake",
  "Peaches & Cream"
];

// Ranked Mode rarity pools (satire: more "universally loved" = rarer)

const rankedTiers = [
  {
    name: "Common",
    weight: 55,
    points: 5,
    color: "#b8b8b8",
    items: [
      "Everything Bagel Donut",
      "Cheddar Jalapeño",
      "Black Sesame",
      "Lavender Honey",
      "Rose Pistachio",
      "Ube Purple Yam",
      "Matcha Green Tea",
      "Mango Tango",
      "Passionfruit Glaze",
      "Maple Sausage",
      "Peanut Butter Filled"
    ]
  },
  {
    name: "Rare",
    weight: 28,
    points: 15,
    color: "#4da6ff",
    items: [
      "Lemon Filled",
      "Blueberry Jelly Filled",
      "Raspberry Jelly Filled",
      "Strawberry Jelly Filled",
      "Key Lime Pie Donut",
      "Banana Foster",
      "Tiramisu Donut",
      "Churro Donut",
      "Apple Fritter",
      "French Cruller"
    ]
  },
  {
    name: "Epic",
    weight: 12,
    points: 40,
    color: "#b266ff",
    items: [
      "Cookies & Cream",
      "Boston Cream",
      "Salted Caramel Crunch",
      "S'mores Donut",
      "Oreo Crumble",
      "Chocolate Ganache",
      "Toasted Coconut"
    ]
  },
  {
    name: "Legendary",
    weight: 4,
    points: 120,
    color: "#ffc857",
    items: [
      "Glazed Classic",
      "Chocolate Frosted",
      "Vanilla Frosted",
      "Cinnamon Sugar",
      "Powdered Sugar",
      "Old-Fashioned Cake"
    ]
  },
  {
    name: "Mythic",
    weight: 1,
    points: 300,
    color: "#ff85a1",
    items: [
      "The IronPig (Maple Bacon)",
      "The Steel Worker (Chocolate Espresso)",
      "The Crayola Classic (Tie-Dye Glaze)",
      "The Zoo-Nut (Animal Crackers & Frosting)"
    ]
  }
];


const slotsEl = document.getElementById("slots");
const qtyPreset = document.getElementById("qtyPreset");
const customWrap = document.getElementById("customWrap");
const customQty = document.getElementById("customQty");
const spinBtn = document.getElementById("spinBtn");
const slotCountEl = document.getElementById("slotCount");

function getQty(){
  if(qtyPreset.value === "custom"){
    let n = parseInt(customQty.value || 12, 10);
    n = Math.max(2, Math.min(100, n)); // ✅ now allows up to 100
    return n;
  }
  return parseInt(qtyPreset.value, 10);
}

function randomFlavor(){
  return flavors[Math.floor(Math.random() * flavors.length)];
}

function weightedPickTier(){
  const total = rankedTiers.reduce((s,t)=>s+t.weight,0);
  let r = Math.random() * total;
  for(const tier of rankedTiers){
    r -= tier.weight;
    if(r <= 0) return tier;
  }
  return rankedTiers[0];
}

function rankedRoll(){
  const tier = weightedPickTier();
  const item = tier.items[Math.floor(Math.random() * tier.items.length)];
  return { flavor: item, tier: tier.name, points: tier.points, color: tier.color };
}


function buildSlots(n){
  slotsEl.innerHTML = "";
  slotCountEl.textContent = n;

  for(let i = 0; i < n; i++){
    const slot = document.createElement("div");
    slot.className = "slot";

    const top = document.createElement("div");
    top.className = "slotTop";

    const num = document.createElement("div");
    num.className = "slotNum";
    num.textContent = `Slot ${i+1}`;

    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = "Flavor";

    top.appendChild(num);
    top.appendChild(pill);

    // Reel window
    const reelWindow = document.createElement("div");
    reelWindow.className = "reelWindow";

    const reel = document.createElement("div");
    reel.className = "reel";

    // Start with one visible item
    const item = document.createElement("div");
    item.className = "reelItem";
    item.textContent = "—";
    reel.appendChild(item);

    reelWindow.appendChild(reel);

    slot.appendChild(top);
    slot.appendChild(reelWindow);
    slotsEl.appendChild(slot);
  }
}

// Helper: build a “strip” of reel items ending on finalFlavor
function makeReelStrip(finalFlavor, minItems = 40){
  const stripLen = minItems + Math.floor(Math.random() * 20); // 40–59
  const strip = [];

  for(let i = 0; i < stripLen - 1; i++){
    strip.push(randomFlavor());
  }
  strip.push(finalFlavor);
  return strip;
}


function spin(){
  const slotDivs = Array.from(document.querySelectorAll(".slot"));
  const itemHeight = 44; // must match CSS .reelItem height

  // Disable buttons during spin
  spinBtn.disabled = true;
  spinBtn.classList.add("disabled");

  slotDivs.forEach((slot, idx) => {
    const reel = slot.querySelector(".reel");

    // Decide final flavor for this slot
    const final = randomFlavor();

    // Build strip and render it
    const strip = makeReelStrip(final, 20);
    reel.innerHTML = strip.map(f => `<div class="reelItem">${f}</div>`).join("");

    // Reset position instantly
    reel.style.transition = "none";
    reel.style.transform = "translateY(0px)";

    // Force layout so the reset applies before the animation
    reel.offsetHeight;

    // Add spinning class (blur/glow)
    slot.classList.remove("stopping");
    slot.classList.add("spinning");

    // Animate to the final item:
    // translateY negative so content moves UP (looks like words coming DOWN)
    const endY = -((strip.length - 1) * itemHeight);

    // Stagger and vary durations for drama
	  const base = 2800;              // longer base spin
	  const extra = idx * 220;         // bigger stagger between reels
	  const variance = Math.random() * 900; // randomness for suspense
	  const duration = base + extra + variance; // ~2.8s to ~6.5s (depending on count)


    // Easing that slows down hard at the end
    // (big “brake” feel)
    const easing = "cubic-bezier(.08,.82,.15,1)";

    // Start animation on next frame
    requestAnimationFrame(() => {
      reel.style.transition = `transform ${duration}ms ${easing}`;
      reel.style.transform = `translateY(${endY}px)`;
    });

    // Clean up after it stops
    window.setTimeout(() => {
      slot.classList.remove("spinning");
      slot.classList.add("stopping");
    }, duration - 120);
  });

  // Re-enable after the longest possible slot finishes
  const maxDuration = 2800 + (slotDivs.length - 1) * 220 + 900;
  window.setTimeout(() => {
    spinBtn.disabled = false;
    spinBtn.classList.remove("disabled");
  }, maxDuration + 50);
}

// Events
qtyPreset.addEventListener("change", () => {
  if(qtyPreset.value === "custom"){
    customWrap.style.display = "flex";
  } else {
    customWrap.style.display = "none";
  }
  buildSlots(getQty());
});

customQty.addEventListener("change", () => {
  buildSlots(getQty());
});

spinBtn.addEventListener("click", spin);

// Init
buildSlots(getQty());

