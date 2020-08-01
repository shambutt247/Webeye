import React, { Component } from "react";

export default class Timer extends Component {
    constructor(props) {
      super(props);
      this.state = { time: {}, seconds: 5 ,timerStarted:true};
      this.timer = 0;
      this.startTimer = this.startTimer.bind(this);
      this.countDown = this.countDown.bind(this);
    }
  
    secondsToTime(secs){
      let hours = Math.floor(secs / (60 * 60));
  
      let divisor_for_minutes = secs % (60 * 60);
      let minutes = Math.floor(divisor_for_minutes / 60);
  
      let divisor_for_seconds = divisor_for_minutes % 60;
      let seconds = Math.ceil(divisor_for_seconds);
  
      let obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
      };
      return obj;
    }
  
    componentDidMount() {
      this.dingo();
    }

    dingo=()=>{
      let timeLeftVar = this.secondsToTime(this.state.seconds);
      this.setState({ time: timeLeftVar });
      this.startTimer();
    }
  
    startTimer() {
        this.setState({
            timerStarted:true
        });
        this.timer = setInterval(this.countDown, 1000);
    }
  
    countDown() {
      // Remove one second, set state so a re-render happens.
      let seconds = this.state.seconds - 1;
      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds,
      });
      
      // Check if we're at zero.
      if (seconds === 0) { 
        clearInterval(this.timer);
        this.setState({
            timerStarted:false
        },()=>{
          this.setState({
            timerStarted:true,
            seconds:60,
          })
          this.dingo();
        });
      }
    }
  
    render() {
      return(
        <div>
            <h3>Time remaining till next Refresh :: {this.state.time.m} M : {this.state.time.s} S </h3>
        </div>
      );
    }
  }