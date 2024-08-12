export const validatePhone = (phone) => {
  const phonePattern = /^01[016789]\d{7,8}$/;
  return {
    isValid: phonePattern.test(phone.replace(/-/g, "")),
    message: phonePattern.test(phone.replace(/-/g, ""))
      ? ""
      : "올바른 전화번호 형식이 아닙니다.",
  };
};

export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return {
    isValid: emailPattern.test(email),
    message: emailPattern.test(email)
      ? ""
      : "올바른 이메일 주소를 입력해주세요.",
  };
};

export const validateName = (name) => {
  const namePattern = /^[가-힣]{2,6}$/;
  return {
    isValid: namePattern.test(name),
    message: namePattern.test(name)
      ? ""
      : "2자 이상 6자 이하의 한글만 가능합니다.",
  };
};

export const validateBirth = (birth) => {
  const birthPattern = /^\d{4}-\d{2}-\d{2}$/;
  return {
    isValid: birthPattern.test(birth),
    message: birthPattern.test(birth)
      ? ""
      : "올바른 생년월일 형식(YYYY-MM-DD)으로 입력해주세요.",
  };
};

export const validateId = (id) => {
  const idPattern = /^[a-zA-Z0-9]{1,12}$/;
  return {
    isValid: idPattern.test(id),
    message: idPattern.test(id)
      ? ""
      : "ID는 1~12자의 영문자와 숫자만 사용 가능합니다.",
  };
};

export const validatePassword = (password) => {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
  return {
    isValid: passwordPattern.test(password),
    message: passwordPattern.test(password)
      ? ""
      : "비밀번호는 8~16자의 영문자, 숫자, 특수문자를 포함해야 합니다.",
  };
};
