// ── Image mapping: each key maps to an Unsplash image ──
const IMAGES = {
  flight:       "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&q=80",
  geneva:       "https://images.unsplash.com/photo-1573108037329-37aa135a142e?w=1200&q=80",
  montreux:     "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1200&q=80",
  chillon:      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&q=80",
  rochers:      "https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?w=1200&q=80",
  lauterbrunnen:"https://images.unsplash.com/photo-1527095650862-b3a40ab34ee7?w=1200&q=80",
  staubbach:    "https://images.unsplash.com/photo-1508699694424-1380e1a498f4?w=1200&q=80",
  murren:       "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
  wengen:       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  jungfraujoch: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80",
  trummelbach:  "https://images.unsplash.com/photo-1432405972618-c6b0cfba870c?w=1200&q=80",
  locarno:      "https://images.unsplash.com/photo-1515861461-74fba20f27c0?w=1200&q=80",
  verzasca:     "https://images.unsplash.com/photo-1504858700536-882c978a3464?w=1200&q=80",
  florence:     "https://images.unsplash.com/photo-1543429257-3eb0b65d9c58?w=1200&q=80",
  pontevecchio: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=1200&q=80",
  boboli:       "https://images.unsplash.com/photo-1523729820425-8c2bac21a104?w=1200&q=80",
  signoria:     "https://images.unsplash.com/photo-1555990793-da11153b2473?w=1200&q=80",
  michelangelo: "https://images.unsplash.com/photo-1534359265607-b39e68b36e03?w=1200&q=80",
  tuscany:      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1200&q=80",
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
