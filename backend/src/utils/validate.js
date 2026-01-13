function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPassword(password) {
  if (typeof password !== "string") return false;
  return password.trim().length >= 8;
}

/*
  Scor:
  - 1.00 .. 10.00 inclusiv
  - max 2 zecimale
  Returnam int ca sa evitam erori de floating.
*/
function parseScoreToCents(input) {
  const s = String(input).trim();

  if (!/^\d{1,2}(\.\d{1,2})?$/.test(s)) {
    return { ok: false, error: "Format scor invalid. Foloseste max 2 zecimale." };
  }

  const num = Number(s);
  if (Number.isNaN(num)) {
    return { ok: false, error: "Scor invalid." };
  }

  if (num < 1 || num > 10) {
    return { ok: false, error: "Scorul trebuie sa fie intre 1.00 si 10.00." };
  }

  const cents = Math.round(num * 100);
  return { ok: true, cents };
}

function centsToFixed2(cents) {
  return (cents / 100).toFixed(2);
}

module.exports = { isValidEmail, isValidPassword, parseScoreToCents, centsToFixed2 };
