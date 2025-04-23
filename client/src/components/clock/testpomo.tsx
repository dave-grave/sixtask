import { useState, useRef, useEffect } from "react";
import { formatTime, createTimer } from "../../utils";

const [mode, setMode] = useState("work"); // work, break, null
const modeRef = useRef(mode);
const [secondsLeft, setSecondsLeft] = useState(0);
const secondsLeftRef = useRef(secondsLeft);

function tick() {
  secondsLeftRef.current--;
  setSecondsLeft(secondsLeftRef.current);
}

useEffect(() => {
  function switchMode() {
    const nextMode = modeRef.current === "work" ? "break" : "work";

    setMode(nextMode);
  }
});
