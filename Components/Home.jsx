import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Question from './Question'
import he from 'he'
import { Circles } from 'react-loader-spinner'


export default function Home() {
  // State variables
  const [quizPage, setQuizPage] = useState(false)
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)
  const [circlesRunning, setCirclesRunning] = useState(false)

  // Handle click event to start quiz
  function handleClick() {
    setCirclesRunning(true)
    getQuestions()
    setTimeout(() => {
      setQuizPage(true)
      setCirclesRunning(false)
    }, 1500)
  }



  async function getQuestions() {
    const res = await fetch('https://opentdb.com/api.php?amount=5&category=18&difficulty=medium')
    const data = await res.json()
    const allQuestions = data.results.map((qs) => {
      //destructuring question and answers and randomize all answers
      const { question, correct_answer, incorrect_answers } = qs
      const allAnswers = [...incorrect_answers, correct_answer]
      const randomizedAnswers = shuffleArray(allAnswers)
      return {
        //using react he to decode question and answers html content
        question: he.decode(question),
        correct_answer: he.decode(correct_answer),
        incorrect_answers: randomizedAnswers.map(answer => he.decode(answer)),
        id: nanoid(),
        isHeld: false,
        scores: 0
      }
    })
    setQuestions(allQuestions)
  }

  // Shuffle an array using
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Update selected answer for a question
  function holdAnswer(id, answer) {
    const decodedAnswer = he.decode(answer);
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.id === id ?
        { ...question, selectedAnswer: decodedAnswer }
        : question
      )
    )
  }


  // Check user's answers and update score
  // Handler function for checking the quiz answers
  function checkAnswer() {
    const newScore = questions.filter(question => question.selectedAnswer === question.correct_answer).length
    setScore(newScore)
  }

  // Reset the state variables to their initial values
  function handlePlayAgainClick() {
    setTimeout(() =>{
      getQuestions()
      setScore(0)
    }, 1000)
  }

  const isLoading = <Circles
    height="80"
    width="80"
    color="#293264"
    ariaLabel="circles-loading"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  />

  // Render the quiz or the intro section based on quizPage state
  return (
    <main>
      {circlesRunning && (
        <div className='loading--page'>
          {isLoading}
        </div>
      )}
      {!circlesRunning && (
        <div>
          <div className="intro--section" style={{ display: quizPage ? "none" : null }}>
            <h1>Quizzical</h1>
            <p>Some description if needed</p>
            <button onClick={handleClick}>Start quiz</button>
          </div>
          {quizPage && (
            <div>
              <h1 className="intro-txt">Welcome to Quizzical</h1>
              <Question
                questions={questions}
                holdAnswer={holdAnswer}
                checkAnswer={checkAnswer}
                score={score}
                onPlayAgain={handlePlayAgainClick}
                isLoading={isLoading}
              />
              {score === 5 && <Confetti />}
            </div>
          )}
        </div>
      )}
    </main>
  );

}
