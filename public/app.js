// ── Image mapping: Wikimedia Commons (guaranteed to load) ──
const IMAGES = {
  atlanta:      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Atlanta_skyline_with_sports_complexes.JPEG/1280px-Atlanta_skyline_with_sports_complexes.JPEG",
  london:       "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  geneva:       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Geneva-aerial-view.JPG/1280px-Geneva-aerial-view.JPG",
  montreux:     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Montreux_and_Lake_Geneva.jpg/1280px-Montreux_and_Lake_Geneva.jpg",
  chillon:      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Chillon_castle_2.jpg/1280px-Chillon_castle_2.jpg",
  lakeside:     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  rochers:      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Rochers_de_Naye_-_panoramio_%281%29.jpg/1280px-Rochers_de_Naye_-_panoramio_%281%29.jpg",
  lauterbrunnen:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Lauterbrunnen_Valley_in_June_2009.jpg/1024px-Lauterbrunnen_Valley_in_June_2009.jpg",
  staubbach:    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Staubbach_Falls_2.jpg/800px-Staubbach_Falls_2.jpg",
  birthday:     "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  murren:       "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Murren2.jpg/1280px-Murren2.jpg",
  lbvalley:     "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Lauterbrunnen_-_Switzerland.JPG/1280px-Lauterbrunnen_-_Switzerland.JPG",
  wengen:       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Wengen_from_M%C3%A4nnlichen.jpg/1280px-Wengen_from_M%C3%A4nnlichen.jpg",
  wengencafe:   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Wengen_from_M%C3%A4nnlichen.jpg/1280px-Wengen_from_M%C3%A4nnlichen.jpg",
  jungfraujoch: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Jungfraujoch_Sphinx.jpg/1280px-Jungfraujoch_Sphinx.jpg",
  trummelbach:  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Tr%C3%BCmmelbachf%C3%A4lle_1.JPG/800px-Tr%C3%BCmmelbachf%C3%A4lle_1.JPG",
  locarno:      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Locarno_Piazza_Grande.jpg/1280px-Locarno_Piazza_Grande.jpg",
  verzasca:     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Ponte_dei_Salti.jpg/1280px-Ponte_dei_Salti.jpg",
  locarnorest:  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Locarno_Piazza_Grande.jpg/1280px-Locarno_Piazza_Grande.jpg",
  florence:     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Florence%2C_seen_from_Piazzale_Michelangelo.jpg/1280px-Florence%2C_seen_from_Piazzale_Michelangelo.jpg",
  pontevecchio: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Ponte_Vecchio_at_dusk_1.jpg/1280px-Ponte_Vecchio_at_dusk_1.jpg",
  boboli:       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Boboli_gardens.jpg/1280px-Boboli_gardens.jpg",
  signoria:     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Piazza_signoria_overview.jpg/1280px-Piazza_signoria_overview.jpg",
  michelangelo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Florence%2C_seen_from_Piazzale_Michelangelo.jpg/1280px-Florence%2C_seen_from_Piazzale_Michelangelo.jpg",
  tuscany:      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Pienza_Toscana.jpg/1280px-Pienza_Toscana.jpg",
  flight:       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/British_Airways_A380_Premium_Economy_%28World_Traveller_Plus%29.jpg/1280px-British_Airways_A380_Premium_Economy_%28World_Traveller_Plus%29.jpg",
};

// Hero background
const heroEl = document.getElementById("hero");
heroEl.style.backgroundImage = `url('https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1800&q=80')`;
heroEl.style.backgroundSize = "cover";
heroEl.style.backgroundPosition = "center";

// ── Fetch itinerary from API and render ──
(async function () {
  const list = document.getElementById("itinerary-list");
  const smsForm = document.getElementById("sms-form");
  const smsStatus = document.getElementById("sms-status");

  // Load itinerary
  let itinerary = [];
  try {
    const res = await fetch("/api/itinerary");
    itinerary = await res.json();
  } catch {
    list.innerHTML = '<p style="text-align:center;color:#999;">Could not load itinerary.</p>';
    return;
  }

  // Group by date
  const grouped = {};
  const dayLabels = {};
  for (const event of itinerary) {
    if (!grouped[event.date]) grouped[event.date] = [];
    grouped[event.date].push(event);
    dayLabels[event.date] = event.dayLabel;
  }

  const startDate = new Date(itinerary[0].date + "T00:00:00");
  let dayCounter = 0;

  for (const [date, events] of Object.entries(grouped)) {
    const d = new Date(date + "T00:00:00");
    dayCounter++;
    const dateStr = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    // Day divider
    const divider = document.createElement("div");
    divider.className = "day-divider";
    divider.innerHTML = `
      <span class="day-number">Day ${dayCounter}</span>
      <span class="day-label">${dayLabels[date] || ""}</span>
      <span class="day-date">${dateStr}</span>
      <span class="day-line"></span>
    `;
    list.appendChild(divider);

    for (const ev of events) {
      const country = ev.location.includes("Italy") || ev.location.includes("Florence") || ev.location.includes("Tuscany") || ev.location.includes("Villa")
        ? "italy"
        : ev.location.includes("Switzerland") || ev.location.includes("Montreux") || ev.location.includes("Lauterbrunnen") || ev.location.includes("Locarno") || ev.location.includes("Verzasca")
          ? "switzerland"
          : "";

      const imageUrl = IMAGES[ev.image] || IMAGES.flight;

      const card = document.createElement("div");
      card.className = "event-card";
      if (country) card.dataset.country = country;

      const optionalBadge = ev.optional
        ? `<span class="badge-optional">Optional</span>`
        : "";

      card.innerHTML = `
        <img class="card-image" src="${imageUrl}" alt="${ev.title}" loading="lazy">
        <div class="card-body">
          <div class="card-header">
            <span class="card-title">
              <span class="emoji">${ev.emoji || ""}</span>
              ${ev.title}
            </span>
            <div style="display:flex;gap:6px;align-items:center;">
              ${optionalBadge}
              <span class="card-badge badge-${ev.category}">${ev.category}</span>
            </div>
          </div>
          <div class="card-meta">
            <span class="card-meta-item">🕐 ${ev.startTime} – ${ev.endTime}</span>
            <span class="card-meta-item">📍 ${ev.location}</span>
          </div>
          <p class="card-desc">${ev.description}</p>
          <div class="card-actions">
            <a class="btn-cal" href="#" onclick="downloadICS('${ev.id}'); return false;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Add to Calendar
            </a>
            <a class="btn-cal" href="#" onclick="downloadGoogleCal('${ev.id}'); return false;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              Google Calendar
            </a>
          </div>
        </div>
      `;
      list.appendChild(card);
    }
  }

  // ── ICS Download ──
  window.downloadICS = function (eventId) {
    const ev = itinerary.find((e) => e.id === eventId);
    if (!ev) return;

    const dtStart = formatICSDate(ev.date, ev.startTime);
    const dtEnd = formatICSDate(ev.date, ev.endTime);
    const now = formatICSDateNow();

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FamilyTrip//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.description.replace(/\n/g, "\\n")}`,
      `LOCATION:${ev.location}`,
      `DTSTAMP:${now}`,
      `UID:${ev.id}@familytrip2026`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ev.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Google Calendar Link ──
  window.downloadGoogleCal = function (eventId) {
    const ev = itinerary.find((e) => e.id === eventId);
    if (!ev) return;

    const dtStart = formatICSDate(ev.date, ev.startTime);
    const dtEnd = formatICSDate(ev.date, ev.endTime);

    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", ev.title);
    url.searchParams.set("dates", `${dtStart}/${dtEnd}`);
    url.searchParams.set("details", ev.description);
    url.searchParams.set("location", ev.location);

    window.open(url.toString(), "_blank");
  };

  function formatICSDate(date, time) {
    return date.replace(/-/g, "") + "T" + time.replace(/:/g, "") + "00";
  }

  function formatICSDateNow() {
    return new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+Z/, "Z");
  }

  // ── SMS Signup ──
  smsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("phone-input").value.trim();
    const timezone = document.getElementById("timezone-select").value;

    smsStatus.textContent = "Signing up...";
    smsStatus.className = "sms-status";

    try {
      const res = await fetch("/api/sms/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, timezone }),
      });
      const data = await res.json();
      if (res.ok) {
        smsStatus.textContent = "You're signed up! You'll get a text at 7 AM your time each morning of the trip.";
        smsStatus.className = "sms-status success";
        smsForm.reset();
      } else {
        smsStatus.textContent = data.error || "Something went wrong.";
        smsStatus.className = "sms-status error";
      }
    } catch {
      smsStatus.textContent = "Could not reach the server. Try again later.";
      smsStatus.className = "sms-status error";
    }
  });
})();
