import React from 'react'
import 'whatwg-fetch'

import Timer from '../Timer/Timer'
import styles from './Game.scss'

const Card = props => {
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

  constructor(props){
    super();
    this.state = {
      boardData: this.makeBoardData(props.cardData)
    };
  }

  componentWillReceiveProps(props){
    this.setState({
      boardData: this.makeBoardData(props.cardData)
    });
  }

  makeBoardData(cardData){
    // approximate a square board
    const n = cardData.length;
    let nRows;
    let nCols;
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
  let levelUpBtn = null;
  if (props.showLevelUpBtn){
    levelUpBtn = (
        <button className={styles.winBtn} onClick={()=>props.onLevelUpBtnClick()}>Level Up</button>
      )
  }
  return (
    <div>
      <h2 className={`${styles.text} ${styles.wonMsg}`}>Congratulations! You Won!</h2>
      <button className={styles.winBtn} onClick={()=>props.onReplayBtnClick()}>Replay</button>
      {levelUpBtn}
    </div>
  )
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      cardState: [],
      gamePaused: true,
      gameClickable: false,
      gameStarted: false,
      gameWon: false,
      currentLevel: 0,
      maxLevel: 0,
      numMismatches: 0,
    }
  }
  componentDidMount(){
    fetch("https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json")
      .then((response) => {
        return response.json();
      }).then((gameData) => {
        this.state.gameData = gameData;
        this.setState({
          cardState: this.initialCardState(),
          gameClickable: true,
          maxLevel: this.getMaxLevel()
        });
      })
  }
  getMaxLevel(){
    return this.state.gameData.levels.length - 1;
  }
  initialCardState(){
    const cardData = this.state.gameData.levels[this.state.currentLevel].cards.slice();
    const cardState = [];
    for (let i=0; i<cardData.length; i++){
      cardState.push({
        key: i,
        content: cardData[i],
        isFaceDown: true,
        isMatched: false
      });
    }
    return cardState;
  }
  getUnmatchedFaceUpCard(){
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
          setTimeout(this.checkCardStateAfterClick.bind(this, i, unmatchedCardIndex), 750);
        }
      }
    }
  }
  checkCardStateAfterClick(i, unmatchedCardIndex){
    const cardState = this.state.cardState.slice();
    if (this.cardsMatch(unmatchedCardIndex, i)){
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
  handleLevelUpBtnClick(){
    this.state.currentLevel++;
    this.handleReplayBtnClick();
  }
  handleReplayBtnClick(){
    this.setState({
        cardState: this.initialCardState(),
        gameClickable: true,
        gameWon: false,
        numMismatches: 0
    });
  }
  render() {
    const cardData = this.state.cardState.slice();
    let board;
    if (cardData.length == 0){
      board = (<div className={styles.text}>Loading ...</div>);
    }else{
      board = (<Board cardData={cardData} onClick={(i) => this.handleClick(i)}/>);
    }
    let wonMsg = null;
    if (this.state.gameWon){
      wonMsg = (<WinMessage 
          showLevelUpBtn={this.state.currentLevel < this.state.maxLevel}
          onReplayBtnClick={()=>this.handleReplayBtnClick()} 
          onLevelUpBtnClick={()=>this.handleLevelUpBtnClick()}
        />); 
    }
    return (
      <div> 
        <h1 className={`${styles.header} ${styles.text}`}>NYT Games Code Test</h1>
        <Timer shouldTick={!this.state.gamePaused} shouldReset={!this.state.gameWon && !this.state.gameStarted} />
        <div className={styles.text}>Mismatches: { this.state.numMismatches }</div>
        <div>{wonMsg}</div>
        <div className={styles.boardContainer}>{board}</div>
      </div>
    )
  }
}

export default Game
