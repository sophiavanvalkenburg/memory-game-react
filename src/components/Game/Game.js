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
  <button className={styles.boardCard} onClick={() => alert("click")}>
    {props.content}
  </button>
)

class Board extends React.Component {
  
  renderRow(nRow, rowData){
    let row = [];
    for (let i=0; i<4; i++){
      row.push(<Card key={`card-${nRow}-${i}`} content={rowData[i]}/>);
    }
    return ( <div key={`row-${nRow}`} className={styles.boardRow}>{ row }</div>);
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
    this.state = {
      gameData: getGameData()
    }
  }
  render() {
    const cardData = this.state.gameData.levels[0].cards.slice();
    return (
      <div>
        <h1 className={styles.header}>NYT Games Code Test</h1>
        <Timer />
        <div><Board cardData={cardData} /></div>
      </div>
    )
  }
}

export default Game
