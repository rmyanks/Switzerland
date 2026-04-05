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
  for (const event of itinerary) {
    if (!grouped[event.date]) grouped[event.date] = [];
    grouped[event.date].push(event);
  }

  const startDate = new Date(itinerary[0].date + "T00:00:00");

  for (const [date, events] of Object.entries(grouped)) {
    const d = new Date(date + "T00:00:00");
    const dayNum = Math.round((d - startDate) / 86400000) + 1;
    const dateStr = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    // Day divider
    const divider = document.createElement("div");
    divider.className = "day-divider";
    divider.innerHTML = `
      <span class="day-label">Day ${dayNum} &mdash; ${dateStr}</span>
      <span class="day-line"></span>
    `;
    list.appendChild(divider);

    for (const ev of events) {
      const country = ev.location.includes("Switzerland")
        ? "switzerland"
        : "italy";

      const card = document.createElement("div");
      card.className = "event-card";
      card.dataset.country = country;

      card.innerHTML = `
        <div class="card-header">
          <span class="card-title">${ev.title}</span>
          <span class="card-badge badge-${ev.category}">${ev.category}</span>
        </div>
        <div class="card-meta">
          <span>${ev.startTime} – ${ev.endTime}</span>
          <span>${ev.location}</span>
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
      `DESCRIPTION:${ev.description}`,
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
        smsStatus.textContent = "You're signed up! You'll receive daily texts at 7:00 AM your time.";
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
