import { toast } from "react-hot-toast";

// Validate Login Page UserName
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

// Validate Login Page UserName
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  return errors;
}

// Validate Reset Password
export async function resetPasswordValidations(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Passwor not Matched...!");
  }

  return errors;
}

// Validate Register Form
export async function registerValidations(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

// Validate Profile Page
export async function profileValidate(values) {
  const errors = emailVerify({}, values);
  return errors;
}

// ***********************************************************

// Validate password
function passwordVerify(error = {}, values) {
  const specialCharacters =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (!values.password) {
    error.password = toast.error("Password required!");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Invalid password!");
  } else if (values.password.length < 8) {
    error.password = toast.error(
      "Password must be more than equals 8 characters!"
    );
  } else if (!specialCharacters.test(values.password)) {
    error.password = toast.error("Password must have special characters!");
  }

  return error;
}

// Validate UserName
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username Required!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid username!");
  }
  return error;
}

// Validate Email
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Invalid Email!");
  } else if (
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
      values.email
    )
  ) {
    error.email = toast.error("Invalid Email!");
  }
  return error;
}
