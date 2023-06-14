import React from "react";
import { nanoid } from "nanoid";

export default function Option(props) {
  const styles = {
    backgroundColor: props.optionObject.isHeld ? "#D6DBF5" : "",
  };

  return (
    <div className="each-option" onClick={props.handleClick} style={styles}>
      <h3>{props.optionObject.optionValue}</h3>
    </div>
  );
}
