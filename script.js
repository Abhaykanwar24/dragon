let xp = 0;
let health = 100;
let gold= 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"]; 

const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const text = document.querySelector('#text');
const xpText = document.querySelector('#xpText');        
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText'); 
const monsterStats = document.querySelector('#monsterStats');
const monsterNameText = document.querySelector('#monsterNameText');
const monsterHealthText = document.querySelector('#monsterHealthText');


const weapons = [
    {
        name:"stick",
        power: 5
    },
    {
        name:"dagger",
        power: 30
    },
    {
        name:"claw hammer",
        power: 50
    },
    {
        name:"sword",
        power: 100
    }
];

const monsters =[
    {
        name:"slime",
        level: 2,
        health: 15
    },
    {
        name:"fanged beast",
        level: 8,
        health: 60
    },
    {
        name:"dragon",
        level: 20,
        health: 300
    }
]

const locations = [
    {
        name: "town square",
        "button text": ["Go to store" ,"Go to Cave","Fight Dragon" ],
        "button functions": [goStore,goCave,fightDragon],
        text: "You are in the town square. You can see a sign that says \"store.\""
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)" ,"Buy weapon (30 gold)","Go to town square" ],
        "button functions": [buyHealth,buyWeapon,goTown],
        text: "You entered the store"
    },
    {
        name: "cave",
        "button text": ["Fight slime" ,"Fight fanged beast","Go to town square" ],
        "button functions": [fightSlime,fightBeast,goTown],
        text: "You entered the cave, You see some monster"
    },
    {
        name: "fight",
        "button text": ["Attack" ,"Dodge","Run" ],
        "button functions": [attack,dodge,goTown],
        text: "You are fighting a monster"
    },
    {
        name: "kill monster",
        "button text": ["Go to town square" ,"Go to town square","Go to town square" ],
        "button functions": [goTown,goTown,easterEgg],
        text: "The monster screams 'Arg!' as it dies. You gain experience points and find gold"

    },
    {
        name: "lose",
        "button text": ["Replay?" ,"Replay?","Replay?" ],
        "button functions": [restart,restart,restart],
        text: "You died. "

    },
    {
        name: "win",
        "button text": ["Replay?" ,"Replay?","Replay?" ],
        "button functions": [restart,restart,restart],
        text: "You defeated the dragon! You won the game "

    },
    {
		name: "easter egg",
		"button text": ["2", "8", "Go to town square?"],
		"button functions": [pickTwo, pickEight, goTown],
		text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
	}
];

// intialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(locationObject) {
    monsterStats.style.display = "none";
    button1.innerText = locationObject["button text"][0];
    button2.innerText = locationObject["button text"][1];
    button3.innerText = locationObject["button text"][2];
    button1.onclick = locationObject["button functions"][0];
    button2.onclick = locationObject["button functions"][1];
    button3.onclick = locationObject["button functions"][2];
    text.innerText = locationObject.text;
}

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}



function buyHealth(){
    if(gold>=10){
    gold -= 10;
    health +=10;
    goldText.innerText  = gold;
    healthText.innerText = health;
    }
    else{
        text.innerText = "No money to buy Health";
    }
}

function buyWeapon(){
if(currentWeapon < weapons.length-1){    
    if(gold>=30){
        gold -= 30;
        health +=10;
        currentWeapon++ ;
        goldText.innerText = gold;
        let newWeapon = weapons[currentWeapon].name;
        text.innerText = "you have a " + newWeapon + ".";
        inventory.push(newWeapon);
        text.innerText += "In your inventory you have: " + inventory;
        }
        else{
            text.innerText = "No money to buy weapon";
        }
    }else{
        text.innerText = "you already have the most powerful weapon! ";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }   
}
function sellWeapon(){
    if(inventory.length > 1){
        gold +=15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a "+ currentWeapon+ ".";
        text.innerText += " In your inventory you have " + inventory;
    }else{
        text.innerText = "Don't sell your only weapon";
    }
}
function goTown(){
    update(locations[0]);
    
}
function goFight(){
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
	monsterHealthText.innerText = monsterHealth;
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}
function fightDragon(){
    fighting = 2;
    goFight();
}
function attack(){
    text.innerText = "The "+ monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    if(isMonsterHit()){
        health -= getMonsterAttackValue(monsters[fighting].level);
    }else{
        text.innerText += " You miss.";
    }
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health<=0){
        lose();
    }else if (monsterHealth <=0){
        fighting==2 ? winGame() : defeatMonster();
    }
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon--;
	}
}
function getMonsterAttackValue(level){
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}
function isMonsterHit(){
    return Math.random() > .2 || health < 20 ;
}
function dodge(){
    text.innerText = "You dodge the attack from the "+ monsters[fighting].name + ".";
}
function lose(){
    update(locations[5]);
}
function winGame(){
    update(locations[6]);
}
function defeatMonster(){
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}
function restart() {
	xp = 0;
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ["stick"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goTown();
}
function easterEgg() {
	update(locations[7]);
}

function pickTwo() {
    pick(2);
}
   
function pickEight() {
    pick(8);
}
   
function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You win 20 gold!"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!"
        health -= 10;
        healthText.innerText = health
        if (health <= 0) {
          lose();
        }
    }
}