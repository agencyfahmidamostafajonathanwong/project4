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
  
  // app.currentOpponentCard = app.opponentHand[0];
  // app.currentPlayerCard = app.playerHand[0];
  // let highestAtkDifference = 0;
  //   for ( i = 0; i < app.opponentHand.length; i++ ) {
  //     for ( j = 0; j < app.playerHand.length; j++ ) {
  //       if(parseInt(app.opponentHand[i].atk,10) > parseInt(app.playerHand[j].atk,10)){
  //         let atkDifference = parseInt(app.opponentHand[i].atk,10) - parseInt(app.playerHand[j].atk,10);

  //         console.log(`attack difference ${atkDifference}`);
  //         let oldAttackDifference = highestAtkDifference;
  //         console.log(`old attack difference ${oldAttackDifference}`);
  //         highestAtkDifference = Math.max(oldAttackDifference, atkDifference);
  //         console.log(`highest attack difference ${highestAtkDifference}`);
  //         if(highestAtkDifference > oldAttackDifference){
  //           app.currentOpponentCard = app.getOpponentCard(app.opponentHand[i].id);
  //           app.currentPlayerCard = app.getPlayerCard(app.playerHand[j].id);
  //         }
  //         console.log(app.currentOpponentCard.name, app.currentOpponentCard.atk );
  //         console.log(app.currentPlayerCard.name, app.currentPlayerCard.atk );
  //         console.log("============================================")
  //       }
  //   }
  // }  
  app.currentOpponentCard = app.opponentHand[0];
  app.currentPlayerCard = app.playerHand[0];
  
  for(let i = 1; i < app.opponentHand.length; i++) { 
    if(parseInt(app.opponentHand[i].atk,10) > parseInt(app.currentOpponentCard.atk,10)){
      app.currentOpponentCard = app.opponentHand[i];
    } 
  }

  for(let i = 1; i < app.playerHand.length; i++) { 
    if(parseInt(app.playerHand[i].atk,10) < parseInt(app.currentPlayerCard.atk,10)){
      app.currentPlayerCard = app.playerHand[i];
    } 
  }
  //Note for Fahmida! Accessing the Nodes for the player and opponent card here
  // Toggle the highlight class on them and use setTimeout to create a delay 
  
  const playerId = app.currentPlayerCard.id;
  const opponentId = app.currentOpponentCard.id;
  console.log(playerId);
  console.log(opponentId);
  const playerCardNode = $(`[data-id="${playerId}"]`);
  const opponentCardNode = $(`[data-id="${opponentId}"]`);

  app.toggleOpponentHighlightDelay(opponentCardNode);
  app.toggleHighlight("opponent", opponentCardNode);
  app.togglePlayerHighlightDelay(playerCardNode);
  app.toggleHighlight("player", playerCardNode);
  setTimeout(() => {
    app.toggleOpponentHighlightDelay(opponentCardNode);
    app.togglePlayerHighlightDelay(playerCardNode);
    app.toggleHighlight();
    app.currentPlayerCard.atk = parseInt(app.currentPlayerCard.atk,10);
    app.currentOpponentCard.atk = parseInt(app.currentOpponentCard.atk);
    if (app.currentOpponentCard.atk > app.currentPlayerCard.atk){
      const overFlowDamage = app.currentOpponentCard.atk - app.currentPlayerCard.atk;
      app.playerLife -= overFlowDamage;
      app.removePlayerCard();
      console.log("opponent wins");
    } else if (app.playerHand.length === 0) {
      app.playerLife -= app.currentOpponentCard.atk;
      //Failed attack
    } else if (app.currentPlayerCard.atk > app.currentOpponentCard.atk) {
      app.opponentLife -= (app.currentPlayerCard.atk - app.currentOpponentCard.atk);
      console.log("player wins");
      app.removeOpponentCard();
    } else {
      console.log("tie");
      app.removePlayerCard();
      app.removeOpponentCard();
    }
    app.turn += 1;
  },7000) 
  console.log(app.currentOpponentCard.name, app.currentOpponentCard.atk );
  console.log(app.currentPlayerCard.name, app.currentPlayerCard.atk );
  console.log("============================================")
}


//Removes player card from the UI and database.
app.removePlayerCard = function() {
  const index = app.playerHand.findIndex(card => card.id === app.currentPlayerCard.id);
  // console.log($(`li[data-id="${app.currentPlayerCard.id}"]`));
  $(`li[data-id="${app.currentPlayerCard.id}"]`).remove();
  app.playerHand.splice(index ,1);
}

//Removes Opponent card from the UI and database
app.removeOpponentCard = function() {
  const index = app.opponentHand.findIndex(card => card.id === app.currentOpponentCard.id);
  $(`li[data-id="${app.currentOpponentCard.id}"]`).remove();
  app.opponentHand.splice(index , 1);
}

//Finds and returns a player card from hand
app.getPlayerCard = function(id) {
  return this.playerHand.find(card => card.id ===id);
}

//Find and returns an opponent card from hand
app.getOpponentCard = function(id) {
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
    url : "https://db.ygoprodeck.com/api/v2/cardinfo.php?",
    method : "GET",
    type : "JSON",

    data : {
      type : "Normal Monster"
    }
  });
  app.totalDeck = response[0];

  //filter deck by attack power
  //set this.totalDeck to filtered array
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

//Sets the current player and opponent card to null
app.resetCurrentCards = function(){
  app.currentPlayerCard = null;
  app.currentOpponentCard = null;
}

//Executes computer move
app.executeOpponentMove = function() {
  app.calcOpponentAttack();
  app.updateLifePoints();
  
}


  // // Set highlight class on currentOpponentCard
  // // Get random number from 1 - currentPlayerHand Size, set currentPlayerCard (to be attacked)
  // // Set highlight class on currentPlayerCard to be attacked class.
  // // Execute calc opponent attack function.
  // // update player life points.
  // // reset currentPlayerCard and currentOpponentCard to null.
  
app.clickGameBoard = () => {
  //Event delegation for gameboard.
  $(".gameboard").on("click", (e) => {
    
    if(app.turn % 2 === 1) {
      if (e.target.matches(".player-card, .player-card *")){  
        const playerCard = e.target.closest(".player-card");
        const playerCardId = playerCard.dataset.id; 
        app.currentPlayerCard = app.getPlayerCard(playerCardId);
        app.toggleHighlight("player", playerCard);
        app.resetPlayerButtons();
      }
      
      if(e.target.matches(".opponent-card, .opponent-card *")){
        const opponentCard = e.target.closest(".opponent-card");
        const opponentCardId = opponentCard.dataset.id;
        app.currentOpponentCard = app.getOpponentCard(opponentCardId);
        app.toggleHighlight("opponent", opponentCard);
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
      app.executeOpponentMove();
  });

  $(".player-cancel-button").on("click", () => {
    app.toggleHighlight();
    app.resetCurrentCards();
    app.resetPlayerButtons(); 
  });
}

// UI LOGIC

//Resets the player buttons to disabled
app.resetPlayerButtons = function(){
  app.toggleAttackButton();
  app.toggleCancelButton();
}

//Toggles attack button depending on if player has selected cards
app.toggleAttackButton = function() {
  if(app.currentOpponentCard && app.currentPlayerCard) {
    $(".player-atk-button").attr("disabled", false)
  } else {
    $(".player-atk-button").attr("disabled", true)
  }
}

//Toggles cancel button if player has selected a player card and opponent card
app.toggleCancelButton = function () {
  if (app.currentOpponentCard && app.currentPlayerCard) {
    $(".player-cancel-button").attr("disabled", false)
  } else {
    $(".player-cancel-button").attr("disabled", true)
  }
}

//Toggles the highlight if user clicks cancel or on new card.
app.toggleHighlight = function(cardType, currentCard){
  if (cardType === "player"){ //Toggles player card highlights
    $(".player-card").toArray().forEach(card => {
      $(card).removeClass("highlight");
    });

    $(currentCard).toggleClass("highlight");
  } else if(cardType === "opponent") { //toggles opponent card highlights.
    $(".opponent-card").toArray().forEach(card => {
      $(card).removeClass("highlight");
    });
    // $(currentCard).toggleClass("player-transition-delay");
    // $(currentCard).toggleClass("opponent-transition-delay");
    $(currentCard).toggleClass("highlight");
  } else { //Removes the highlight for both opponent and player cards.
    console.log("removing player highlights");
    $(".player-card").toArray().forEach(card => {
      $(card).removeClass("highlight");
    });

    console.log('removing opponent highlights');
    $(".opponent-card").toArray().forEach(card => {
      $(card).removeClass("highlight");
    });
  }
}

app.toggleOpponentHighlightDelay = function(opponentCardNode) {
  console.log('opponent transition delay added');
  $(opponentCardNode).toggleClass('opponent-transition-delay');
  console.log(opponentCardNode);
}

app.togglePlayerHighlightDelay = function (playerCardNode) {
  console.log('player transition delay added');
  $(playerCardNode).toggleClass('player-transition-delay');
  console.log(playerCardNode);
}

app.updateLifePoints = () => {
  $(".player-life-points").text(app.playerLife);
  $(".opponent-life-points").text(app.opponentLife);
}

app.renderNewPlayerCard = () => {
  //Adds a new player card to the field
}

app.renderNewOpponentCard = () => {
  //Adds a new opponent card to the field
}

app.renderPlayerCards = () => {
  $(".player-card-img").toArray().forEach(function(card, index) {
    $(card).attr("src", app.playerHand[index].image_url);
    $(card).attr("alt", app.playerHand[index].name);
    
  }) 
  $(".player-card").toArray().forEach(function(card, index) {
    $(card).attr("data-id", app.playerHand[index].id);
  });
}

app.renderOpponentCards = function() {

  $(".opponent-card-img").toArray().forEach(function(card, index) {
    $(card).attr("src", app.opponentHand[index].image_url);
    $(card).attr("alt", app.opponentHand[index].name);
  }) 

  $(".opponent-card").toArray().forEach(function(card, index) {
    $(card).attr("data-id", app.opponentHand[index].id);
    console.log(card);
  });
}

app.init = async() => {
  await app.getDeck();
  app.setupPlayerCards();
  app.setupOpponentCards();
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