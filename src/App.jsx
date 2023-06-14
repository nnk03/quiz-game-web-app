import { nanoid } from "nanoid";
import React from "react";
// import questionData from "./data";
import Option from "./Option";
import Question from "./Question";
import CheckedOption from "./CheckedOption";

export default function App() {
	// let toggleNewQuestions = true;
	// const resetQuestions = questionData;

	// for shuffling the option array
	function shuffleOptionArray(optionArray) {
		for (let i = optionArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = optionArray[i];
			optionArray[i] = optionArray[j];
			optionArray[j] = temp;
		}
		return optionArray;
	}

	// for defining a new type of object which contains the options as an array of

	function makeQuestionObjectArray(questionArrayFromApi) {
		const questionDataArray = questionArrayFromApi.map((question) => {
			let option = [
				...question.incorrect_answers,
				question.correct_answer,
			];
			// option = shuffle(option);
			option = shuffleOptionArray(option);
			const optionObject = option.map((option) => {
				//array of option objects
				return {
					optionId: nanoid(),
					optionValue: option,
					isHeld: false,
					isCorrect:
						option === question.correct_answer ? true : false,
				};
			});
			return {
				...question,
				options: optionObject,
				questionId: nanoid(),
			};
		});
		return questionDataArray;
	}

	const [questions, setQuestions] = React.useState([]);
	// console.log(questions);

	const [isHomePage, setIsHomePage] = React.useState(true);
	const [isAnswerPage, setIsAnswerPage] = React.useState(false);

	function startQuiz() {
		setIsHomePage(false);
	}

	function renderOptions(questionObject) {
		if (isAnswerPage === false) {
			return questionObject.options.map((option) => {
				return (
					<Option
						key={nanoid()}
						optionObject={option}
						handleClick={() => {
							holdOption(
								questionObject.questionId,
								option.optionId
							);
						}}
					/>
				);
			});
		} else {
			return questionObject.options.map((option) => {
				return (
					<CheckedOption
						key={nanoid()}
						optionObject={option}
						// handleClick={() => {
						//   holdOption(questionObject.questionId, option.optionId);
						// }}
					/>
				);
			});
		}
	}
	function allOptionNotHeld(questionId, questionObjectArray) {
		const [questionObject] = questionObjectArray.filter(
			(question) => question.questionId === questionId
		);
		const heldOptionArray = questionObject.options.filter(
			(option) => option.isHeld === true
		);
		return heldOptionArray.length <= 1;
	}

	function holdOption(questionId, optionId) {
		// console.log(questionId);
		// console.log("clicked");
		// console.log(
		//   questions.filter((question) => questionId === question.questionId)
		// );
		// allOptionNotHeld(questionId);

		setQuestions((prevQuestions) => {
			const newQuestions = prevQuestions.map((questionObject) => {
				return questionObject.questionId === questionId
					? {
							...questionObject,
							options: questionObject.options.map((option) => {
								return option.optionId === optionId
									? {
											...option,
											isHeld: !option.isHeld,
									  }
									: option;
							}),
					  }
					: questionObject;
			});
			return allOptionNotHeld(questionId, newQuestions)
				? newQuestions
				: prevQuestions;
		});
	}

	function renderQuestionAndOptions(questionObjectArray) {
		if (isAnswerPage === false) {
			// toggleNewQuestions = !toggleNewQuestions;
			return questionObjectArray.map((questionObject) => {
				return (
					//{" "}<div className="question-ans">
					//{" "}<div className="question">
					// <h3>{questionObject.question}</h3>
					//{" "}</div>
					// <div className="options">{renderOptions(questionObject)}</div>
					//{" "}</div>
					<Question
						key={nanoid()}
						questionObject={questionObject}
						renderOptions={() => renderOptions(questionObject)}
						// handleClick={() => holdOption()}
					/>
				);
			});
		} else {
			return questionObjectArray.map((questionObject) => {
				return (
					// <div className="question-ans">
					//   <div className="question">
					//     <h3>{questionObject.question}</h3>
					//   </div>
					//   <div className="options">{renderOptions(questionObject)}</div>
					// </div>
					<Question
						key={nanoid()}
						questionObject={questionObject}
						renderOptions={() => renderOptions(questionObject)}
						// handleClick={() => holdOption()}
					/>
				);
			});
		}
	}
	// in order to change the questions after clicking play again
	const [count, setCount] = React.useState(1);

	React.useEffect(() => {
		fetch("https://opentdb.com/api.php?amount=5&type=multiple")
			.then((res) => res.json())
			// .then((data) => )
			.then((data) =>
				setQuestions(makeQuestionObjectArray(data.results))
			);

		console.log(count);
	}, [count]);

	function playAgain() {
		setCount((prevCount) => prevCount + 1);
		// setQuestions(resetQuestions);
		setIsAnswerPage(false);
	}

	function submitAnswers() {
		setIsAnswerPage(true);
	}
	function findScore() {
		const correctAnswersArray = questions.filter((question) => {
			const [selectedOption] = question.options.filter(
				(option) => option.isHeld === true
			);
			// if selectedOption exists
			if (selectedOption && selectedOption.isCorrect === true) {
				return true;
			} else {
				return false;
			}
		});
		return correctAnswersArray.length;
	}

	if (isHomePage) {
		return (
			<main className="home-page">
				<div className="home-page-div">
					<div className="home-page-components">
						<h2 className="quizzical">Quizzical</h2>
					</div>
					<div className="home-page-components">
						<p className="description">
							The quiz consists of {questions.length} single
							correct multiple choice question
							{questions.length > 1 ? "s" : ""}.
						</p>
					</div>
					<div className="home-page-components">
						<button
							className="start-quiz-button"
							onClick={startQuiz}
						>
							Start Quiz
						</button>
					</div>
				</div>
			</main>
		);
	} else if (isHomePage === false) {
		if (isAnswerPage === false) {
			return (
				<main className="quiz-questions-page">
					<div className="all-question">
						{/* <div className="question-ans">
              <div className="question">{questions[3].question}</div>
              <div className="options">{renderOptions(questions[3])}</div>
            </div> */}
						{renderQuestionAndOptions(questions)}
						<div className="submit-button" onClick={submitAnswers}>
							<h3>Check answers</h3>
						</div>
					</div>
				</main>
			);
		} else {
			const score = findScore();

			return (
				<main className="quiz-questions-page">
					{/* <p>This is answer page</p> */}
					<div className="all-question">
						{/* <div className="question-ans">
              <div className="question">{questions[3].question}</div>
              <div className="options">{renderOptions(questions[3])}</div>
            </div> */}
						{renderQuestionAndOptions(questions)}
						<div className="play-again-button-and-score">
							<div className="score">
								<h3>
									You scored {score}/{questions.length}{" "}
									correct answer
									{score > 1 ? "s" : ""}{" "}
								</h3>
							</div>
							<div
								className="play-again-button"
								onClick={playAgain}
							>
								<h3>Play Again</h3>
							</div>
						</div>
					</div>
				</main>
			);
		}
	}
}

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className="App">
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src="/vite.svg" className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://reactjs.org" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </div>
//   )
// }

// export default App
