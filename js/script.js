
let game = {
    "player": { 'scorespan': '#player_scorespan', 'div': '#player', score: 0 },
    "cpu": { 'scorespan': '#cpu_scorespan', 'div': '#cpu', score: 0 },
    "card": ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    "cards_map": { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": [1, 11] },
    "wins": 0,
    "losses": 0,
    "draws": 0,
};

const PLAYER = game['player'];
const CPU = game['cpu'];
let Stand_state = false; //changes state when stand buttpn is pressed
let turnsOver = false; //variable to keep cpu turns into considerations

$("#hit_button").on('click', hit);
$("#deal_button").on('click', deal);
$("#stand_button").on('click', stand);
$("#reset_game").on('click', reset_game);

function hit() {
    if (Stand_state === false) {
        $("#current_state").text("Let's Play").css("color", "white");
        if (PLAYER['score'] < 21) {
            let card = random_card();
            updateScore(card, PLAYER);
            showCard(card, PLAYER);
            showScore(PLAYER);
        }
    }
}

function deal() {
    remove();
    updateTable();

}

function stand() {
    //compute winner
    if (PLAYER['score'] > 0) {
        Stand_state = true;
        while (Stand_state === true && turnsOver === false) {
            let card = random_card();
            updateScore(card, CPU);
            showCard(card, CPU);
            showScore(CPU);
            if (CPU['score'] > 15) {
                let winner = decideWinner();
                showResult(winner);
                turnsOver = true;
            }
        }
    }
}
function random_card() {
    //Function to generate random cards
    let randomIndex = Math.floor(Math.random() * 13);
    return game['card'][randomIndex];

}


function updateScore(card, active_player) {
    //Function to update score which is later used for comparision
    if (card === 'A') {
        if (active_player['score'] + game['cards_map'][card][1] > 21) {
            active_player['score'] += game['cards_map'][card][0];
        }
        else {
            active_player['score'] += game['cards_map'][card][1];
        }
    }
    else {
        active_player['score'] += game['cards_map'][card];
    }

}


function showScore(active_player) {
    //Function to display the score in ths spans created
    if (active_player['score'] > 21) {
        $(active_player['scorespan']).text("Bursted");
        $(active_player['scorespan']).css("color", "Red");

    }
    else if (active_player['score'] < 21) {
        $(active_player['scorespan']).text(active_player['score']);
    }
    else {
        $(active_player['scorespan']).text("BlackJack");
        $(active_player['scorespan']).css("color", "Orange");
    }
}

function showCard(card, active_player) {
    //Function to display cards pn front-end
    if (active_player['score'] <= 21) {
        let img = new Image();
        img.src = `images/${card}.png`;
        $(active_player['div']).append(img);
    }
}

function remove() {

    if (turnsOver === true) {
        Stand_state = false;
        $("#current_state").text("Let's Play").css("color", "white");
        //Remove all card images
        str = PLAYER['div'] + " img";
        $(str).remove();
        str = CPU['div'] + " img";
        $(str).remove();

        //Reset score for both player and cpu to 0
        PLAYER['score'] = 0;
        CPU['score'] = 0;

        //Reset score displayed on frontend for both player and cpu to 0
        $(PLAYER['scorespan']).text(PLAYER['score']);
        $(CPU['scorespan']).text(CPU['score']);

        $(PLAYER['scorespan']).css("color", "white");
        $(CPU['scorespan']).css("color", "white");
        turnsOver = false;
    }

}

function decideWinner() {
    let winner;

    if (PLAYER['score'] <= 21) {
        if (PLAYER['score'] > CPU['score'] || CPU['score'] > 21) {
            winner = PLAYER;
            game["wins"]++;
        }

        else if (PLAYER['score'] < CPU['score']) {
            winner = CPU;
            game["losses"]++;
        }

        else if (PLAYER['score'] === CPU['score']) {

            game["draws"]++;
        }
    }

    else if (PLAYER['score'] > 21 && CPU['score'] <= 21) {
        winner = CPU;
        game["losses"]++;
    }

    else if (PLAYER['score'] > 21 && CPU['score'] > 21) {

        game["draws"]++;
    }
    console.log("winner is", winner);
    return winner;

}

function showResult(winner) {
    let message, messageColor;
    if (winner === PLAYER) {
        message = "You won !";
        messageColor = "blue";
    }
    else if (winner === CPU) {
        message = "CPU won !";
        messageColor = "red";
    }
    else {
        message = "Its a draw !";
        messageColor = "orange";
    }

    $("#current_state").text(message);
    $("#current_state").css("color", messageColor);

}

function updateTable() {
    $("#wins").text(game["wins"]);
    $("#losses").text(game["losses"]);
    $("#draws").text(game["draws"]);
}

function reset_game() {

    $("#current_state").text("Let's Play").css("color", "white");
    //Remove all card images
    str = PLAYER['div'] + " img";
    $(str).remove();
    str = CPU['div'] + " img";
    $(str).remove();

    //Reset score for both player and cpu to 0
    PLAYER['score'] = 0;
    CPU['score'] = 0;
    game["wins"] = 0;
    game["losses"] = 0;
    game["draws"] = 0;
    $("#wins").text(game["wins"]);
    $("#losses").text(game["losses"]);
    $("#draws").text(game["draws"]);
    //Reset score displayed on frontend for both player and cpu to 0
    $(PLAYER['scorespan']).text(PLAYER['score']);
    $(CPU['scorespan']).text(CPU['score']);

    $(PLAYER['scorespan']).css("color", "white");
    $(CPU['scorespan']).css("color", "white");
}