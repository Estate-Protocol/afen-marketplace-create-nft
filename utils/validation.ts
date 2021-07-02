export const nameValidation = /^[a-z ,.'-]+$/i;

export const emailValidationRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const passwordValidation =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const validateName = (name: string) =>
  !nameValidation.test(name) || !name.length;

export const validateEmail = (email: string) =>
  !emailValidationRegex.test(email) || !email.length;

export const validatePassword = (password: string) =>
  !passwordValidation.test(password) || !password.length;
