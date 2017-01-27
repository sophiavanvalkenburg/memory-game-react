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
    }
    ]
  } 
}

const Card = props => (
  <button className={styles.boardCard} onClick={() => props.onClick()}>
    {props.content}
  </button>
)

class Board extends React.Component {
  
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

  renderRow(nRow, rowData){
    let row = [];
    for (let i=0; i<4; i++){
      row.push(this.renderCard(rowData[i]));
    }
    return ( <div key={`row${nRow}`} className={styles.boardRow}>{ row }</div>);
  }

  renderBoard(){
    let board = [];
    for (let i=0; i<2; i++){
      const rowData = this.props.cardData.slice(i * 4, i * 4 + 4);
      board.push(this.renderRow(i, rowData));
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
      gameStarted: false
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
    if (!this.state.gameStarted){
      this.setState({
        gameStarted: true
      })
    }
    if (this.state.cardState[i].isFaceDown){
      const cardState = this.state.cardState.slice();
      const unmatchedCardIndex = this.getUnmatchedFaceUpCard(); 
      if (unmatchedCardIndex >= 0){
        if (this.cardsMatch(unmatchedCardIndex, i)){
          cardState[i].isFaceDown = false;
          cardState[i].isMatched = true;
          cardState[unmatchedCardIndex].isMatched = true;
        }else{
          cardState[unmatchedCardIndex].isFaceDown = true;
        }
      }else{
        cardState[i].isFaceDown = false;
      }
      this.setState({
          cardState: cardState,
      })
      if (this.checkAllCardsMatched()){
        this.setState({
          gameStarted: false
        })
      }
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
