// DELETE BEFORE DEPLOYING
// FOR ACCOUNT CREATION TESTING

const bcrypt = require('bcrypt');

async function hashAndCompare() {
  const password = 'alexpass789';

  const hash = await bcrypt.hash(password, 10);
  const match = await bcrypt.compare(password, hash);

  console.log('Generated hash:', hash);
  console.log('Match result:', match);
}

hashAndCompare();
