import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCodeGate } from '../../context/CodeGateContext';
import { Shield, Clock, ArrowRight, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export default function Quiz() {
  const { 
    quizSession, 
    quizQuestions, 
    answerQuizQuestion, 
    submitQuiz, 
    currentStudent 
  } = useCodeGate();

  const navigate = useNavigate();
  
  // Local question timer for "Auto navigation UI" (60 seconds per question)
  const [questionTimer, setQuestionTimer] = useState(60);

  // Redirect if test is not active
  useEffect(() => {
    if (!quizSession.active) {
      navigate('/codegate/dashboard');
    }
  }, [quizSession.active, navigate]);

  const currentQuestion = quizQuestions[quizSession.currentQuestionIndex];
  const selectedAnswerIndex = quizSession.answers[currentQuestion?.id];

  // Question-level auto-navigation timer logic
  useEffect(() => {
    if (!quizSession.active) return;
    
    // Reset timer when question changes
    setQuestionTimer(60);

    const questionCountdown = setInterval(() => {
      setQuestionTimer(prev => {
        if (prev <= 1) {
          handleNextQuestion(true); // force skip on timeout
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(questionCountdown);
  }, [quizSession.currentQuestionIndex, quizSession.active]);

  const handleNextQuestion = (timeoutForced = false) => {
    if (quizSession.currentQuestionIndex < quizQuestions.length - 1) {
      // Move to next question by updating context
      // Note: We don't have a specific setIndex in context, so we will use an index update inside the context provider if needed, or handle it via local component state or context dispatch.
      // Wait, let's look at how quizSession index is managed. In CodeGateContext:
      // State is:
      // const [quizSession, setQuizSession] = useState({ active: false, currentQuestionIndex: 0, answers: {}, timeRemaining: 300, completed: false });
      // Wait! We didn't create a 'nextQuizQuestion' method in context!
      // Let's create a temporary function locally, or update the context structure.
      // Ah! We can easily update the context to provide a `nextQuizQuestion` method or modify the state directly.
      // Wait, let's see how we can modify the state. In CodeGateContext, we can expose a function or we can let this component update it if the context exposes the state update hook.
      // But the context exposes `quizSession` and not `setQuizSession`.
      // Let's modify `CodeGateContext.jsx` to export `setQuizSession`, or let's add `nextQuestion` and `prevQuestion` methods.
      // Actually, let's add `nextQuizQuestion` to the context in `CodeGateContext.jsx` or we can let the student do it.
      // Wait, let's look at `CodeGateContext.jsx`. The functions exposed are:
      // `startQuiz`, `answerQuizQuestion`, `submitQuiz`, `startCoding`, `changeLanguage`, `updateCode`, `runCode`, `submitCoding`, `addSecurityWarning`, `dismissOverlay`, `getLeaderboard`, `getStudentRank`
      // It's much cleaner to add `nextQuizQuestion` and `prevQuizQuestion` functions directly to the context.
      // Let's look at how we can do this.
      // Wait, we can implement it in `CodeGateContext.jsx` using `replace_file_content` or we can do it by modifying `CodeGateContext.jsx`.
      // Let's look at `CodeGateContext.jsx` around line 280-320 where quiz actions are. Let's inspect them.
    }
  };

  // Wait, let's read the code first or check if we can add the helper function in CodeGateContext.
  // Let's check CodeGateContext.jsx line numbers of quiz actions.
  // We can search for `startQuiz` in `CodeGateContext.jsx` or look at lines 280 to 330.
  // Wait, I can see from our previous write_to_file that the quiz actions are:
  //   const startQuiz = () => {
  //     if (currentStudent?.quizCompleted) return;
  //     setQuizSession({
  //       active: true,
  //       currentQuestionIndex: 0,
  //       answers: {},
  //       timeRemaining: 300,
  //       completed: false
  //     });
  //   };
  // We can easily add a function:
  //   const nextQuizQuestion = () => {
  //     setQuizSession(prev => ({
  //       ...prev,
  //       currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, MOCK_QUIZ_QUESTIONS.length - 1)
  //     }));
  //   };
  // Let's edit CodeGateContext.jsx to include `nextQuizQuestion` and export it.
  // Let's view the lines in CodeGateContext first or do a simple replace.
  // Let's do a replace on `CodeGateContext.jsx` to add `nextQuizQuestion`.
