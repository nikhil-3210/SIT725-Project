const argon2 = require('argon2');

const plainPassword = '123'; // Replace with the password you want to test
const hashedPassword = '$argon2id$v=19$m=4096,t=3,p=1$...'; // Replace with the stored hash

argon2.verify(hashedPassword, plainPassword)
  .then(result => console.log('Password comparison result:', result)) // true if matched
  .catch(err => console.error('Error comparing password:', err));