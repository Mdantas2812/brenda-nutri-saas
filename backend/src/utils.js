function addMinutes(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, h, m);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 5);
}

function generateSlots(startTime, endTime, durationMinutes) {
  const slots = [];
  let current = startTime;

  while (addMinutes(current, durationMinutes) <= endTime) {
    slots.push({ startTime: current, endTime: addMinutes(current, durationMinutes) });
    current = addMinutes(current, durationMinutes);
  }

  return slots;
}

function makeWhatsappLink(phone, message) {
  const clean = String(phone || "").replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

function randomAccessCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

module.exports = { addMinutes, generateSlots, makeWhatsappLink, randomAccessCode };
