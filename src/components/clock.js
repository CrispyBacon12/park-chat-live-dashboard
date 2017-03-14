import React, { Component } from 'react';


export default class Clock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: new Date()
    };

    this.updateCurrentTime = this.updateCurrentTime.bind(this);
    setInterval(this.updateCurrentTime, 1000);
  }

  updateCurrentTime() {
    this.setState({
      currentTime: new Date()
    });
  }
  
  render() {
    if (!this.props.facebookStartTime) {
      return <div></div>;
    }

    const differenceMillis = this.state.currentTime.getTime() - this.props.facebookStartTime.getTime();
    const duration = calculateDuration(differenceMillis);
    const clockClass = "";

    return (
      <div className="clock mt-4 pb-4">
        <p>{duration.negative ? '-' : ''}{duration.hours}:{duration.minutes}</p>
      </div>
    );
  }

  getClockClass(duration) {
    if (!duration.negative && (duration.hours >= 1 || duration.minutes >= 50)) {
      return 'text-danger';
    }
    
    if (duration.negative && duration.hours <= 0 && duration.minutes < 5) {
      return 'text-danger';
    }

    return '';
  }
}

function calculateDuration(milliseconds) {
  const absMilliseconds = Math.abs(milliseconds);

  const hours = absMilliseconds / (1000*60*60);
  const absoluteHours = Math.floor(hours);
  const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

  //Get remainder from hours and convert to minutes
  const minutes = (hours - absoluteHours) * 60;
  const absoluteMinutes = Math.floor(minutes);
  const m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  const seconds = (minutes - absoluteMinutes) * 60;
  const absoluteSeconds = Math.floor(seconds);
  const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

  return {
    hours: h,
    minutes: m,
    seconds: s,
    negative: milliseconds < 0
  };
}
