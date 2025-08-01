const Fuse = require('fuse.js');

// This function performs a fuzzy search on an array of supplier objects.
function searchSuppliers(suppliers, query) {
  const fuse = new Fuse(suppliers, {
    keys: [
      'companyName',
      'contactNames',
      'contactNumbers',
      '_id',
      'notes'
    ],
    threshold: 0.4 
  });

  return fuse.search(query).map(result => result.item);
}

module.exports = searchSuppliers;
