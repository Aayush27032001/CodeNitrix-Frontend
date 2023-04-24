import React, { useState, useRef, useLayoutEffect } from "react";
import "./Layout.css";

const Layout = ({ left, right }) => {
  const [leftWidth, setLeftWidth] = useState(450);
  const [rightWidth, setRightWidth] = useState(10000);
  const [isResizing, setIsResizing] = useState(false);
  const dividerRef = useRef(null);
  const initialDividerPositionRef = useRef(0);

  const onDividerMouseDown = (event) => {
    event.preventDefault();
    initialDividerPositionRef.current = event.clientX;
    setIsResizing(true);
  };

  const onMouseMove = (event) => {
    const newLeftWidth =
      event.clientX - initialDividerPositionRef.current + leftWidth;
    const newRightWidth =
      window.innerWidth - newLeftWidth - dividerRef.current.offsetWidth;
    if (newLeftWidth < 300 || newRightWidth < 300) return;
    setLeftWidth(newLeftWidth);
    setRightWidth(newRightWidth);
  };

  const onMouseUp = () => {
    setIsResizing(false);
  };

  useLayoutEffect(() => {
    if (dividerRef) {
      setRightWidth(window.innerWidth - 450 - dividerRef.current.offsetWidth);
    }
  }, []);
  useLayoutEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing]);

  return (
    <div className="Layout">
      <div
        className={`Layout-left ${isResizing ? "Layout-no-transition" : ""}`}
        style={{ width: `${leftWidth}px` }}
      >
        <div className="left-container">{left}</div>
      </div>
      <div
        ref={dividerRef}
        className="Layout-divider"
        onMouseDown={onDividerMouseDown}
        title="Re-Size"
      >
        <span id="dots" />
      </div>
      <div
        className={`Layout-right ${isResizing ? "Layout-no-transition" : ""}`}
        style={{ width: `${rightWidth}px` }}
      >
        <div className="right-container">{right}</div>
      </div>
    </div>
  );
};

export default Layout;
