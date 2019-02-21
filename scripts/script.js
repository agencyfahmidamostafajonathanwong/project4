const app = {};

app.totalDeck = [];
// app.playerDeck = [];
// app.opponentDeck = [];
app.playerHand = [];
app.opponentHand = [];
app.currentPlayerCard = {};
app.currentOpponentCard = {};
app.playerLife = 0;
app.opponentLife = 0;
app.turn = 1;
app.playerBoosts = 3;

app.calcPlayerAttack = function(){
  //If player wins and there are still monsters on field
  if (app.currentPlayerCard.atk > app.currentOpponentCard.atk && app.opponentHand.length > 0){
    const overFlowDamage = app.currentPlayerCard.atk - appOpponentCard.atk;
    app.opponentLife -= overFlowDamage;
    app.removeOpponentCard();
  //If no monsters direct attack
  } else if (app.opponentHand.length === 0) {
    app.opponentLife -= app.currentPlayerCard.atk;
  //Failed attack
  } else if (app.currentOpponentCard.atk > app.currentPlayerCard.atk) {
    app.playerLife -= (appOpponentCard.atk - app.currentPlayerCard.atk);
    app.removePlayerCard();
  } else{
    app.removePlayerCard();
    app.removeOpponentCard();
  }
};

app.calcOpponentAttack = function() {
  if (app.currentOpponentCard.atk > app.currentPlayerCard.atk && app.playerHand.length > 0) {
    playerLife -= (app.currentOpponentCard.atk - app.currentPlayerCard.atk);
    app.removePlayerCard();
  } else if (app.playerHand.length ===0 ) {
    playerLife -= app.currentOpponentCard.atk;
   
  } else if (app.currentOpponentCard.atk < app.currentPlayerCard.atk && app.playerHand.length > 0) {
    opponentLife -= (app.currentPlayerCard.atk - app.currentOpponentCard.atk);
    app.removeOpponentCard();
  } else {
    app.removePlayerCard();
    app.removeOpponentCard();
    // pass tie result (destruction of both cards) to "next" function
  }
}

// Write function for nulling cards that get defeated
//If run into problem change it to name.
app.removePlayerCard = function() {
  const index = app.playerHand.findIndex(card => card.id === app.currentPlayerCard.id);
  app.playerHand.splice(index ,1);
}

app.removeOpponentCard = function() {
  const index = app.opponentHand.findIndex(card => card.id === app.currentOpponentCard.id);
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

//Execute if turn === 'opponent'
app.executeOpponentMove = function() {
  // Get a random number from 1 - currentOpponentHand size, set currentOpponentCard
  // Set highlight class on currentOpponentCard
  // Get random number from 1 - currentPlayerHand Size, set currentPlayerCard (to be attacked)
  // Set highlight class on currentPlayerCard to be attacked class.
  // Execute calc opponent attack function.
  // update player life points.
  // reset currentPlayerCard and currentOpponentCard to null.
  app.turn += 1;
}

app.clickGameBoard = () => {
  //Event delegation for gameboard.
  $('.gameboard').on('click', (e) => {
    
    if(app.turn % 2 === 1) {
      console.log("test");
      if (e.target.matches('.player-card, .player-card *')){
        const playerCard = e.target.closest('.player-card');
        const playerCardId = playerCard.dataset.cardid;
        app.currentPlayerCard = app.getPlayerCard(playerCardId);
        // right now, user clicked card
        // want to display atk points in atk li
        // also, zoom the card on click
      }
      
      if(e.target.matches('.opponent-card')){
        const opponentCard = e.target.closest('.opponent-card');
        const opponentCardId = opponentCard.dataset.cardid;
        app.currentOpponentCard = app.getOpponentCard(opponentCardId);  
      }
    }
  })
}

app.handlePlayerButtons = () => {
  $(".player-atk-button").on("click", () => {
      app.calcPlayerAttack();
      app.updatePlayerLifePoints(app.playerLife);
      app.updateOpponentLifePoints(app.updateOpponentLifePoints);
      app.turn += 1;
      executeOpponentMove();
  });

  $(".player-cancel-button").on("click", () => {
    app.currentPlayerCard = null;
    // remove styles

    app.currentOpponentCard = null;
    // remove styles
  })
}

// UI LOGIC

app.togglePlayerCardStyle = () => {
  //Sets style for currently highlighted card
}

app.toggleOpponentCardStyle = () => {
  //Sets style for current opponent card style
}

app.updatePlayerLifePoints = (lifePoints) => {
  $(".player-life-points").text(lifePoints);
}

app.updateOpponentLifePoints = (lifePoints) => {
  $(".opponent-life-points").text(lifePoints);
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
}

app.renderOpponentCards = function() {
//Renders player hand in case we don't off beginning
  // console.log(app.opponentHand);
  // hand[i].attr("src", hand[i].image_url).

  $('.opponent-card-img').toArray().forEach() {
    card.
  );
}

app.init = async() => {
  await app.getDeck();
  await app.setupPlayerCards();
  await app.setupOpponentCards();
  app.clickGameBoard();
  app.renderOpponentCards();
}

$(function() {
  app.init();
});