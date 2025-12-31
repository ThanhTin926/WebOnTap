function calculateScore(questions, answers) {
  let correct = 0;
  questions.forEach((q, i) => {
    if (q.correctIndex === answers[i]) correct++;
  });
  return {
    correct,
    total: questions.length,
    score: Math.round((correct / questions.length) * 100),
    time: new Date().toLocaleString()
  };
}
