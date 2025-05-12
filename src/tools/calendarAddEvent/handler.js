#!/usr/bin/osascript -l JavaScript

function run(argv) {
  if (argv.length !== 7) {
    throw new Error(
      'Usage: osascript -l JavaScript addEvent.js ' +
      '"<Calendar>" "<Title>" "<ISO-Start>" "<ISO-End>" "<URL>" "<TravelMin>" "<Location>"'
    );
  }

  const [calName, title, isoStart, isoEnd, url, travelStr, loc] = argv;
  const startDate = new Date(isoStart);
  const endDate   = new Date(isoEnd);
  const travelMin = parseInt(travelStr, 10);

  const Calendar = Application("Calendar");
  Calendar.includeStandardAdditions = true;

  // find the calendar by name
  const cals = Calendar.calendars.whose({ name: { _equals: calName } })();
  if (cals.length === 0) {
    throw new Error(`No calendar named “${calName}”`);
  }
  const targetCal = cals[0];

  // build the new event
  const ev = Calendar.Event({
    summary:   title,
    startDate: startDate,
    endDate:   endDate,
    url:       url || "",
    location:  loc || "",
    travelTime: travelMin
  });

  // add & save
  targetCal.events.push(ev);

  return `OK – event created in “${calName}”`;
}
