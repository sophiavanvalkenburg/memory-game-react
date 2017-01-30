import React from 'react'
import 'whatwg-fetch'

import Timer from '../Timer/Timer'
import styles from './Game.scss'

const Card = props => {
  // a card that has an image or is blank
  let boardCardEmptyStyle = "";
  if (props.content === null){
    boardCardEmptyStyle = styles.boardCardEmpty;
  }
  return (
    <button className={`${styles.boardCard} ${boardCardEmptyStyle}`} onClick={() => props.onClick()}>
      {props.content}
    </button>
  )
}

class Board extends React.Component {
  // a collection of cards

  constructor(props){
    super();
    this.state = {
      boardData: this.makeBoardData(props.cardData)
    };
  }

  componentWillReceiveProps(props){
    if (props.cardData){
      this.setState({
        boardData: this.makeBoardData(props.cardData)
      });
    }
  }

  makeBoardData(cardData){
    // approximate a square board
    if (!cardData){
      return [];
    }
    const n = cardData.length;
    let nRows = 0;
    let nCols = 0;
    for (let i=Math.floor(Math.sqrt(n)); i>0; i--){
      // get the largest factor <= the square root and use that for #rows
      // use its partner for #cols
      if (n%i == 0){
        nRows = i;
        nCols = n/i;
        break;
      }
    }
    const boardData = [];
    for (let i=0; i<nRows; i++){
      boardData.push(cardData.slice(i * nCols, i * nCols + nCols));
    }
    return boardData;
  }

  renderCard(card){
    let content;
    if (card.isMatched){
      content = null;
    }else if (card.isFaceDown){
      content = "?"
    }else{
      content = card.content;
    }
    return <Card key={`card${card.key}`} content={content} onClick={() => this.props.onClick(card.key)}/>;
  }

  renderRow(iRow, rowData){
    let row = [];
    for (let j=0; j<rowData.length; j++){
      row.push(this.renderCard(rowData[j]));
    }
    return ( <div key={`row${iRow}`} className={styles.boardRow}>{ row }</div>);
  }

  renderBoard(){
    let board = [];
    for (let i=0; i<this.state.boardData.length; i++){
      board.push(this.renderRow(i, this.state.boardData[i]));
    }
    return (<div>{ board }</div>);
  }

  render(){
    return this.renderBoard();
  }
}

const WinMessage = props => {
  // displays a message and replay/level up buttons when the user wins the game
  let levelUpBtn = null;
  let levelDownBtn = null;
  if (props.showLevelUpBtn){
    levelUpBtn = (
        <button className={styles.winBtn} onClick={()=>props.onLevelUpBtnClick()}>
          Level Up
        </button>
      )
  }
  if (props.showLevelDownBtn){
    levelDownBtn = (
        <button className={styles.winBtn} onClick={()=>props.onLevelDownBtnClick()}>
          Level Down
        </button>
      )
  }
  return (
    <div>
      <h2 className={`${styles.text} ${styles.wonMsg}`}>{props.winMessage}</h2>
      <button className={styles.winBtn} onClick={()=>props.onReplayBtnClick()}>Replay</button>
      {levelUpBtn}
      {levelDownBtn}
    </div>
  )
}

class Game extends React.Component {
  // class containing all game-related components as well as game logic
  constructor(){
    super();
    this.state = {
      cardState: [], // array of {key, content, isFaceDown, isMatched}
      gamePaused: true,
      gameClickable: false,
      gameStarted: false,
      gameWon: false,
      gameLoaded: false,
      currentLevel: 0,
      maxLevel: 0,
      numMismatches: 0,
      errorMessage: null,
      loadingMessage: "Loading ...",
      winMessage: "Congratulations! You Won!",
      title: "Memory Game",
      gameDataUrl: "https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json",
    }
  }
  componentDidMount(){
    // load the data from an external source
    fetch(this.state.gameDataUrl)
      .then((response) => {
        let gameData = null;
        if (response.status == 200){
          gameData = response.json();
        }
        return gameData;
      }).then((gameData) => {
        if (gameData != null){
          this.state.gameData = gameData;
          this.setState({
            cardState: this.initialCardState(),
            gameClickable: true,
            maxLevel: this.getMaxLevel(),
            gameLoaded: true
          });
        }else{
          this.setErrorMessage();
        }
      }).catch((error)=>{
          this.setErrorMessage();
      })
  }
  setErrorMessage(){
    this.setState({
        errorMessage: "Game data failed to load",
        gameLoaded: true
    })
  }
  getMaxLevel(){
    let maxLevel = -1;
    if (this.state.gameData && this.state.gameData.levels){
      maxLevel = this.state.gameData.levels.length - 1;
    }
    return maxLevel;
  }
  gameDataIsInExpectedFormat(){
    // make sure the game data has the format we need to parse it correctly
    const gameData = this.state.gameData;
    return gameData != null && gameData.levels != null
      && this.getMaxLevel() >= this.state.currentLevel
      && gameData.levels[this.state.currentLevel].cards != null
  }
  initialCardState(){
    // extract the card data for the current level from the loaded game data
    const cardState = [];
    if (this.gameDataIsInExpectedFormat()){
      const cardData = this.state.gameData.levels[this.state.currentLevel].cards.slice();
      for (let i=0; i<cardData.length; i++){
        cardState.push({
          key: i,
          content: cardData[i],
          isFaceDown: true,
          isMatched: false
        });
      }
    }
    return cardState;
  }
  getUnmatchedFaceUpCard(){
    // get the index of any card that is faced up and unmatched.
    // return -1 if there are none
    let cardIndex = -1;
    for(let i=0; i<this.state.cardState.length; i++){
      const card = this.state.cardState[i];
      if (!card.isFaceDown && !card.isMatched){
        cardIndex = i;
        break;
      }
    }
    return cardIndex;
  }
  cardsMatch(i, j){
    return this.state.cardState[i].content === this.state.cardState[j].content;
  }
  checkAllCardsMatched(){
    // check for the winning state
    let allMatched = true;
    for(let i=0; i<this.state.cardState.length; i++){
      if (!this.state.cardState[i].isMatched){
        allMatched = false;
        break;
      }
    }
    return allMatched;
  }
  handleClick(i){
    // invoked every time the user clicks a card
    // if clicks are allowed  and the card is face down, flip it
    // otherwise ignore the user click
        if (this.state.gameClickable){
      if (this.state.gamePaused){
        this.setState({
          gamePaused: false 
        })
      }
      if (!this.state.gameStarted){
        this.state.gameStarted = true;
      }
      if (this.state.cardState[i].isFaceDown){
        const cardState = this.state.cardState.slice();
        const unmatchedCardIndex = this.getUnmatchedFaceUpCard(); 
        cardState[i].isFaceDown = false;
        this.setState({
          cardState: cardState
        })
        if (unmatchedCardIndex >= 0){
          this.setState({
            gameClickable: false
          });
          // set a timer to check for a match / win state after the
          // flipped card has been shown for a moment to allow users to see
          // the card even if the cards don't match
          setTimeout(this.checkCardStateAfterClick.bind(this, i, unmatchedCardIndex), 750);
        }
      }
    }
  }
  checkCardStateAfterClick(i, unmatchedCardIndex){
    // check for a match and change the state accordingly
    // also check for a win state
    const cardState = this.state.cardState.slice();
    if (unmatchedCardIndex >= 0 && this.cardsMatch(unmatchedCardIndex, i)){
      cardState[i].isMatched = true;
      cardState[unmatchedCardIndex].isMatched = true;
    }else{
      cardState[i].isFaceDown = true;
      cardState[unmatchedCardIndex].isFaceDown = true;
      this.state.numMismatches++;
    }
    this.setState({
      cardState: cardState,
      gameClickable: true
    })
    if (this.checkAllCardsMatched()){
      this.setState({
        gamePaused: true,
        gameClickable: false,
        gameWon: true,
        gameStarted: false,
      })
    }
  }
  handleLevelDownBtnClick(){
    this.state.currentLevel--;
    this.resetGameState();
  }
  handleLevelUpBtnClick(){
    this.state.currentLevel++;
    this.resetGameState();
  }
  handleReplayBtnClick(){
    this.resetGameState();
  }
  resetGameState(){
    this.setState({
        cardState: this.initialCardState(),
        gameClickable: true,
        gameWon: false,
        numMismatches: 0
    });
  }
  getWinMessage(){
    return (<WinMessage 
          winMessage={this.state.winMessage}
          showLevelUpBtn={this.state.currentLevel < this.state.maxLevel}
          showLevelDownBtn={this.state.currentLevel > 0}
          onReplayBtnClick={()=>this.handleReplayBtnClick()} 
          onLevelUpBtnClick={()=>this.handleLevelUpBtnClick()}
          onLevelDownBtnClick={()=>this.handleLevelDownBtnClick()}
        />);
  }
  getStatusMessage(){
    // a status message that displays above the game board
    let statusMessage = null;
    if (this.state.gameWon){
      statusMessage = this.getWinMessage(); 
    }else if (this.state.errorMessage != null){
      statusMessage = (<div className={styles.text}>{this.state.errorMessage}</div>);
    }else if (!this.state.gameLoaded){
      statusMessage = (<div className={styles.text}>{this.state.loadingMessage}</div>);
    }
    return statusMessage;
  }
  render() {
    const cardData = this.state.cardState.slice();
    const statusMessage = this.getStatusMessage();
    const board = this.state.gameWon ? null : (
        <div className={styles.boardContainer}>
          <Board cardData={cardData} onClick={(i) => this.handleClick(i)}/>
        </div>
      )
    return (
      <div> 
        <h1 className={`${styles.header} ${styles.text}`}>{this.state.title}</h1>
        <Timer shouldTick={!this.state.gamePaused} shouldReset={!this.state.gameWon && !this.state.gameStarted} />
        <div className={styles.text}>Mismatches: { this.state.numMismatches }</div>
        <div>{statusMessage}</div>
        {board}
        </div>
    )
  }
}

export default Game
