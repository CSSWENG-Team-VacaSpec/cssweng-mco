const Fuse = require('fuse.js');

function searchEvents(events, query, scope) {
  // Filter events based on scope (past or upcoming)
  let scopedEvents = events;

  if (scope === 'past') {
    scopedEvents = events.filter(event =>
      ['completed', 'cancelled'].includes(event.status?.toLowerCase())
    );
  } else if (scope === 'upcoming') {
    scopedEvents = events.filter(event =>
      ['in progress', 'planning', 'postponed'].includes(event.status?.toLowerCase())
    );
  }

  const enrichedEvents = scopedEvents.map(event => ({
    ...event,
    contactFullName: `${event.CPFirstName ?? ''} ${event.CPLastName ?? ''}`.trim(),
    clientFullName: `${event.clientFirstName ?? ''} ${event.clientLastName ?? ''}`.trim()
  }));

  const fuse = new Fuse(enrichedEvents, {
    keys: [
      '_id',                
      'eventName',
      'description',
      'location',
      'status',
      'CPContactNo',
      'CPLastName',
      'CPFirstName',
      'clientLastName',
      'clientFirstName',
      'companyName',
      'contactFullName',
      'clientFullName'
    ],
    threshold: 0.4
  });

  return fuse.search(query).map(result => result.item);
}

module.exports = searchEvents;
