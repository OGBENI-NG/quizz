import React, { useState } from 'react'

export default function Question(props) {
  // Destructure props
  const { questions, holdAnswer, checkAnswer, score, onPlayAgain, isLoading } = props

  // State to toggle showing the scores
  const [showScores, setShowScores] = useState(false)
  const [loadingNewQuestions, setLoadingNewQuestions] = useState(false)
  
  // Map through the questions array to render each question and its corresponding answers
    const questionAnswerElements = questions.map((question) => {
        const {
        question: questionText, // The question text
        correct_answer: correctAnswer, // The correct answer
        incorrect_answers: incorrectAnswers, // The incorrect answers
        id, // The unique id of the question
        selectedAnswer, // The answer selected by the user
        } = question
    
        // Combine the correct and incorrect answers into one array
        const allAnswers = [...incorrectAnswers, correctAnswer]
        // Remove duplicate answers
        .filter((answer, index, self) => self.indexOf(answer) === index);
    
        // Determine if the selected answer is correct
        const isCorrect = selectedAnswer === correctAnswer
    
        // Render each answer option
        return (
        <div key={id} className="question--answer">
            <p className="question">{questionText}</p>
            <div className="answer-container">
            {allAnswers.map((answer) => {
                const isSelected = selectedAnswer === answer
                // Determine the background color of the answer option based on whether,
                // the quiz has been checked and if the answer is correct
                const backgroundColor = showScores
                ? isSelected
                    ? isCorrect
                    ? '#94D7A2' // Correct answer that was selected
                    : '#F8BCBC' // Incorrect answer that was selected
                    : answer === correctAnswer
                    ? '#94D7A2' // Correct answer that was not selected
                    : 'rgba(180, 180, 180, 0.301)' // Incorrect answer that was not selected
                : isSelected
                    ? '#D6DBF5' // Answer that is currently selected but quiz has not been checked
                    : '#F5F7FB' // Answer that is not selected and quiz has not been checked
    
                // Render each answer option as a span element with a background color 
                //determined by its correctness and selection status
                return (
                <span
                    key={answer}
                    className="answer"
                    style={{ backgroundColor }}
                    onClick={() => holdAnswer(id, answer)}
                >
                    {answer}
                </span>
                )
            })}
            </div>
            <hr />
        </div>
        )
        
    })

  // Handler function for checking the quiz answers and showing the scores
  const handleCheckAnswer = () => {
    setShowScores(true)
    checkAnswer()
  }

  //Handle play again button click
  function handlePlayAgainClick() {
    setLoadingNewQuestions(true)
    onPlayAgain();
    setTimeout(() => {
        setLoadingNewQuestions(false)
        setShowScores(false);
    }, 2000)
    
  }
   


    return (
        <section>
            <div className="question-page" >
                {!loadingNewQuestions && (
                    <div style={{ display: loadingNewQuestions ? "none" : null }}>
                        {questionAnswerElements}
                        <div className="check--answer--container" >
                            {/* Show the quiz scores if the quiz has been checked */}
                            {showScores ? (
                                <h4>You scored {score}/{questions.length} correct answers</h4>
                            ) : null}
                            {/* Button to check the quiz answers */}
                            {!showScores && 
                                <button 
                                    className="check--answer" 
                                    onClick={handleCheckAnswer}
                                >
                                Check Answer
                                </button>
                            }
                            {showScores && 
                                <button 
                                    className="check--answer" 
                                    onClick={ handlePlayAgainClick}
                                > Play Again
                                </button>
                            }
                        </div>
                    </div>
                )}
                <div 
                    className='replay-loading-page'  
                    style={{ display: !loadingNewQuestions ? "none" : null }}
                >
                    {loadingNewQuestions && isLoading}
                </div>
                
            </div>
        </section>
        
    )
}
