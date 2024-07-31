export const newPwCheck = () => {
    const newPw = document.querySelector("#newPw").value;
    const newPwInfo = document.querySelector("#newPwInfo");
    const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!pwPattern.test(newPw)) {
        newPwInfo.textContent = '8자 이상 16자 이하의 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.';
        return false;
    } else {
        newPwInfo.textContent = '';
        return true;
    }
};

export const newPwCheckCheck = () => {
    const newPw = document.querySelector("#newPw").value;
    const newPwCheck = document.querySelector("#newPwCheck").value;
    const newPwCheckInfo = document.querySelector("#newPwCheckInfo");
    if (newPw !== newPwCheck) {
        newPwCheckInfo.textContent = '비밀번호가 일치하지 않습니다.';
        return false;
    }  else {
        newPwCheckInfo.textContent = '';
        return true;
    }
}