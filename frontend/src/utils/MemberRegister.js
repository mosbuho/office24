export const idCheck = () => {
    const id = document.querySelector('#id').value;
    const idInfo = document.querySelector("#idInfo");
    const idPattern = /^[a-zA-Z0-9]{6,12}$/;
    if (!idPattern.test(id)) {
        idInfo.textContent = '아이디는 6자 이상 12자 이하의 영문자와 숫자로만 구성되어야 합니다.';
        return false;
    } else {
        idInfo.textContent = '';
        return true;
    }
};

export const pwCheck = () => {
    const pw = document.querySelector("#pw").value;
    const pwInfo = document.querySelector("#pwInfo");
    const pwPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!pwPattern.test(pw)) {
        pwInfo.textContent = '비밀번호는 8자에서 16자 사이여야 하며, 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.';
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
        pwCheckInfo.textContent = '입력하신 비밀번호가 다릅니다.';
        return false;
    }  else {
        pwCheckInfo.textContent = '';
        return true;
    }
}

export const nameCheck = () => {
    const name = document.querySelector("#name").value;
    const nameInfo = document.querySelector("#nameInfo");
    const namePattern = /^[^A-Za-z]{2,12}$/;
    if (!namePattern.test(name)) {
        nameInfo.textContent = '이름은 2자에서 12자 사이여야 하며, 이름에는 영어 문자가 포함될 수 없습니다.';
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
    const phonePattern = /^010\d{4}\d{4}$/;

    if (!phonePattern.test(phone)) {
        phoneInfo.textContent = '전화번호는 010으로 시작하며 숫자 11자여야 합니다.';
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

