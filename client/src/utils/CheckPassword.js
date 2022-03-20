import { passwordLengthError } from "./Errors";

const CheckPassword = (password) => {
  var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  if (!regex.test(password)) {
    if (password.length < 8) {
      return {
        error: true,
        message: passwordLengthError,
      };
    }
    //  else {
    //   return {
    //     error: true,
    //     message: passwordRegexError,
    //   };
    // }
  } else {
    return {
      error: false,
      message: "",
    };
  }
};

export default CheckPassword;
