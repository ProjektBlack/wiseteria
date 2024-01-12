import React, { useState, useEffect, useRef } from 'react';
const beepSound = new Audio('./../public/beep.mp3');

const PomodoroTimer = () => {
  //try
  const [currentTimer, setCurrentTimer] = useState("Session")
  //session states
  const [isSessionTime, setIsSessionTime] = useState(false)
  const [sessionLength, setSessionLength] = useState(25) //need this as a reference since timer resets back to this after the break
  const [sessionTimeLeft, setSessionTimeLeft] = useState(sessionLength * 60) //this is in seconds
  const [sessionMins, setSessionMins] = useState(0)
  const [sessionSecs, setSessionSecs] = useState(0)
  //break states
  const [isBreakTime, setIsBreakTime] = useState(false)
  const [breakLength, setBreakLength] = useState(5)
  const [breakTimeLeft, setBreakTimeLeft] = useState(sessionLength * 60)
  const [breakMins, setBreakMins] = useState(0)
  const [breakSecs, setBreakSecs] = useState(0)
  //reference
  const breakTimer = useRef();
  const sessionTimer = useRef();

  //timer for session state
  function startSessionTimer() {
    setIsSessionTime(!isSessionTime)
  }

  useEffect(() => {

    if (isSessionTime) {
      if (sessionTimeLeft === 0) {
        //reset session related states to match the session length and set is session time to false, then set break time to true
        beepSound.play();
        setSessionTimeLeft(sessionLength * 60);
        setSessionMins(Math.floor(sessionLength / 60));
        setSessionSecs(0);
        setIsSessionTime(false);
        setIsBreakTime(true);
        setCurrentTimer("Break")
      } else {
        setCurrentTimer("Session")
        sessionTimer.current = setInterval(() => {
          setSessionTimeLeft((prevTime) => prevTime - 1);
          setSessionMins(Math.floor(sessionTimeLeft / 60));
          setSessionSecs(sessionTimeLeft % 60);
        }, 50);
      }
    }
    if (sessionTimeLeft >= 0) {
      setSessionMins(Math.floor(sessionTimeLeft / 60));
      setSessionSecs(sessionTimeLeft % 60);
    }

    return () => clearInterval(sessionTimer.current);
  }, [sessionLength, isSessionTime, sessionTimeLeft]);

  //timer for break 
  function startBreakTimer() {
    setIsBreakTime(!isBreakTime)
  }

  useEffect(() => {

    if (isBreakTime) {
      if (breakTimeLeft === 0) {
        beepSound.play();
        setBreakTimeLeft(breakLength * 60);
        setBreakMins(Math.floor(breakLength / 60));
        setBreakSecs(0);
        setIsBreakTime(false);
        setIsSessionTime(true);
        setCurrentTimer("Session")
      } else {
        setCurrentTimer("Break")
        breakTimer.current = setInterval(() => {
          setBreakTimeLeft((prevTime) => prevTime - 1);
          setBreakMins(Math.floor(breakTimeLeft / 60));
          setBreakSecs(breakTimeLeft % 60);
        }, 50);
      }
    }
    if (breakTimeLeft <= 0) {
      setBreakMins(Math.floor(breakTimeLeft / 60));
      setBreakSecs(breakTimeLeft % 60);
    }

    return () => clearInterval(breakTimer.current);
  }, [breakLength, isBreakTime, breakTimeLeft]);

  function resetTimer() {
    clearInterval(sessionTimer.current);
    clearInterval(breakTimer.current);
    setCurrentTimer("Session");
    setSessionLength(25);
    setBreakLength(5);
    setIsSessionTime(false);
    setIsBreakTime(false);
    setSessionTimeLeft(sessionLength * 60);
    setBreakTimeLeft(breakLength * 60);
    setSessionMins(Math.floor(sessionLength));
    setSessionSecs(0);
    setBreakMins(Math.floor(breakLength));
    setBreakSecs(0);
  }

  function handleSessionLengthIncrement() {
    setSessionLength((prevLength) => {
      const newLength = Math.max(prevLength + 1, 1);
      const newTimeLeft = newLength * 60;
      setSessionTimeLeft(newTimeLeft);
      setSessionMins(Math.floor(newTimeLeft / 60));
      setSessionSecs(newTimeLeft % 60);
      return newLength;
    });
  }
  function handleBreakLengthIncrement() {
    setBreakLength((prevLength) => {
      const newLength = prevLength + 1;
      const newTimeLeft = newLength * 60;
      setBreakTimeLeft(newTimeLeft);
      setBreakMins(Math.floor(newTimeLeft / 60));
      setBreakSecs(newTimeLeft % 60);
      return newLength;
    });
  }
  function handleSessionLengthDecrement() {
    setSessionLength((prevLength) => {
      const newLength = Math.max(prevLength - 1, 1);
      const newTimeLeft = newLength * 60;
      setSessionTimeLeft(newTimeLeft);
      setSessionMins(Math.floor(newTimeLeft / 60));
      setSessionSecs(newTimeLeft % 60);
      return newLength;
    });
  }
  function handleBreakLengthDecrement() {
    setBreakLength((prevLength) => {
      const newLength = Math.max(prevLength - 1, 1); // Ensure length doesn't go below 1
      const newTimeLeft = newLength * 60;
      setBreakTimeLeft(newTimeLeft);
      setBreakMins(Math.floor(newTimeLeft / 60));
      setBreakSecs(newTimeLeft % 60);
      return newLength;
    });
  }
  return (
    <div >
      <div className='row text-center p-2'>
        <h1 className='text-white'>Wiseteria</h1>
      </div>
      <div className='container' style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}>
        <div className='row'>
          <div className='col container text-center column-circle'>
            <div className='col'>
              <button id="session-increment" className='btn' onClick={handleSessionLengthIncrement} disabled={sessionLength == 60}>+</button>
            </div>
            <div className='col'>
              <h5 id="session-label" className='labels' >Session</h5>
              <h1 id="session-length" value={sessionLength}>{sessionLength}</h1>
              <h5 id="session-label" className='labels' >Length</h5>
            </div>
            <div className='col'>
              <button id="session-decrement" className='btn' onClick={handleSessionLengthDecrement} disabled={sessionLength == 1}>-</button>
            </div>
          </div>
          <div className='col  column-circle-middle'>
            {currentTimer == "Break" ?
              <div className='text-center '>

                <h1 id="time-left">{breakMins + ":" + (breakSecs < 10 ? "0" + breakSecs : breakSecs)}</h1>
                <h1 id="timer-label">Break {!isBreakTime && !isSessionTime ? "Timer" : "ongoing!"}</h1>
                <button id="start_stop" onClick={startBreakTimer}>{isBreakTime || isSessionTime ? "Pause" : "Start"}</button>
                <button id="reset" onClick={resetTimer}>Reset</button>
              </div>
              : currentTimer == "Session" ?
                <div className='text-center'>
                  <button id="start_stop" className='btn' onClick={startSessionTimer}>{isBreakTime || isSessionTime ? "Pause" : "Start"}</button>
                  <h1 id="time-left">{sessionMins + ":" + (sessionSecs < 10 ? "0" + sessionSecs : sessionSecs)}</h1>
                  <h5 id="timer-label" className='labels'>Session {!isBreakTime && !isSessionTime ? "Timer" : "ongoing!"}</h5>
                  <button id="reset" className='btn' onClick={resetTimer}>Reset</button>
                </div>
                : ''}
          </div>
          <div className='col container border text-center  column-circle'>
            <div className='col'>
              <button id="break-increment" className='btn' onClick={handleBreakLengthIncrement} disabled={breakLength == 60}>+</button>
            </div>
            <div className='col'>
              <h5 id="break-label" className='labels' >Break</h5>
              <h1 id="break-length" value={breakLength}>{breakLength}</h1>
              <h5 id="break-label" className='labels'>Length</h5>
            </div>
            <div className='col'>
              <button id="break-decrement" className='btn' onClick={handleBreakLengthDecrement} disabled={breakLength == 1}>-</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PomodoroTimer;
