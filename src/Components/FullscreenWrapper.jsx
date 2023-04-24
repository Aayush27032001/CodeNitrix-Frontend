import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'


function FullscreenWrapper({ children }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenTimer, setFullScreenTimer] = useState(10);
  const [flagedAsCopyCase, setFlagedAsCopyCase] = useState(false);
  useEffect(()=>{
    const handleFullScreen = () => {
      // eslint-disable-next-line no-restricted-globals
      if(window.screen.height === window.innerHeight){
        setIsFullScreen(true);
      }else{
        setIsFullScreen(false);
      }
    }
    handleFullScreen();
    window.addEventListener("resize",handleFullScreen);
    return ()=>{
      window.removeEventListener("resize",handleFullScreen);
    }
  },[])
  const toggleFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
      setIsFullScreen(true);
    }
  }
  useEffect(()=>{toggleFullScreen()},[])
  useEffect(()=>{
    if(fullScreenTimer<0){
      setFlagedAsCopyCase(true);
    }
  },[fullScreenTimer])
  useEffect(()=>{
    let interval;
    if(isFullScreen){
      setFullScreenTimer(10);
    }else{
      interval = setInterval(()=>{
        setFullScreenTimer((prev)=>prev-1)
      },1000)
    }
    return ()=>{
      clearInterval(interval);
    }
  },[isFullScreen])
  if (!isFullScreen) {
    return <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection:"column" ,justifyContent: "center", alignItems: "center" }}>
        {flagedAsCopyCase ? <Typography variant="body1" color="red" fontSize="24px" mb="1rem">You are Flagged As a Copy Case</Typography> : <Typography variant="body1" color="initial" mb="1rem">Go Back to Full Screen mode within {fullScreenTimer} {fullScreenTimer>1 ? "seconds" : "second"}</Typography>}
        <Typography variant="body1" color="initial">Please Dont Exit fullscreen, This may lead to disqualification</Typography>
        <Button size="small" sx={{mt:"1rem"}} onClick={toggleFullScreen} variant="contained" color="primary">
          Go Back To Full Screen
        </Button>
      </div>;
  } else {
    return <>{children}</>;
  }
}

export default FullscreenWrapper;
