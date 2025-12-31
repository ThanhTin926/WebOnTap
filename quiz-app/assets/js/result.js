const result = JSON.parse(localStorage.getItem("last_result"));
document.getElementById("result").innerHTML = `
  <p>✔ Số câu đúng: ${result.correct}/${result.total}</p>
  <p>🎯 Điểm: ${result.score}%</p>
`;
