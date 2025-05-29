import React, { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const timerProps = {
  size: 300,
  strokeWidth: 12,
};

export default function Timer() {
  return (
    <div className="flex flex-col justify-center items-center">
      <CountdownCircleTimer
        isPlaying
        duration={7}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[7, 5, 2, 0]}
        {...timerProps}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  );
}
