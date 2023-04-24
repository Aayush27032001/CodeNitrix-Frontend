import React, { useEffect } from "react";

const DisableDevTools = ({ children }) => {
  useEffect(() => {
    // Disable F12 key
    document.onkeydown = function (e) {
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        return false;
      }
    };

    // Disable right-click context menu
    document.oncontextmenu = function (e) {
      e.preventDefault();
      return false;
    };

    // Disable inspector
    document.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        e.preventDefault();
        return false;
      }
    });

    // Check for devtools
    return ()=>{
      document.onkeydown = "";
      document.oncontextmenu = "";
      document.removeEventListener("mousedown",()=>{});
    }
  },[]);

  return <>{children}</>;
};

export default DisableDevTools;
