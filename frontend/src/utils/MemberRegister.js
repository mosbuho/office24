export const idCheck = () => {
    const id = document.querySelector('#id').value;
    const idInfo = document.querySelector("#idInfo");
    const idPattern = /^[a-zA-Z0-9]{6,12}$/;
    if (!idPattern.test(id)) {
        idInfo.textContent = '6자 이상 12자 이하의 영문자와 숫자만 가능합니다.';
        return false;
    } else {
        idInfo.textContent = '';
        return true;
    }
};

export const pwCheck = () => {
    const pw = document.querySelector("#pw").value;
    const pwInfo = document.querySelector("#pwInfo");
    const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!pwPattern.test(pw)) {
        pwInfo.textContent = '8자 이상 16자 이하의 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.';
        return false;
    } else {
        pwInfo.textContent = '';
        return true;
    }
};

export const pwCheckCheck = () => {
    const pw = document.querySelector("#pw").value;
    const pwCheck = document.querySelector("#pwCheck").value;
    const pwCheckInfo = document.querySelector("#pwCheckInfo");
    if (pw !== pwCheck) {
        pwCheckInfo.textContent = '비밀번호가 일치하지 않습니다.';
        return false;
    }  else {
        pwCheckInfo.textContent = '';
        return true;
    }
}

export const nameCheck = () => {
    const name = document.querySelector("#name").value;
    const nameInfo = document.querySelector("#nameInfo");
    const namePattern = /^[가-힣]{2,12}$/;
    if (!namePattern.test(name)) {
        nameInfo.textContent = '2자 이상 12자 이하의 한글만 가능합니다.';
        return false;
    } else {
        nameInfo.textContent = '';
        return true;
    }
}

export const emailCheck = () => {
    const email = document.querySelector("#email").value;
    const emailInfo = document.querySelector("#emailInfo");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email))  {
        emailInfo.textContent = '올바른 이메일 주소를 입력해주세요.';
        return false;
    } else {
        emailInfo.textContent = '';
        return true;
    }
}

export const phoneCheck = () => {
    const phone = document.querySelector("#phone").value;
    const phoneInfo = document.querySelector("#phoneInfo");
    const phonePattern = /^\d{11}$/;

    if (!phonePattern.test(phone)) {
        phoneInfo.textContent = "'-'를 제외한 11자리 숫자만 가능합니다.";
        return false;
    } else {
        phoneInfo.textContent = '';
        return true;
    }
}

export const allCheck = () => {
    const id = idCheck();
    const pw = pwCheck();
    const pwCheck1 = pwCheckCheck();
    const name = nameCheck();
    const phone = phoneCheck();
    const email = document.querySelector("#email").value ? emailCheck() : true;
    return id && pw && pwCheck1 && name && phone;
}

