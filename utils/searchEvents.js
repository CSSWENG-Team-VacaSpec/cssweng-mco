const Fuse = require('fuse.js');

function searchEvents(events, query) {
  const enrichedEvents = events.map(event => ({
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
    threshold: 0.4 // You can tune this
  });

  return fuse.search(query).map(result => result.item);
}

module.exports = searchEvents;
