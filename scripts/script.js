const app = {};

app.totalDeck = [];
app.playerHand = [];
app.opponentHand = [];
app.currentPlayerCard = null;
app.currentOpponentCard = null;
app.playerLife = 3000;
app.opponentLife = 3000;
app.turn = 1;

//Populates the total deck from API.
app.getDeck = async () => {
  try {
    const response = await $.ajax({
      url: "https://db.ygoprodeck.com/api/v2/cardinfo.php?",
      method: "GET",
      type: "JSON",

      data: {
        type: "Normal Monster"
      }
    });

    app.totalDeck = response[0];
  } catch (error) {
    throw error;
  }
}

//Sets up the player hand from totalDeck
app.setupPlayerCards = () => {
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * app.totalDeck.length);
    app.playerHand.push(app.totalDeck[randomIndex]);
    app.totalDeck.splice(randomIndex, 1);
  }
}

//Sets up initial opponent hand from totalDeck
app.setupOpponentCards = () => {
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * app.totalDeck.length);
    app.opponentHand.push(app.totalDeck[randomIndex]);
    app.totalDeck.splice(randomIndex, 1);
  }
}

app.drawCard = (type) => {
    const randomIndex = Math.floor(Math.random() * app.totalDeck.length);
    if(type==='player'){
      app.playerHand.push(app.totalDeck[randomIndex]);
    } else {
      app.opponentHand.push(app.totalDeck[randomIndex]);
    }
    app.totalDeck.splice(randomIndex, 1);
}

//Calculates playerAttack turn.
app.calcPlayerAttack =  () => {
  const playerAttack = parseInt(app.currentPlayerCard.atk, 10);
  const opponentAttack = parseInt(app.currentOpponentCard.atk, 10);
  //If player wins and there are still monsters on field
  if (playerAttack > opponentAttack && app.opponentHand.length > 0) {
    const overFlowDamage = playerAttack - opponentAttack;
    app.opponentLife -= overFlowDamage;
    app.removeOpponentCard();
    app.drawCard("opponent");
    //If no monsters direct attack
  } else if (app.opponentHand.length === 0) {
    app.opponentLife -= playerAttack;
    //Failed attack
  } else if (opponentAttack > playerAttack) {
    app.playerLife -= (opponentAttack - playerAttack);
    app.removePlayerCard();
    app.drawCard("player");
    //Tie!
  } else {
    app.removePlayerCard();
    app.removeOpponentCard();
    app.drawCard("opponent");
    app.drawCard("player");
  }
  app.renderPlayerCards();
  app.renderOpponentCards();
};


//starts computer attack.
app.calcOpponentAttack = function () {
  //Set current cards to first card by default
  app.currentOpponentCard = app.opponentHand[0];
  app.currentPlayerCard = app.playerHand[0];
  let playerCardNode;
  let opponentCardNode;
  //Small timeout incase highest attack power monster is attacked. 
  //Gives time for the transform to toggle off between turns.
  setTimeout(() => {
    //Finds highest attack opponent card and sets to current opponent card.
    for (let i = 1; i < app.opponentHand.length; i++) {
      if (parseInt(app.opponentHand[i].atk, 10) > parseInt(app.currentOpponentCard.atk, 10)) {
        app.currentOpponentCard = app.opponentHand[i];
      }
    }
    //Finds lowest attack player card and sets to current player card
    for (let i = 1; i < app.playerHand.length; i++) {
      if (parseInt(app.playerHand[i].atk, 10) < parseInt(app.currentPlayerCard.atk, 10)) {
        app.currentPlayerCard = app.playerHand[i];
      }
    }
  
    const playerId = app.currentPlayerCard.id;
    const opponentId = app.currentOpponentCard.id;
    playerCardNode = $(`[data-id="${playerId}"]`);
    opponentCardNode = $(`[data-id="${opponentId}"]`);
    
    //Starts computer choosing cards animations
    app.toggleOpponentHighlightDelay(opponentCardNode);
    app.toggleHighlight("opponent", opponentCardNode);
    app.togglePlayerHighlightDelay(playerCardNode);
    app.toggleHighlight("player", playerCardNode);
  }, 500)
  
  //Time out syncs attack display update with transition delay.
  setTimeout(() => {
    app.updateOpponentAtkDisplay();
  }, 2000)

  setTimeout(() => {
    app.updatePlayerAtkDisplay();
  }, 4000)

  //Execute logic after animations are finished.
  setTimeout(() => {
    app.toggleOpponentHighlightDelay(opponentCardNode);
    app.togglePlayerHighlightDelay(playerCardNode);
    app.toggleHighlight();

    app.currentPlayerCard.atk = parseInt(app.currentPlayerCard.atk, 10);
    app.currentOpponentCard.atk = parseInt(app.currentOpponentCard.atk, 10);

    // calculates opponent attack
    if (app.currentOpponentCard.atk > app.currentPlayerCard.atk) {
      const overFlowDamage = app.currentOpponentCard.atk - app.currentPlayerCard.atk;
      app.playerLife -= overFlowDamage;
      app.removePlayerCard();
      app.drawCard("player");
    } else if (app.playerHand.length === 0) {
      app.playerLife -= app.currentOpponentCard.atk;
    } else if (app.currentPlayerCard.atk > app.currentOpponentCard.atk) {
      app.opponentLife -= (app.currentPlayerCard.atk - app.currentOpponentCard.atk);
      app.removeOpponentCard();
      app.drawCard("opponent");
    } else {
      app.removePlayerCard();
      app.removeOpponentCard();
      app.drawCard("player");
      app.drawCard("opponent");
    }

    //Reset, update and prepare for next turn.
    app.renderPlayerCards();
    app.renderOpponentCards();
    app.updateLifePoints();
    app.resetAttackDisplay();
    app.resetCurrentCards();
    app.checkGameOver();
    //Increment turn if player and opponent alive. Else render game over.
    if (app.playerLife > 0 && app.opponentLife > 0) {
      app.turn += 1;
    }
  }, 8000);
}

//Removes player card from the UI and database.
app.removePlayerCard = () => {
  const index = app.playerHand.findIndex(card => card.id === app.currentPlayerCard.id);
  $(`li[data-id="${app.currentPlayerCard.id}"]`).remove();
  app.playerHand.splice(index, 1);
  
}

//Removes Opponent card from the UI and database
app.removeOpponentCard = () => {
  const index = app.opponentHand.findIndex(card => card.id === app.currentOpponentCard.id);
  $(`li[data-id="${app.currentOpponentCard.id}"]`).remove();
  app.opponentHand.splice(index, 1);
  
}

//Finds and returns a player card from hand
app.getPlayerCard = (id) => {
  return app.playerHand.find(card => card.id === id);
}

//Find and returns an opponent card from hand
app.getOpponentCard = (id) => {
  return app.opponentHand.find(card => card.id === id);
}

//Sets the current player and opponent card to null
app.resetCurrentCards = () => {
  app.currentPlayerCard = null;
  app.currentOpponentCard = null;
}

//Reloads the game when you hit play again.
app.playAgain = () => {
  app.$gameOverPlayAgain.on("click", () => {
    window.location.reload();
  });
}

//Hides the intro screen when you hit start game.
app.startGame = () => {
  app.$startGameButton.on("click", () => {
    app.$startGameScreen.css("display", "none");
  });
}

//Shows game over screen
app.renderGameOver = () => {
  app.turn === 2;

  if (app.playerLife <= 0) {
    app.$gameOverWinner.text("The Computer!");
  } else {
    app.$gameOverWinner.text("YOU!");
  }

  app.$gameOverBackground.css("display", "flex");
  app.$gameOverBackground.css("z-index", "1000");
}

//Executes computer move
app.executeOpponentMove = () => {
  if (app.playerLife > 0 && app.opponentLife > 0) {
    app.toggleHighlight();
    app.resetAttackDisplay();
    app.calcOpponentAttack();  
  }
}

app.loadEventHandlers = (e) => {
  const lastCard = $(".card-list .card").length - 1;

  if (app.turn % 2 === 1) {
    // credit to https://codepen.io/prasannapegu/pen/JdyrZP
    // Mobile next button scrolls to next opponent card
    if (e.target.matches(".opponent-side .buttons.next")) {
      app.toggleHighlight("opponent", app.currentOpponentCard);
     const prependList = function () {
        if ($('.opponent-card').hasClass('activeNow')) {
         const $slicedCard = $('.opponent-card').slice(lastCard).removeClass('transformThis activeNow');
          $('.opponent-hand').prepend($slicedCard);
        }
      }

      $('.opponent-card').last().removeClass('transformPrev').addClass('transformThis').prev().addClass('activeNow');
      setTimeout(function () { prependList(); }, 150);
    }

    // credit to https://codepen.io/prasannapegu/pen/JdyrZP
    // Mobile prev button scrolls to prev opponent card
    if (e.target.matches(".opponent-side .buttons.prev")) {
     app.toggleHighlight("opponent", app.currentOpponentCard);
     const appendToList = function () {
        if ($('.opponent-card').hasClass('activeNow')) {
         const $slicedCard = $('.opponent-card').slice(0, 1).addClass('transformPrev');
          $('.opponent-hand').append($slicedCard);
        }
      }

      $('.opponent-card').removeClass('transformPrev').last().addClass('activeNow').prevAll().removeClass('activeNow');
      setTimeout(function () { appendToList(); }, 150);
    }

    // credit to https://codepen.io/prasannapegu/pen/JdyrZP
    // Mobile next button scrolls to next player card
    if (e.target.matches(".player-side .buttons.next")) {
      app.toggleHighlight("player", app.currentPlayerCard);
      const prependList = function () {
        if ($('.player-card').hasClass('activeNow')) {
          const $slicedCard = $('.player-card').slice(lastCard).removeClass('transformThis activeNow');
          $('.player-hand').prepend($slicedCard);
        }
      }

      $('.player-card').last().removeClass('transformPrev').addClass('transformThis').prev().addClass('activeNow');
      setTimeout(function () { prependList(); }, 150);
    }

    // credit to https://codepen.io/prasannapegu/pen/JdyrZP
    // Mobile prev button scrolls to prev player card
    if (e.target.matches(".player-side .buttons.prev")) {
      app.toggleHighlight("player", app.currentPlayerCard);
      const appendToList = function () {
        if ($('.player-card').hasClass('activeNow')) {
          const $slicedCard = $('.player-card').slice(0, 1).addClass('transformPrev');
          $('.player-hand').append($slicedCard);
        }
      }

      $('.player-card').removeClass('transformPrev').last().addClass('activeNow').prevAll().removeClass('activeNow');
      setTimeout(function () { appendToList(); }, 150);
    }

    //Select a player card
    if (e.target.matches(".player-card, .player-card *")) {
      const playerCard = e.target.closest(".player-card");
      const playerCardId = playerCard.dataset.id;
      app.currentPlayerCard = app.getPlayerCard(playerCardId);
      app.updatePlayerAtkDisplay();
      app.toggleHighlight("player", playerCard);
      app.togglePlayerButtons();
    }

    //Select an opponent card
    if (e.target.matches(".opponent-card, .opponent-card *")) {
      const opponentCard = e.target.closest(".opponent-card");
      const opponentCardId = opponentCard.dataset.id;
      app.currentOpponentCard = app.getOpponentCard(opponentCardId);
      app.updateOpponentAtkDisplay();
      app.toggleHighlight("opponent", opponentCard);
      app.togglePlayerButtons();
    }
  }
}

app.clickGameBoard = () => {
  //Event delegation for gameboard.
 app.$gameBoard.on("click",  (e) => {
    app.loadEventHandlers(e);
  })
  //Handles event when enter pushed
 app.$gameBoard.on('keypress', function (e) {
    if (e.which === 13) {
      app.loadEventHandlers(e);
    }
  })
}

//Event handlers for attack and cancel buttons
//Player clicks attack
app.handlePlayerButtons = () => {
  app.$playerAtkButton.on("click", () => {
    app.calcPlayerAttack();
    app.checkGameOver()
    app.updateLifePoints();
    app.resetCurrentCards();
    app.togglePlayerButtons();
    app.toggleHighlight();
    app.turn += 1;
    app.executeOpponentMove();
  });
  //Player clicks cancel button
  app.$playerCancelButton.on("click", () => {
    app.toggleHighlight();
    app.resetCurrentCards();
    app.togglePlayerButtons();
  });
}

// UI LOGIC
//Checks to see if game has ended
app.checkGameOver = () => {
  if(app.playerLife <= 0 || app.opponentLife <= 0){
      app.renderGameOver();
    }
}
//Updates attack power based on current monster selected
app.updatePlayerAtkDisplay = () => {
  app.$playerAtkDisplay.text(app.currentPlayerCard.atk);
}

app.updateOpponentAtkDisplay = () => {
  app.$opponentAtkDisplay.text(app.currentOpponentCard.atk);
}

//Resets atk power display
app.resetAttackDisplay = () => {
  app.$playerAtkDisplay.text('');
  app.$opponentAtkDisplay.text('');
}

//Resets the player buttons to disabled
app.togglePlayerButtons = () => {
  app.toggleAttackButton();
  app.toggleCancelButton();
}

//Toggles attack button depending on if player has selected cards
app.toggleAttackButton = () => {
  if (app.currentOpponentCard && app.currentPlayerCard) {
    app.$playerAtkButton.attr("disabled", false)
  } else {
    app.$playerAtkButton.attr("disabled", true)
  }
}

//Toggles cancel button if player has selected a player card and opponent card
app.toggleCancelButton = () => {
  if (app.currentOpponentCard && app.currentPlayerCard) {
    app.$playerCancelButton.attr("disabled", false)
  } else {
    app.$playerCancelButton.attr("disabled", true)
  }
}

//Toggles the highlight if user clicks cancel or on new card.
app.toggleHighlight = function (cardType, currentCard) {
  if (cardType === "player") { //Toggles player card highlights
   $(".player-card").toArray().forEach(card => {
      $(card).removeClass("highlight");
    });

    $(currentCard).toggleClass("highlight");
  } else if (cardType === "opponent") { //toggles opponent card highlights.
    $(".opponent-card").toArray().forEach(card => {
      $(card).removeClass("highlight");
    });
    
    $(currentCard).toggleClass("highlight");
  } else { //Removes the highlight for both opponent and player cards.
    $(".player-card").toArray().forEach(card => {
      $(card).removeClass("highlight");
    });

    $(".opponent-card").toArray().forEach(card => {
      $(card).removeClass("highlight");
    });
  }
}

//toggles animations on computer's turn for selecting cards.
app.toggleOpponentHighlightDelay = (opponentCardNode) => {
  $(opponentCardNode).toggleClass('opponent-transition-delay');
}

app.togglePlayerHighlightDelay = (playerCardNode) => {
  $(playerCardNode).toggleClass('player-transition-delay');
}

//Updates Life Points
app.updateLifePoints = () => {
  //Checks to see if who's monster won the battle. Player or Opponent?
  if(parseInt(app.currentPlayerCard.atk,10) > parseInt(app.currentOpponentCard.atk,10)){
    const attackDifference = app.currentPlayerCard.atk - app.currentOpponentCard.atk;
    const counterStart = app.opponentLife + attackDifference; 
    app.updateOpponentLife(counterStart); //Updates life point UI
  }
  
  if(parseInt(app.currentPlayerCard.atk,10) < parseInt(app.currentOpponentCard.atk,10)){
    const attackDifference = app.currentOpponentCard.atk - app.currentPlayerCard.atk;
    const counterStart = app.playerLife + attackDifference;
    app.updatePlayerLife(counterStart);   
  }
}

app.updateOpponentLife = (counter) => {
  //Counter starts at Opponent's previous life and counts down by 10
  //Gives us the lifepoint decrement animation
  const updateOpponentLifeAnimation = setInterval(() => {
    counter -= 10;
    //Sets lifepoints display to counter is it counts down.
    app.$opponentLifePoints.text(counter); 
    if( counter === app.opponentLife && app.opponentLife > 0){
      //Stop timer when counter reaches current lifepoints
      clearInterval(updateOpponentLifeAnimation); 
    } else if (app.opponentLife <= 0 && counter <= 0) { //Stops lifepoints at 0.
      app.checkGameOver();
      clearInterval(updateOpponentLifeAnimation);
    }
  },.1);
}

//Updates player lifepoint display see above.
app.updatePlayerLife = counter => {
  const updatePlayerLifeAnimation = setInterval(() => {
    counter -= 10;
    app.$playerLifePoints.text(counter);
    if( counter === app.playerLife && app.playerLife > 0){
      clearInterval(updatePlayerLifeAnimation);
    } else if(app.playerLife <= 0 && counter <= 0) {     
      app.checkGameOver();
      clearInterval(updatePlayerLifeAnimation);    
    }
  },.1);
}

app.renderPlayerCards = () => {
  app.$playerHandNode.html("");
  app.playerHand.forEach(card => {
    const markup = `
    <li class="player-card card" tabindex="0" data-id=${card.id}>
      <img src="${card.image_url}" class="player-card-img" alt="${card.name}">
      <div class="visuallyhidden">${card.atk} Attack Points</div>
    </li>
  `;
    app.$playerHandNode.append(markup);
  })
}

app.renderOpponentCards = () => {
  app.$opponentHandNode.html("");
  app.opponentHand.forEach(card => {
    const markup = `
      <li class="opponent-card card" tabindex="0" data-id=${card.id}>
        <img src="${card.image_url}" class="opponent-card-img" alt="${card.name}">
        <div class="visuallyhidden">${card.atk} Attack Points</div>
      </li>
    `;
  
   app.$opponentHandNode.append(markup);
  })
}

app.init = async () => {
  
  app.$playerHandNode = $(".player-hand");
  app.$opponentHandNode = $(".opponent-hand");
  app.$playerLifePoints = $(".player-life-points");
  app.$opponentLifePoints = $(".opponent-life-points");
  app.$playerAtkButton = $(".player-atk-button");
  app.$playerCancelButton = $(".player-cancel-button");
  app.$playerAtkDisplay = $(".player-atk-display");
  app.$opponentAtkDisplay = $(".opponent-atk-display");
  app.$gameBoard = $(".gameboard");
  app.$gameOverWinner = $(".game-over-winner");
  app.$gameOverBackground = $(".game-over-background");
  app.$gameOverPlayAgain = $(".game-over-play-again");
  app.$startGameButton = $(".start-game-button");
  app.$startGameScreen = $(".start-game");

  await app.getDeck();
  app.setupPlayerCards();
  app.setupOpponentCards();
  app.handlePlayerButtons();
  app.clickGameBoard();
  app.renderOpponentCards();
  app.renderPlayerCards();
  app.toggleAttackButton();
  app.toggleCancelButton();
  app.playAgain();
  app.startGame();
}

$(function () {
  app.init();
});