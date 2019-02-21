const app = {};

app.totalDeck = [];
// app.playerDeck = [];
// app.opponentDeck = [];
app.playerHand = [];
app.opponentHand = [];
app.currentPlayerCard = null;
app.currentOpponentCard = null;
app.playerLife = 2000;
app.opponentLife = 2000;
app.turn = 1;
app.playerBoosts = 3;

app.calcPlayerAttack = function(){
  const playerAttack = parseInt(app.currentPlayerCard.atk,10);
  const opponentAttack = parseInt(app.currentOpponentCard.atk,10);
  //If player wins and there are still monsters on field
  if (playerAttack > opponentAttack && app.opponentHand.length > 0){
    const overFlowDamage = playerAttack -opponentAttack;
    app.opponentLife -= overFlowDamage;
    app.removeOpponentCard();
  //If no monsters direct attack
  } else if (app.opponentHand.length === 0) { 
    app.opponentLife -= playerAttack;
  //Failed attack
  } else if (opponentAttack > playerAttack) {
    app.playerLife -= (opponentAttack - playerAttack);
    app.removePlayerCard();
  } else{
    app.removePlayerCard();
    app.removeOpponentCard();
  }
};

app.calcOpponentAttack = function() {
  const playerAttack = parseInt(app.currentPlayerCard.atk, 10);
  const opponentAttack = parseInt(app.currentOpponentCard.atk, 10);
  //If opponent wins and there are still monsters on field
  if (opponentAttack > playerAttack && app.playerHand.length > 0) {
    const overFlowDamage = opponentAttack - playerAttack;
    app.playerLife -= overFlowDamage;
    app.removeOpponentCard();
    //If no monsters direct attack
  } else if (app.playerHand.length === 0) {
    app.playerLife -= opponentAttack;
    //Failed attack
  } else if (playerAttack > opponentAttack) {
    app.opponentLife -= (playerAttack - opponentAttack);
    app.removePlayerCard();
  } else {
    app.removePlayerCard();
    app.removeOpponentCard();
  }
}

// Write function for nulling cards that get defeated
//If run into problem change it to name.
app.removePlayerCard = function() {
  const index = app.playerHand.findIndex(card => card.id === app.currentPlayerCard.id);
  // console.log($(`li[data-id='${app.currentPlayerCard.id}']`));
  $(`li[data-id='${app.currentPlayerCard.id}']`).remove();
  app.playerHand.splice(index ,1);
}

app.removeOpponentCard = function() {
  const index = app.opponentHand.findIndex(card => card.id === app.currentOpponentCard.id);
  // console.log($(`li[data-id='${app.currentOpponentCard.id}']`));
  $(`li[data-id='${app.currentOpponentCard.id}']`).remove();
  app.opponentHand.splice(index , 1);
}

app.getPlayerCard = function(id){
  return this.playerHand.find(card => card.id ===id);
}

app.getOpponentCard = function(id){
  return this.opponentHand.find(card => card.id === id);
}

app.drawPlayerCard = () => {
  //Create random number at playerDeck.length
  //Use it to select a random card from player deck. and store in variable
  //Splice it from the playerDeck (randomIndex,1)
  //Push it onto the playerHand array.
  //return the new card
}

app.getDeck = async function(){

  const response = await $.ajax({
    url : 'https://db.ygoprodeck.com/api/v2/cardinfo.php?',
    method : "GET",
    type : "JSON",

    data : {
      type : "Normal Monster"
    }
  });

  // console.log(response[0]);
  app.totalDeck = response[0];
  //Ajax call to deck
  //filter deck by attack power
  //set this.totalDeck to filtered array
}

app.setupGame = function(){

  //call setupPlayerCards
  //call setupOpponentCards
  //renderPlayingField() ?
}

//Sets up the player hand from totalDeck
app.setupPlayerCards = function(){
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * app.totalDeck.length);
    app.playerHand.push(app.totalDeck[randomIndex]);
    app.totalDeck.splice(randomIndex, 1);
  }
}

//Sets up initial opponent hand from totalDeck
app.setupOpponentCards = function(){
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * app.totalDeck.length);
    app.opponentHand.push(app.totalDeck[randomIndex]);
    app.totalDeck.splice(randomIndex, 1);
  }
}

app.resetCurrentCards = function(){
  app.currentPlayerCard = null;
  app.currentOpponentCard = null;
}

//Execute if turn === 'opponent'
app.executeOpponentMove = function() {
  // const playerAttack = parseInt(app.currentPlayerCard.atk, 10);
  // const opponentAttack = parseInt(app.currentOpponentCard.atk, 10);
  // // AFTER DEALING WITH LOGIC ON HOW TO DESTROY CARD AND UPDATING FIRST-CHILD LI, COME BACK HERE TO STATE THAT chosenAttackWithCard AND chosenToAttack CARDS ARE THE FIRST-CHILD LI'S IN THE RESPECTIVE UL'S.
  // const chosenAttackWithCard = app.opponentHand[0];
  // const chosenToAttackCard = app.playerHand[0];
  // let highestAtkDifference = 0;

  // // Get a random number from 1 - currentOpponentHand size, set currentOpponentCard
  // if (app.turn % 2 === 0 && playerHand.length != 0) {
  //   // determining which card to choose to attack and which card to choose to attack with
  //   for ( i = 0; i < playerHand.length; i++ ) {
  //     for ( j = 0; j < opponentHand.length; j++ ) {
  //       if ( opponentAttack > playerAttack ) {
  //         let atkDifference = opponentAttack - playerAttack;
  //         chosenAttackWithCard = ;
  //         chosenToAttackCard = ;

  //         if (atkDifference > highestAtkDifference) {
  //           chosenAttackWithCard = app.getOpponentCard();
  //           chosenToAttackCard = app.getPlayerCard();
  //         }

  //         highestAtkDifference = math.Max((highestAtkDIfference, atkDifference);

  //       }
  //     }
  //   }
  // }

  // // Set highlight class on currentOpponentCard
  // // Get random number from 1 - currentPlayerHand Size, set currentPlayerCard (to be attacked)
  // // Set highlight class on currentPlayerCard to be attacked class.
  // // Execute calc opponent attack function.
  // // update player life points.
  // // reset currentPlayerCard and currentOpponentCard to null.
  // app.turn += 1;
}

app.clickGameBoard = () => {
  //Event delegation for gameboard.
  $('.gameboard').on('click', (e) => {
    
    if(app.turn % 2 === 1) {
      if (e.target.matches('.player-card, .player-card *')){  
        const playerCard = e.target.closest('.player-card');
        const playerCardId = playerCard.dataset.id; 

       
        app.currentPlayerCard = app.getPlayerCard(playerCardId);
        // console.log(`current player card is ${parseInt(app.currentPlayerCard.atk,10)}`);
        app.toggleHighlight('player', playerCard);
        app.resetPlayerButtons();
      }
      
      if(e.target.matches('.opponent-card, .opponent-card *')){
        const opponentCard = e.target.closest('.opponent-card');
        const opponentCardId = opponentCard.dataset.id;
        app.currentOpponentCard = app.getOpponentCard(opponentCardId);
        // console.log(`current opponent card is ${parseInt(app.currentOpponentCard.atk,10)}`);
        app.toggleHighlight('opponent', opponentCard);
        app.resetPlayerButtons();
      }
    }
  })
}

app.handlePlayerButtons = () => {
  $(".player-atk-button").on("click", () => {

      app.calcPlayerAttack();
      app.updateLifePoints();
      app.resetCurrentCards();
      app.resetPlayerButtons();
      app.toggleHighlight();
      app.turn += 1;
      // console.log("the turn is " + app.turn);
      // executeOpponentMove();
  });

  $(".player-cancel-button").on("click", () => {
    app.toggleHighlight();
    app.resetCurrentCards();
    app.resetPlayerButtons(); 
  });
}



// UI LOGIC

app.resetPlayerButtons = function(){
  app.toggleAttackButton();
  app.toggleCancelButton();
}

app.toggleAttackButton = function() {
  if(app.currentOpponentCard && app.currentPlayerCard) {
    $('.player-atk-button').attr('disabled', false)
  } else {
    $('.player-atk-button').attr('disabled', true)
  }
}

app.toggleCancelButton = function () {
  if (app.currentOpponentCard && app.currentPlayerCard) {
    $('.player-cancel-button').attr('disabled', false)
    
  } else {
    $('.player-cancel-button').attr('disabled', true)
  }
}

app.toggleHighlight = function(cardType, currentCard){
  if (cardType === 'player'){
    $(".player-card").toArray().forEach(card => {
      $(card).removeClass('highlight');
    });

    $(currentCard).toggleClass('highlight');
  } else if(cardType === 'opponent') {
    $(".opponent-card").toArray().forEach(card => {
      $(card).removeClass('highlight');
    });

    $(currentCard).toggleClass('highlight');
  } else {
    $(".player-card").toArray().forEach(card => {
      $(card).removeClass('highlight');
    });

    $(".opponent-card").toArray().forEach(card => {
      $(card).removeClass('highlight');
    });
  }
}

app.updateLifePoints = () => {
  $(".player-life-points").text(app.playerLife);
  $(".opponent-life-points").text(app.opponentLife);
}

app.clearPlayerCardInterface = () => {
  //Removes a player card from UI
}

app.clearOpponentCardInterface = () => {
  //Removes opponent card from UI
}

app.renderNewPlayerCard = () => {
  //Adds a new player card to the field
}

app.renderNewOpponentCard = () => {
  //Adds a new opponent card to the field
}

app.renderPlayerCards = () => {
//Renders player hand in case we don't off beginning
  $('.player-card-img').toArray().forEach(function(card, index) {
    $(card).attr("src", app.playerHand[index].image_url);
    $(card).attr("alt", app.playerHand[index].name);
    
  }) 
  $('.player-card').toArray().forEach(function(card, index) {
    $(card).attr("data-id", app.playerHand[index].id);
  });
}

app.renderOpponentCards = function() {
//Renders player hand in case we don't off beginning
  
  $('.opponent-card-img').toArray().forEach(function(card, index) {
    $(card).attr("src", app.opponentHand[index].image_url);
    $(card).attr("alt", app.opponentHand[index].name);
  }) 

  $('.opponent-card').toArray().forEach(function(card, index) {
    $(card).attr("data-id", app.opponentHand[index].id);
  });
}

app.init = async() => {
  await app.getDeck();
  await app.setupPlayerCards();
  await app.setupOpponentCards();
  app.handlePlayerButtons();
  app.clickGameBoard();
  app.renderOpponentCards();
  app.renderPlayerCards();
  app.toggleAttackButton();
  app.toggleCancelButton();
}

$(function() {
  app.init();
});