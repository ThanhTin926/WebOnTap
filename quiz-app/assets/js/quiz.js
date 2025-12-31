let selectedQuestions = [];
let userAnswers = [];
let timeLeft;
let timerInterval;

async function initQuiz() {
  const examId = localStorage.getItem("current_exam");
  const exams = await fetch("data/exams.json").then(r => r.json());
  const exam = exams.find(e => e.id === examId);

  document.getElementById("exam-title").innerText = exam.title;
  timeLeft = exam.timeLimit;

  const allQuestions = await fetch("data/questions.json")
    .then(r => r.json())
    .then(d => d.questions);

  let filtered = allQuestions.filter(q => q.topic === exam.topic);
  if (exam.random) filtered.sort(() => Math.random() - 0.5);
  selectedQuestions = filtered.slice(0, exam.questionCount);

  renderQuestions();
  startTimer();
}

function renderQuestions() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  selectedQuestions.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>Câu ${i + 1}:</b> ${q.content}</p>
      ${q.options
        .map(
          (opt, idx) =>
            `<label>
              <input type="radio" name="q${i}" value="${idx}">
              ${opt}
            </label><br>`
        )
        .join("")}
    `;
    container.appendChild(div);
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText =
      "⏱ Thời gian còn lại: " + timeLeft + "s";

    if (timeLeft <= 0) submitQuiz();
  }, 1000);
}

function submitQuiz() {
  clearInterval(timerInterval);

  selectedQuestions.forEach((q, i) => {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    userAnswers[i] = checked ? parseInt(checked.value) : -1;
  });

  const result = calculateScore(selectedQuestions, userAnswers);
  saveHistory(result);

  localStorage.setItem("last_result", JSON.stringify(result));
  window.location.href = "result.html";
}

initQuiz();
