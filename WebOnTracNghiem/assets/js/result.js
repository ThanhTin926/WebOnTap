const result = JSON.parse(localStorage.getItem("last_result"));

if (result) {
  // 1. Hiển thị điểm số tổng quan
  document.getElementById("result").innerHTML = `
    <h3>Kết quả: ${result.score}/100</h3>
    <p>Số câu đúng: ${result.correct}/${result.total}</p>
  `;

  // 2. Hiển thị chi tiết từng câu (Review Mode)
  const reviewContainer = document.getElementById("review-container");
  
  result.questions.forEach((q, i) => {
    const userAnswer = result.userAnswers[i];
    const isCorrect = userAnswer === q.correctIndex;
    const cssClass = isCorrect ? "correct" : "incorrect"; // CSS class cho đúng/sai
    
    let html = `<div class="review-item ${cssClass}">
      <p><b>Câu ${i + 1}:</b> ${q.content}</p>`;

    q.options.forEach((opt, idx) => {
      let suffix = "";
      let labelStyle = "";
      
      // Đánh dấu đáp án người dùng chọn và đáp án đúng
      if (idx === userAnswer) suffix += " (Bạn chọn)";
      if (idx === q.correctIndex) {
        suffix += " ✅";
        labelStyle = "is-correct";
      } else if (idx === userAnswer && !isCorrect) {
        suffix += " ❌";
      }

      html += `<span class="option-label ${labelStyle}">- ${opt} ${suffix}</span>`;
    });

    html += `</div>`;
    reviewContainer.innerHTML += html;
  });
}
