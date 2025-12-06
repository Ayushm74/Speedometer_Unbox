import React from 'react';
import ReactDOM from 'react-dom';
import Store from './Store.js';

import Switch from 'react-switch-button';

class Speedometer extends React.Component {

  constructor(props) {
    super(props);
    // initial component state
    this.state = {
      speed: 0,        // raw speed from geolocation (m/s)
      accuracy: 10,    // GPS accuracy
      unit: true,      // true = km/h, false = mph
      geoStatus: false // geolocation status indicator
    };
  }

  componentDidMount() {
    // start watching user's location if supported
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (p) => this._onPosition(p),         // success callback
        (err) => this._onErrorPosition(err),// error callback
        { enableHighAccuracy: true }        // request best accuracy
      );
    }
  }

  render() {
    // compute speed with correct units/validation
    const speed = this._setSpeed();

    // LED indicator: green = on, red = off
    const geoStatus = this.state.geoStatus ? 'on' : 'off';

    // clamp accuracy value visually
    const accuracy = Math.min(this.state.accuracy, 50);

    // dial needle angle calculations
    const angleLimit = 180;
    const angleFactorOne = 1.5;
    const angleFactorTwo = .4;
    let angle = 0;

    // first part of gauge: fast rotation
    if (speed < angleLimit) {
      angle = (speed % angleLimit) * angleFactorOne;
    } else {
      // second part: slower angle progression
      angle = (angleLimit * angleFactorOne) + ((speed - angleLimit) * angleFactorTwo);
    }

    // hard cap at 340 degrees
    angle = Math.min(angle, 340);

    return (
      <div className="Speedometer">
        <div className="Speedometer-speed">
          <div className="Speedometer-status">
            {/* Accuracy dot grows/shrinks */}
            <div className="Speedometer-accuracy"
                 style={{transform: 'scale(' + accuracy / 40 + ')'}}></div>

            {/* GPS status LED */}
            <div className={"Speedometer-led Speedometer-led--" + geoStatus}></div>
          </div>

          {/* Display speed value */}
          {speed}

          {/* Unit switch: km/h <-> mph */}
          <Switch 
            theme="Speedometer-unit"
            name="switch-units"
            label="mph"
            labelRight="km/h"
            checked={this.state.unit ? 'checked' : ''}
            onChange={(e) => this._onSwitch(e)} />
        </div>

        {/* Speedometer dial */}
        <div className="Speedometer-speedo">
          <div 
            className="Speedometer-arrow"
            style={{transform: 'rotate(' + angle + 'deg)'}}></div>
        </div>
      </div>
    );
  }

  // successful GPS update
  _onPosition(position) {
    this.setState({
      speed: position.coords.speed,       // m/s
      accuracy: position.coords.accuracy, // meters
      geoStatus: true                     // GPS active
    });
  }

  // GPS failure or disabled
  _onErrorPosition(error) {
    this.setState({
      geoStatus: false
    });
  }

  // handle unit toggle switch
  _onSwitch(evt) {
    const checked = evt.currentTarget.checked;
    this.setState({
      unit: checked
    });
  }

  // calculate final displayed speed
  _setSpeed() {
    let speed = this.state.speed;

    // if speed is missing OR accuracy is poor
    if (speed == null || this.state.accuracy >= 30) {
      return 0;
    }

    // convert m/s to km/h
    speed *= 3.6;

    // convert to mph if needed
    if (!this.state.unit) {
      speed /= 1.609344;
    }

    // return integer value
    return parseFloat(speed).toFixed(0);
  }

}

Speedometer.displayName = 'Speedometer';

export default Store(Speedometer, ['unit']);
