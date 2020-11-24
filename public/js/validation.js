let regex = {
  email: /^[^\s]+@[^\s]+\.[^\s]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, //Minimum eight characters, minimum one letter and one number:
};
//validation(email, password);

//console.log(tst);

function validation(email, password) {
  let testEmail = regex.email.test(email);
  let testPassword = regex.password.test(password);
  console.log(testPassword);

  if (testEmail) {
    console.log('email is validated');

    let userCheck = pool.checkUsers(email);
    console.log('userCheck:' + userCheck);

    if (testPassword) {
      console.log('password is validated');
    } else {
      console.log('password is not valid');
    }

    return;
  } else {
    return false;
  }
}

/*

check if email already excists in pool
check if regex email is true Feil brukernavn, sjekk om du har skrevet brukernavnet riktig.
check if regex password is true | Feil password, må inneholde minst en bokstav og 1 tall  og minst 8 tegn

forbedringer for sikkerhet: sende confirmation email
*/
