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
    if (card.isFaceDown){
      content = null;
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
      cardState: this.initialCardState(gameData)
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
  handleClick(i){
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
        cardState: cardState
      }); 
    }
  }
  render() {
    const cardData = this.state.cardState.slice();
    return (
      <div>
        <h1 className={styles.header}>NYT Games Code Test</h1>
        <Timer />
        <div><Board cardData={cardData} onClick={(i) => this.handleClick(i)}/></div>
      </div>
    )
  }
}

export default Game
