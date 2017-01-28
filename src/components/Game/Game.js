import React from 'react'

import Timer from '../Timer/Timer'
import styles from './Game.scss'

function getGameData(){
  return {
    "levels": [
    {
      "cards": [
        "✈",
        "♘",
        "✈",
        "♫",
        "♫",
        "☆",
        "♘",
        "☆"
      ],
      "difficulty": "easy"
    },
    {
      "cards": [
        "❄",
        "⍨",
        "♘",
        "✈",
        "☯",
        "♠",
        "☆",
        "❄",
        "♫",
        "♫",
        "☯",
        "☆",
        "✈",
        "⍨",
        "♠",
        "♘"
      ],
      "difficulty": "hard"
    },
    ]
  } 
}

const Card = props => (
  <button className={styles.boardCard} onClick={() => props.onClick()}>
    {props.content}
  </button>
)

class Board extends React.Component {

  constructor(props){
    super();
    this.state = {
      boardData: this.makeBoardData(props.cardData)
    }
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

class Game extends React.Component {
  constructor(){
    super();
    const gameData = getGameData();
    this.state = {
      cardState: this.initialCardState(gameData),
      gameStarted: false,
      gameClickable: true
    }
  }
  initialCardState(gameData){
    const cardData = gameData.levels[0].cards.slice();
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
      if (!this.state.gameStarted){
        this.setState({
          gameStarted: true
        })
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
    }
    this.setState({
      cardState: cardState,
      gameClickable: true
    })
    if (this.checkAllCardsMatched()){
      this.setState({
        gameStarted: false,
        gameClickable: false
      })
    }
  }
  render() {
    const cardData = this.state.cardState.slice();
    return (
      <div>
        <h1 className={styles.header}>NYT Games Code Test</h1>
        <Timer startTimer={this.state.gameStarted} />
        <div><Board cardData={cardData} onClick={(i) => this.handleClick(i)}/></div>
      </div>
    )
  }
}

export default Game
