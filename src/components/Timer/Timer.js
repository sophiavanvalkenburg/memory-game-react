import React from 'react'

import styles from './Timer.scss'

export const formatTime = (time) => {
  if (time < 0) return '--:--'
  const h = Math.floor(time / 3600)
  const m = Math.floor((time % 3600) / 60)
  const mm = m < 10 ? `0${m}` : m
  const s = time % 60
  const ss = s < 10 ? `0${s}` : s
  if (h > 0) return [h, mm, ss].join(':')
  return `${m}:${ss}`
}

const Timer = ({ time = 0 }) => (
  <div className={styles.timer}>
    Time Elapsed: {formatTime(time)}
  </div>
)

Timer.propTypes = {
  time: React.PropTypes.number,
}

class TimerContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      secondsElapsed: 0,
      shouldTick: false
    }
  }
  
  componentWillMount(){
    if (this.state.shouldTick){
      this.startTimer();
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.shouldReset){
      this.state.secondsElapsed = 0;
    }
    if (!this.state.shouldTick && nextProps.shouldTick){
      this.state.shouldTick = true; 
      this.startTimer();
    }else if (this.state.shouldTick && !nextProps.shouldTick){
      this.state.shouldTick = false;
      this.stopTimer();
    }
  }

  startTimer(){
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  stopTimer(){
    clearInterval(this.interval)
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  tick() {
    this.setState({
      secondsElapsed: this.state.secondsElapsed + 1,
    })
  }

  render() {
    return (
      <Timer time={this.state.secondsElapsed} />
    )
  }
}

export default TimerContainer
