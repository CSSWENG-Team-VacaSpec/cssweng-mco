const Fuse = require('fuse.js');

function searchNotifications(notifications, query) {
  const fuse = new Fuse(notifications, {
    keys: ['data.message'],
    threshold: 0.4,
    includeScore: true,
    useExtendedSearch: true
  });

  // Automatically allow partial match on `query`
  return fuse.search(`'${query}`).map(result => result.item);
}

module.exports = searchNotifications;
