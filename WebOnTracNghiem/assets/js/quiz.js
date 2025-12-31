let selectedQuestions = [];
let userAnswers = [];
let timeLeft;
let timerInterval;

async function initQuiz() {
  const examId = localStorage.getItem("current_exam");
  if (!examId) return window.location.href = "index.html"; // Redirect nếu chưa chọn bài

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

  // Khởi tạo mảng câu trả lời với -1 (chưa chọn)
  userAnswers = new Array(selectedQuestions.length).fill(-1);

  renderQuestions();
  startTimer();
  updateProgressBar();
}

function renderQuestions() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  selectedQuestions.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>Câu ${i + 1}:</b> ${q.content}</p>
      ${q.options.map((opt, idx) => `
          <label>
            <input type="radio" name="q${i}" value="${idx}" onchange="selectAnswer(${i}, ${idx})">
            ${opt}
          </label><br>
        `).join("")}
    `;
    container.appendChild(div);
  });
}

function selectAnswer(questionIndex, answerIndex) {
  userAnswers[questionIndex] = answerIndex;
  updateProgressBar();
}

function updateProgressBar() {
  const answeredCount = userAnswers.filter(a => a !== -1).length;
  const total = selectedQuestions.length;
  const percent = (answeredCount / total) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").innerText = 
      `⏱ Thời gian: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeLeft <= 0) submitQuiz();
  }, 1000);
}

function submitQuiz() {
  clearInterval(timerInterval);
  
  // Tính điểm
  const result = calculateScore(selectedQuestions, userAnswers);
  
  // Lưu lịch sử (chỉ lưu thông tin cơ bản)
  const examId = localStorage.getItem("current_exam");
  const historyItem = { ...result, examId, date: new Date().toLocaleString() }; // Spread syntax
  saveHistory(historyItem);

  // Lưu kết quả chi tiết để hiển thị trang result (gồm cả câu hỏi và đáp án)
  const detailedResult = {
    ...result,
    questions: selectedQuestions,
    userAnswers: userAnswers
  };
  localStorage.setItem("last_result", JSON.stringify(detailedResult));
  
  window.location.href = "result.html";
}

initQuiz();
