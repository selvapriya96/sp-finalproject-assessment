import React from 'react';
import { useNavigate } from 'react-router-dom';


const ExamFinish = ({ questions = [], selectedAnswers = {}, userName = 'Student', examName = 'Exam' }) => {
  const navigate = useNavigate();

  const calculateScore = (questions, selectedAnswers) => {
    let score = 0;
    const answersDetail = questions.map((q) => {
      const given = selectedAnswers[q.id] ?? null;
      const correct = q.correctAnswer; 
      const isCorrect = given !== null && given === correct;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        questionText: q.text,
        givenAnswer: given,
        correctAnswer: correct,
        isCorrect,
      };
    });

    const total = questions.length;
    const percentage = total === 0 ? 0 : Math.round((score / total) * 100 * 100) / 100;
    return { score, total, percentage, answersDetail };
  };

  const handleFinish = async () => {
    const { score, total, percentage, answersDetail } = calculateScore(questions, selectedAnswers);


    const resultData = {
      userName,
      examName,
      score,
      total,
      percentage,
      answers: answersDetail,
      takenAt: new Date().toISOString(),
    };


    let resultId = null;
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });

      if (res.ok) {
        const json = await res.json();
       
        resultId = json.id ?? json._id ?? null;
        resultData.resultId = resultId;
      } else {
       
        console.warn('Saving result failed', await res.text());
      }
    } catch (err) {
    
      console.warn('Could not save result to backend', err);
    }

    
    try {
      localStorage.setItem('latestResult', JSON.stringify(resultData));
    } catch (e) {
      console.warn('localStorage write failed', e);
    }

    
    navigate('/result', { state: resultData });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Finish exam</h2>
      <p className="mb-4">When you finish, your answers will be graded and you'll be shown the results.</p>

      <button
        onClick={handleFinish}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit & View Results
      </button>
    </div>
  );
};

export default ExamFinish;
