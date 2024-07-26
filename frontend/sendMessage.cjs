const msgModule = require('coolsms-node-sdk').default;

// 인증을 위해 발급받은 본인의 API Key를 사용합니다.
const apiKey = 'NCSLNI2KDEIT7VTE'; // 여기에 본인의 API Key를 입력하세요
const apiSecret = 'XCXQNLCCC74PLOVUYVYUCUIP7MTC7C6R'; // 여기에 본인의 API Secret을 입력하세요
const messageService = new msgModule(apiKey, apiSecret);

const params = {
    text: '[쿨에스엠에스 테스트] hello world!', // 문자 내용
    to: '01023716260', // 수신번호 (받는이)
    from: '01023716260' // 발신번호 (보내는이)
};

messageService.sendMany([params])
    .then(console.log)
    .catch(console.error);
