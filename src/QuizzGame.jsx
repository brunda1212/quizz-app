import React, { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { ThreeDots } from "react-loader-spinner"

function QuizzGame() {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(true) 
  const [isError, setIsError] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeLeft, setTimeLeft] = useState(25)
  const [quizFinished, setQuizFinished] = useState(false)

  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [unattempted, setUnattempted] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])


  useEffect(() => {
    const fetchQuestions = async () => {
      const jwtToken = Cookies.get("jwt_token")
      const url = "https://apis.ccbp.in/assess/questions"

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwtToken}` },
        })
        if (response.ok) {
          const data = await response.json()
          setQuestions(data.questions.slice(0, 10))
          setIsLoading(false)
        } else {
          setIsError(true)
          setIsLoading(false)
        }
      } catch (error) {
        setIsError(true)
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // timer logic
  useEffect(() => {
    if (quizFinished || isLoading || isError) return

    if (timeLeft === 0) {
      handleSubmit()
      return
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timerId)
  }, [timeLeft, currentIndex, quizFinished, isLoading, isError])

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    const currentQuestion = questions[currentIndex]

    if (selectedOption === null) {
      setUnattempted((prev) => [...prev, currentQuestion])
    } else {
      const correctOption = currentQuestion.options.find((o) => o.is_correct)
      if (selectedOption === correctOption.id) {
        setScore((prev) => prev + 1)
      } else {
        setWrong((prev) => prev + 1)
      }
    }

    goToNextQuestion()
  }

  const goToNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setTimeLeft(25)
    } else {
      setQuizFinished(true)
    }
  }

  // Splash loader (always shows 5s)
  if (showSplash) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#263868" height={90} width={90} />
      </div>
    )
  }

  // API loader (only if data is not ready after splash ends)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading questions...</p>
      </div>
    )
  }

  // error screen
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src="https://assets.ccbp.in/frontend/react-js/quiz-game-error-img.png"
          alt="warning icon"
          className="w-64"
        />
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  // quiz finished screen
  if (quizFinished) {
    const totalQuestions = questions.length
    const moreCorrect = score >= wrong

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-3xl p-6 rounded-xl bg-white shadow text-center">
          {moreCorrect ? (
            <div>
              <img
                src="https://res.cloudinary.com/dm6xqukvo/image/upload/v1734446899/trophy_c8zn5f.png"
                alt="Trophy"
                className="mx-auto w-24 mb-4"
              />
              <h2 className="text-2xl font-bold text-blue-600 mb-2">
                Congrats!
              </h2>
              <p className="text-lg font-medium text-gray-700 mb-4">
                {Math.round((score / totalQuestions) * 100)}% Correctly Answered
              </p>
              <p className="text-gray-500 mb-6">Quiz completed successfully.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Restart
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Home
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {score + wrong + unattempted.length}/{totalQuestions}
              </div>
              <div className="flex justify-center space-x-6 mb-6">
                <p className="text-green-600">✅ {score} Correct answers</p>
                <p className="text-red-600">❌ {wrong} Wrong answers</p>
                <p className="text-blue-600">⏳ {unattempted.length} Unattempted</p>
              </div>

              {unattempted.length > 0 ? (
                <>
                  <h2 className="text-xl font-bold text-blue-600 mb-4">
                    Unattempted Questions
                  </h2>
                  <div className="space-y-6 text-left">
                    {unattempted.map((q, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-gray-50"
                      >
                        <p className="font-medium mb-2">{q.question_text}</p>
                        <ul className="space-y-2">
                          {q.options.map((opt) => {
                            const isCorrect = opt.is_correct
                            return (
                              <li
                                key={opt.id}
                                className={`px-3 py-2 rounded border ${
                                  isCorrect
                                    ? "bg-green-200 border-green-500"
                                    : "bg-gray-100"
                                }`}
                              >
                                {opt.text}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-lg font-semibold text-blue-500 mt-4">
                  Attempted all the questions
                </p>
              )}

              {/* Buttons row */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Restart
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // quiz playing screen
  const currentQuestion = questions[currentIndex]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Question {currentIndex + 1} of {questions.length}
      </h1>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{currentQuestion.question_text}</h2>
        <span className="text-red-500 font-bold">⏳ {timeLeft}s</span>
      </div>
      <ul className="space-y-3 mb-4">
        {currentQuestion.options.map((opt) => {
          let btnStyle =
            "w-full px-4 py-2 rounded-lg border text-left cursor-pointer"
          if (selectedOption === opt.id) {
            btnStyle += " bg-blue-500 text-white"
          } else {
            btnStyle += " bg-white hover:bg-gray-100"
          }
          return (
            <li key={opt.id}>
              <button
                className={btnStyle}
                onClick={() => handleOptionClick(opt.id)}
              >
                {opt.text}
              </button>
            </li>
          )
        })}
      </ul>
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Submit
      </button>
    </div>
  )
}

export default QuizzGame
