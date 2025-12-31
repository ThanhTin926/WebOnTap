function saveHistory(result) {
  const history = JSON.parse(localStorage.getItem("quiz_history") || "[]");
  history.push(result);
  localStorage.setItem("quiz_history", JSON.stringify(history));
}
