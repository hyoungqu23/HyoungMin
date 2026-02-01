const escapeIcsText = (value: string) => {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
};

const buildIcsContent = ({
  title,
  description,
  location,
  start,
  end,
  timezone,
}: {
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  timezone: string;
}) => {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//KR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTART;TZID=${timezone}:${start}`,
    `DTEND;TZID=${timezone}:${end}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const title = params.get("title") ?? "";
  const description = params.get("description") ?? "";
  const location = params.get("location") ?? "";
  const start = params.get("start") ?? "";
  const end = params.get("end") ?? "";
  const timezone = params.get("tz") || "Asia/Seoul";

  if (!title || !start || !end) {
    return new Response("Missing required parameters.", { status: 400 });
  }

  const icsContent = buildIcsContent({
    title,
    description,
    location,
    start,
    end,
    timezone,
  });

  return new Response(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wedding_event.ics"',
      "Cache-Control": "no-store",
    },
  });
}
