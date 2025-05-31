const Fuse = require('fuse.js');

// This function performs a fuzzy search on an array of employee objects.
function searchEmployees(employees, query) {

  // adds "fullName". concatenation of the firstName and lastName
  const enrichedEmployees = employees.map(emp => ({
    ...emp,
    fullName: `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim()
  }));

  const fuse = new Fuse(enrichedEmployees, {
    keys: [
      'firstName',
      'lastName',
      'email',
      '_id',           // contactNumber
      'fullName'      
    ],
    threshold: 0.4 // ADJUST to make search stricter or looser
  });

  return fuse.search(query).map(result => result.item);
}

module.exports = searchEmployees;
