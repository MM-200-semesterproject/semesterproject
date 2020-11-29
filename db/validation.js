const regex = {
  email: /^[^\s]+@[^\s]+\.[^\s]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, //Minimum eight characters, minimum one letter and one number:
};

exports.validate = function validation(email, password) {
  const testEmail = regex.email.test(email);
  const testPassword = regex.password.test(password);
  const results = {
    email: testEmail,
    password: testPassword,
  };

  return results;
};
