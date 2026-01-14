const { centsToFixed2 } = require("../utils/validate");

// Calculeaza nota finala eliminand extremele daca sunt >= 3 note.
function computeFinalGradeFromCents(scoreCentsList) {
  const n = scoreCentsList.length;

  if (n < 3) {
    return {
      status: "insufficient_grades",
      finalGrade: null
    };
  }

  const sorted = [...scoreCentsList].sort((a, b) => a - b);
  // eliminam cel mai mic si cel mai mare
  const trimmed = sorted.slice(1, sorted.length - 1);

  const sum = trimmed.reduce((acc, v) => acc + v, 0);
  const avg = Math.round(sum / trimmed.length); // rotunjim la cent

  return {
    status: "ok",
    finalGrade: centsToFixed2(avg)
  };
}

module.exports = { computeFinalGradeFromCents };
