fetch("data/exams.json")
  .then(res => res.json())
  .then(exams => {
    const list = document.getElementById("exam-list");
    exams.forEach(exam => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${exam.title}</strong>
        <button onclick="startExam('${exam.id}')">Bắt đầu</button>
      `;
      list.appendChild(li);
    });
  });

function startExam(examId) {
  localStorage.setItem("current_exam", examId);
  window.location.href = "quiz.html";
}
