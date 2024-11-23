import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, refFromURL } from "firebase/database";

const Play = () => {
  const navigator = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [questionNo, setQuestionNo] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const fetchQuizzesData = () => {
    const db = getDatabase();
    const starCountRef = ref(db, "quizzes/");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

      const newArr = Object.keys(data).map((quizId) => {
        return { id: quizId, ...data[quizId] };
      });
      setQuizzes(newArr);
    });
  };

  useEffect(() => {
    fetchQuizzesData();
    const lsUserData = localStorage.getItem("user");
    if (lsUserData == null) {
      navigator("/");
    }
  }, []);

  return (
    <>
      <div className="w-full h-screen flex items-center p-4 bg-gradient-to-r from-blue-100 to-green-100">
        <div className="w-full max-w-xl mx-auto p-4   text-center border shadow-lg bg-white rounded-md">
          <h1 className="text-2xl font-bold mb-4">Play Quiz</h1>

          <Display
            quiz={quizzes[questionNo]}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setQuestionNo(questionNo - 1)}
              disabled={questionNo <= 0 && true}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => {
                setQuestionNo(questionNo + 1)
                setSelectedOption(null)
              }}
              disabled={quizzes.length - 1 == questionNo && true}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>

          {/* Quiz Completion Message */}
          {/* {currentQuestion === quizData.length - 1 && selectedOption !== null && (
          <div className="mt-4 text-lg">
            <p>
              Quiz Completed! Your score: {score}/{quizData.length}
            </p>
          </div>
        )} */}
        </div>
      </div>
    </>
  );
};

export default Play;

function Display({ quiz, setSelectedOption, selectedOption }) {
  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  return (
    <>
      <div className="text-xl mb-6">
        <p>{quiz?.question}</p>
      </div>
      <div className="flex flex-col gap-4">
        {quiz &&
          [quiz.option1, quiz.option2, quiz.option3, quiz.option4].map(
            (option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`py-2 px-4 rounded-lg border ${
                  selectedOption === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            )
          )}
      </div>
    </>
  );
}