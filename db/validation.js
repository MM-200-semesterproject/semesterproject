const regex = {
  email: /^[^\s]+@[^\s]+\.[^\s]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, //Minimum eight characters, minimum one letter and one number:
};
//validation(email, password);

//console.log(tst);

exports.validate = function validation(email, password) {
  const testEmail = regex.email.test(email);
  const testPassword = regex.password.test(password);
  const results = {
    email: testEmail,
    password: testPassword,
  };

  return results;
};
/*

check if email already excists in pool
check if regex email is true Feil brukernavn, sjekk om du har skrevet brukernavnet riktig.
check if regex password is true | Feil password, må inneholde minst en stor bokstav og 1 tall  og minst 8 tegn

forbedringer for sikkerhet: sende confirmation email
*/
