export function addDays(date: string, days: number) {
  const currentDate = new Date(date);
  const newDate = new Date(date);
  newDate.setDate(currentDate.getDate() + days);
  return newDate;
}

export function getDateStr(date: Date) {
  return date.toISOString().split("T")[0];
}

export function getFullDateStr(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatNumber(number: number) {
  const parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function genRandomID(n: number = 8) {
  let randomID = "";
  const seed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < n; i++) {
    randomID += seed.charAt(Math.floor(Math.random() * seed.length));
  }

  return randomID;
}

export function fst<T>(ts: T[]): T {
  return ts[0];
}

export function isAfter(d: Date, td: Date) {
  return d > td;
}

export function getDaysBetween(d: Date, dt: Date): number {
  const diffInMs: number = Math.abs(dt.getTime() - d.getTime());
  const diffInDays: number = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}
