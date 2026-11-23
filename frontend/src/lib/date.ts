export function getToday() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentTime() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  const today = new Date();

  const osDate = new Date(Number(year), Number(month) - 1, Number(day));

  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  const isToday =
    osDate.getTime() ===
    new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  const isTomorrow = osDate.getTime() === tomorrow.getTime();

  if (isToday) return "Hoje";
  if (isTomorrow) return "Amanhã";

  return `${day}/${month}/${year}`;
}
