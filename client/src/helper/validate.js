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
