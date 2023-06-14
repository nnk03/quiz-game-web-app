import React from "react";

export default function Option(props) {
  function generateStyles() {
    if (props.optionObject.isHeld) {
      if (props.optionObject.isCorrect) {
        return {
          backgroundColor: "#94D7A2",
        };
      } else {
        return {
          backgroundColor: "red",
          opacity: 0.5,
        };
      }
    } else {
      if (props.optionObject.isCorrect) {
        return {
          backgroundColor: "#94D7A2",
          opacity: 0.5,
        };
      } else {
        return { opacity: 0.5 };
      }
    }
  }

  const styles = generateStyles();

  return (
    <div className="each-option" onClick={props.handleClick} style={styles}>
      <h3>{props.optionObject.optionValue}</h3>
    </div>
  );
}
