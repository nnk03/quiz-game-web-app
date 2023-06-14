import React from "react";
import Option from "./Option";

export default function Question(props) {
  // const optionElements = props.optionElements();
  return (
    <div className="question-ans">
      <div className="question">
        <h3>{props.questionObject.question}</h3>
      </div>
      <div className="options">{props.renderOptions()}</div>
    </div>
  );
}
