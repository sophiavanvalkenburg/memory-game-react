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
    {formatTime(time)}
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
      startTimer: false
    }
  }

  componentWillMount(){
    if (this.state.startTimer){
      this.startTimer();
    }
  }

  componentWillReceiveProps(nextProps){
    if (!this.state.startTimer && nextProps.startTimer){
      this.state.startTimer = true; 
      this.startTimer();
    }else if (this.state.startTimer && !nextProps.startTimer){
      this.state.startTimer = false;
      this.endTimer();
    }
  }

  startTimer(){
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  endTimer(){
    clearInterval(this.interval)
  }

  componentWillUnmount() {
    this.endTimer();
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
