import { emailRegexError } from "./Errors";

const CheckEmail = (email) => {
  var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regexEmail.test(email)) {
    return {
      error: true,
      message: emailRegexError,
    };
  } else {
    return {
      error: false,
      message: "",
    };
  }
};

export default CheckEmail;
