const app = {};

app.totalDeck = [];
app.playerHand = [];
app.opponentHand = [];
app.currentPlayerCard = null;
app.currentOpponentCard = null;
app.playerLife = 2000;
app.opponentLife = 2000;
app.turn = 1;

app.calcPlayerAttack = function () {
  const playerAttack = parseInt(app.currentPlayerCard.atk, 10);
  const opponentAttack = parseInt(app.currentOpponentCard.atk, 10);
  //If player wins and there are still monsters on field
  if (playerAttack > opponentAttack && app.opponentHand.length > 0) {
    const overFlowDamage = playerAttack - opponentAttack;
    app.opponentLife -= overFlowDamage;
    app.removeOpponentCard();
    //If no monsters direct attack
  } else if (app.opponentHand.length === 0) {
    app.opponentLife -= playerAttack;
    //Failed attack
  } else if (opponentAttack > playerAttack) {
    app.playerLife -= (opponentAttack - playerAttack);
    app.removePlayerCard();
  } else {
    app.removePlayerCard();
    app.removeOpponentCard();
  }
};

app.calcOpponentAttack = function () {

  app.currentOpponentCard = app.opponentHand[0];
  app.currentPlayerCard = app.playerHand[0];

  for (let i = 1; i < app.opponentHand.length; i++) {
    if (parseInt(app.opponentHand[i].atk, 10) > parseInt(app.currentOpponentCard.atk, 10)) {
      app.currentOpponentCard = app.opponentHand[i];
    }
  }

  for (let i = 1; i < app.playerHand.length; i++) {
    if (parseInt(app.playerHand[i].atk, 10) < parseInt(app.currentPlayerCard.atk, 10)) {
      app.currentPlayerCard = app.playerHand[i];
    }
  }

  const playerId = app.currentPlayerCard.id;
  const opponentId = app.currentOpponentCard.id;
  const playerCardNode = $(`[data-id="${playerId}"]`);
  const opponentCardNode = $(`[data-id="${opponentId}"]`);

  app.toggleOpponentHighlightDelay(opponentCardNode);
  app.toggleHighlight("opponent", opponentCardNode);
  app.togglePlayerHighlightDelay(playerCardNode);
  app.toggleHighlight("player", playerCardNode);

  setTimeout(() => {
    app.updateOpponentAtkDisplay();
  }, 2000)

  setTimeout(() => {
    app.updatePlayerAtkDisplay();
  }, 4000)

  setTimeout(() => {
    app.toggleOpponentHighlightDelay(opponentCardNode);
    app.togglePlayerHighlightDelay(playerCardNode);
    app.toggleHighlight();
    app.currentPlayerCard.atk = parseInt(app.currentPlayerCard.atk, 10);
    app.currentOpponentCard.atk = parseInt(app.currentOpponentCard.atk);
    if (app.currentOpponentCard.atk > app.currentPlayerCard.atk) {
      const overFlowDamage = app.currentOpponentCard.atk - app.currentPlayerCard.atk;
      app.playerLife -= overFlowDamage;
      app.removePlayerCard();
    } else if (app.playerHand.length === 0) {
      app.playerLife -= app.currentOpponentCard.atk;
    } else if (app.currentPlayerCard.atk > app.currentOpponentCard.atk) {
      app.opponentLife -= (app.currentPlayerCard.atk - app.currentOpponentCard.atk);
      app.removeOpponentCard();
    } else {
      app.removePlayerCard();
      app.removeOpponentCard();
    }
    app.updateLifePoints();
    app.resetAttackDisplay();
    app.resetCurrentCards();
    if (app.playerLife > 0 && app.opponentLife > 0) {
      app.turn += 1;
    } else {
      if (app.playerLife <= 0) {
        $('.game-over-winner').text("The Computer!");
      } else {
        $('.game-over-winner').text("YOU!");
      }
      $(".game-over-background").css("display", "flex");
    }


  }, 7000)
}

//Removes player card from the UI and database.
app.removePlayerCard = function () {
  const index = app.playerHand.findIndex(card => card.id === app.currentPlayerCard.id);
  $(`li[data-id="${app.currentPlayerCard.id}"]`).remove();
  app.playerHand.splice(index, 1);
}

//Removes Opponent card from the UI and database
app.removeOpponentCard = function () {
  const index = app.opponentHand.findIndex(card => card.id === app.currentOpponentCard.id);
  $(`li[data-id="${app.currentOpponentCard.id}"]`).remove();
  app.opponentHand.splice(index, 1);
}

//Finds and returns a player card from hand
app.getPlayerCard = function (id) {
  return this.playerHand.find(card => card.id === id);
}

//Find and returns an opponent card from hand
app.getOpponentCard = function (id) {
  return this.opponentHand.find(card => card.id === id);
}

app.getDeck = async function () {

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
app.setupPlayerCards = function () {
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * app.totalDeck.length);
    app.playerHand.push(app.totalDeck[randomIndex]);
    app.totalDeck.splice(randomIndex, 1);
  }
}

//Sets up initial opponent hand from totalDeck
app.setupOpponentCards = function () {
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * app.totalDeck.length);
    app.opponentHand.push(app.totalDeck[randomIndex]);
    app.totalDeck.splice(randomIndex, 1);
  }
}

//Sets the current player and opponent card to null
app.resetCurrentCards = function () {
  app.currentPlayerCard = null;
  app.currentOpponentCard = null;
}

app.playAgain = function () {
  $(".game-over-play-again").on("click", () => {
    window.location.reload();
  });
}

app.startGame = () => {
  $(".start-game-button").on("click", () => {
    console.log('click');
    $(".start-game").css("display", "none");
  });
}


//Executes computer move
app.executeOpponentMove = function () {
  if (app.playerLife > 0 && app.opponentLife > 0) {
    app.toggleHighlight();
    app.resetAttackDisplay();
    app.calcOpponentAttack();
  } else {
    if (app.playerLife <= 0) {
      $('.game-over-winner').text("The Computer!");
    } else {
      $('.game-over-winner').text("YOU!");
    }
    $(".game-over-background").css("display", "flex");
  }
}

app.loadEventHandlers = function(e) {
  if (e.which === 13) {
    console.log(e.target);
  }
  let lastCard = $(".card-list .card").length - 1;

  if (app.turn % 2 === 1) {

    // credit to https://codepen.io/prasannapegu/pen/JdyrZP
    if (e.target.matches(".opponent-side .buttons.next")) {
      let prependList = function () {
        if ($('.opponent-card').hasClass('activeNow')) {
          let $slicedCard = $('.opponent-card').slice(lastCard).removeClass('transformThis activeNow');
          $('.opponent-hand').prepend($slicedCard);
        }
      }
      $('.opponent-card').last().removeClass('transformPrev').addClass('transformThis').prev().addClass('activeNow');
      setTimeout(function () { prependList(); }, 150);
    }

    // credit to https://codepen.io/prasannapegu/pen/JdyrZP
    if (e.target.matches(".opponent-side .buttons.prev")) {
      let appendToList = function () {
        if ($('.opponent-card').hasClass('activeNow')) {
          let $slicedCard = $('.opponent-card').slice(0, 1).addClass('transformPrev');
          $('.opponent-hand').append($slicedCard);
        }
      }
      $('.opponent-card').removeClass('transformPrev').last().addClass('activeNow').prevAll().removeClass('activeNow');
      setTimeout(function () { appendToList(); }, 150);
    }

    // credit to https://codepen.io/prasannapegu/pen/JdyrZP
    if (e.target.matches(".player-side .buttons.next")) {
      let prependList = function () {
        if ($('.player-card').hasClass('activeNow')) {
          let $slicedCard = $('.player-card').slice(lastCard).removeClass('transformThis activeNow');
          $('.player-hand').prepend($slicedCard);
        }
      }
      $('.player-card').last().removeClass('transformPrev').addClass('transformThis').prev().addClass('activeNow');
      setTimeout(function () { prependList(); }, 150);
    }

    // credit to https://codepen.io/prasannapegu/pen/JdyrZP
    if (e.target.matches(".player-side .buttons.prev")) {
      let appendToList = function () {
        if ($('.player-card').hasClass('activeNow')) {
          let $slicedCard = $('.player-card').slice(0, 1).addClass('transformPrev');
          $('.player-hand').append($slicedCard);
        }
      }
      $('.player-card').removeClass('transformPrev').last().addClass('activeNow').prevAll().removeClass('activeNow');
      setTimeout(function () { appendToList(); }, 150);
    }

    if (e.target.matches(".player-card, .player-card *")) {
      const playerCard = e.target.closest(".player-card");
      const playerCardId = playerCard.dataset.id;
      app.currentPlayerCard = app.getPlayerCard(playerCardId);
      app.updatePlayerAtkDisplay();
      app.toggleHighlight("player", playerCard);
      app.resetPlayerButtons();
    }

    if (e.target.matches(".opponent-card, .opponent-card *")) {
      const opponentCard = e.target.closest(".opponent-card");
      const opponentCardId = opponentCard.dataset.id;
      app.currentOpponentCard = app.getOpponentCard(opponentCardId);
      app.updateOpponentAtkDisplay();
      app.toggleHighlight("opponent", opponentCard);
      app.resetPlayerButtons();
    }
  }
}

app.clickGameBoard = () => {
  //Event delegation for gameboard.
  $(".gameboard").on("click",  (e) => {
    app.loadEventHandlers(e);
  })
  $('.gameboard').on('keypress', function (e) {
    if (e.which === 13) {
      app.loadEventHandlers(e);
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

app.updatePlayerAtkDisplay = function () {
  $('.player-atk-display').text(app.currentPlayerCard.atk);
}

app.updateOpponentAtkDisplay = function () {
  $('.opponent-atk-display').text(app.currentOpponentCard.atk);
}

app.resetAttackDisplay = function () {
  $('.player-atk-display').text('');
  $('.opponent-atk-display').text('');
}

// app.gameOver() {
//   // disable clicking on the screen
// }

// UI LOGIC

//Resets the player buttons to disabled
app.resetPlayerButtons = function () {
  app.toggleAttackButton();
  app.toggleCancelButton();
}

//Toggles attack button depending on if player has selected cards
app.toggleAttackButton = function () {
  if (app.currentOpponentCard && app.currentPlayerCard) {
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
    // need to create a function here to make highlighted card switch places with the last li !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // $(`li[data-id="${currentCard}"]`)
    // $(`.opponent-hand:last-child`)


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

app.toggleOpponentHighlightDelay = function (opponentCardNode) {
  $(opponentCardNode).toggleClass('opponent-transition-delay');
}

app.togglePlayerHighlightDelay = function (playerCardNode) {
  $(playerCardNode).toggleClass('player-transition-delay');
}

app.updateLifePoints = () => {
  if(parseInt(app.currentPlayerCard.atk,10) > parseInt(app.currentOpponentCard.atk,10)){
    const attackDifference = app.currentPlayerCard.atk - app.currentOpponentCard.atk;
    const counterStart = app.opponentLife + attackDifference;
    app.updateOpponentLife(counterStart);
  }

  if(parseInt(app.currentPlayerCard.atk,10) < parseInt(app.currentOpponentCard.atk,10)){
    const attackDifference = app.currentOpponentCard.atk - app.currentPlayerCard.atk;
    const counterStart = app.playerLife + attackDifference;
    app.updatePlayerLife(counterStart);
  }
}

app.updateOpponentLife = (counter) => {
  const updateOpponentLifeAnimation = setInterval(() => {
    counter -= 10;
    $(".opponent-life-points").text(counter);
    if( counter === app.opponentLife && app.opponentLife > 0){
      clearInterval(updateOpponentLifeAnimation);
    } else if (app.opponentLife <= 0 && counter <= 0) {
      clearInterval(updateOpponentLifeAnimation);
    }
  },.1);
}

app.updatePlayerLife = counter => {
  const updatePlayerLifeAnimation = setInterval(() => {
    counter -= 10;
    $(".player-life-points").text(counter);
    if( counter === app.playerLife && app.playerLife > 0){
      clearInterval(updatePlayerLifeAnimation);
    } else if(app.playerLife <= 0 && counter <= 0) {
      clearInterval(updatePlayerLifeAnimation);
    }
  },.1);
}

app.renderPlayerCards = () => {
  $(".player-card-img").toArray().forEach(function (card, index) {
    $(card).attr("src", app.playerHand[index].image_url);
    $(card).attr("alt", app.playerHand[index].name);

  })
  $(".player-card").toArray().forEach(function (card, index) {
    $(card).attr("data-id", app.playerHand[index].id);
  });
}

app.renderOpponentCards = function () {
  $(".opponent-card-img").toArray().forEach(function (card, index) {
    $(card).attr("src", app.opponentHand[index].image_url);
    $(card).attr("alt", app.opponentHand[index].name);
  })

  $(".opponent-card").toArray().forEach(function (card, index) {
    $(card).attr("data-id", app.opponentHand[index].id);
  });
}

app.init = async () => {
  await app.getDeck();
  app.setupPlayerCards();
  app.setupOpponentCards();
  app.handlePlayerButtons();
  // app.loadEventHandlers();
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