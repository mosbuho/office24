import axios from '../../utils/axiosConfig';

export const fetchAccumulate = async (setAccumulate) => {
    const response = await axios.get('/admin/accumulate');
    setAccumulate(response.data);
};

export const fetchAgeGroup = async (setAgeGroup) => {
    const response = await axios.get('/admin/agegroup');
    const ageOrder = ['-10대', '20대', '30대', '40대', '50대', '60대', '70대+'];
    const initialData = ageOrder.map(ageGroup => ({ ageGroup, M: '0.00', W: '0.00' }));
    const ageGroupMap = response.data.reduce((sum, item) => sum + item.COUNT, 0);
    const formattedAgeGroup = response.data.reduce((acc, item) => {
        const ageGroup = item.AGEGROUP;
        const gender = item.GENDER;
        const percentage = (item.COUNT / ageGroupMap * 100).toFixed(2);
        const existing = acc.find(data => data.ageGroup === ageGroup);
        if (existing) existing[gender] = percentage;
        return acc;
    }, initialData);
    formattedAgeGroup.sort((a, b) => ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup));
    setAgeGroup(formattedAgeGroup);
};

export const fetchSidoGroup = async (setSidoGroup) => {
    const resSidoGroup = await axios.get("/admin/sidogroup");
    const totalOffices = resSidoGroup.data.reduce((sum, item) => sum + item.OFFICE_COUNT, 0);
    const formattedSidoGroup = resSidoGroup.data.map(item => ({
        name: item.SIDO,
        value: parseFloat((item.OFFICE_COUNT / totalOffices * 100).toFixed(2)),
    }));
    setSidoGroup(formattedSidoGroup);
};

export const fetchGroupData = async (groupState, setGroupState, group) => {
    if (groupState !== null) {
        setGroupState(groupState);
        return;
    }

    const response = await axios.get(`/admin/${group}`);
    const year = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, '0');
        return `${year}-${month}`;
    });

    let labels;
    switch (group) {
        case 'membergroup':
            labels = { label1: '가입', label2: '탈퇴', label3: '이용자' };
            break;
        case 'managergroup':
            labels = { label1: '가입', label2: '탈퇴', label3: '매니저' };
            break;
        case 'officegroup':
            labels = { label1: '신규', label2: '삭제', label3: '오피스' };
            break;
        case 'bookinggroup':
            labels = { label1: '예약', label2: '취소', label3: '예약' };
            break;
        case 'salesgroup':
            labels = { label1: '결제액', label2: '환불액', label3: '총액' };
            break;
        case 'reviewgroup':
            labels = { label1: '신규', label2: '삭제', label3: '리뷰' };
            break;
    }

    const formattedGroup = months.map(month => ({
        name: `${month.slice(-2)}월`,
        [labels.label1]: 0,
        [labels.label2]: 0,
        [labels.label3]: 0
    }));

    response.data.forEach(item => {
        const monthIndex = months.indexOf(item.YEAR_MONTH);
        if (monthIndex !== -1) {
            formattedGroup[monthIndex] = {
                name: `${item.YEAR_MONTH.slice(-1)}월`,
                [labels.label1]: item.TOTAL_CREATE,
                [labels.label2]: item.TOTAL_DELETE,
                [labels.label3]: item.TREND
            };
        }
    });
    setGroupState(formattedGroup);
};


export const fetchNotAvailabilityOffice = async (officePage, setNotAvailabilityOffices, fetchedOfficePages, setfetchedOfficePages) => {
    if (fetchedOfficePages.has(officePage)) return;

    const response = await axios.get('/admin/notavailability', {
        params: { page: officePage, size: 5 }
    });
    setNotAvailabilityOffices(prev => ({
        ...prev,
        [officePage]: response.data
    }));
    setfetchedOfficePages(prev => new Set(prev).add(officePage));
};

export const fetchNotices = async (noticePage, setNotices, fetchedNoticePages, setfetchedNoticePages) => {
    if (fetchedNoticePages.has(noticePage)) return;
    
    const response = await axios.get('/admin/notice', {
        params: { page: noticePage, size: 5 }
    });
    setNotices(prev => ({
        ...prev,
        [noticePage]: response.data
    }));
    setfetchedNoticePages(prev => new Set(prev).add(noticePage));
};
