import axios from './axiosConfig';

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
        const existing = acc.find(data => data.ageGroup === item.AGEGROUP);
        if (existing) existing[item.GENDER] = (item.COUNT / ageGroupMap * 100).toFixed(2);
        return acc;
    }, initialData);
    formattedAgeGroup.sort((a, b) => ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup));
    setAgeGroup(formattedAgeGroup);
};

export const fetchSidoGroup = async (setSidoGroup) => {
    const groupData = (data, threshold) => {
        let groupedData = data.reduce((acc, item) => {
            if (item.value >= threshold) {
                acc.push(item);
            } else {
                const otherIndex = acc.findIndex(i => i.name === '기타');
                if (otherIndex !== -1) {
                    acc[otherIndex].value += item.value;
                } else {
                    acc.push({ name: '기타', value: item.value });
                }
            }
            return acc;
        }, []);

        groupedData.sort((a, b) => {
            if (a.name === '기타') return 1;
            if (b.name === '기타') return -1;
            return b.value - a.value;
        });

        return groupedData;
    };

    try {
        const resSidoGroup = await axios.get("/admin/sidogroup");
        const totalOffices = resSidoGroup.data.reduce((sum, item) => sum + item.OFFICE_COUNT, 0);
        const formattedSidoGroup = resSidoGroup.data.map(item => ({
            name: item.SIDO,
            value: parseFloat((item.OFFICE_COUNT / totalOffices * 100).toFixed(2)),
        }));
        const groupedData = groupData(formattedSidoGroup, 4);
        setSidoGroup(groupedData);
    } catch (error) {
        console.error("Error fetching sido group data:", error);
        setSidoGroup([]);
    }
};

export const fetchGroupData = async (groupState, setGroupState, group) => {
    if (groupState !== null) {
        setGroupState(groupState);
        return;
    }

    const response = await axios.get(`/admin/${group}`);
    const months = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return `${month}월`;
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
        default:
            labels = { label1: 'label1', label2: 'label2', label3: 'label3' };
    }

    const formattedGroup = months.map(month => ({
        name: month,
        [labels.label1]: 0,
        [labels.label2]: 0,
        [labels.label3]: 0
    }));

    let cumulativeTrend = 0;

    response.data.forEach(item => {
        const monthName = `${parseInt(item.YEAR_MONTH.split('-')[1], 10)}월`;

        const monthIndex = months.indexOf(monthName);
        if (monthIndex !== -1) {
            cumulativeTrend += item.TOTAL_CREATE - item.TOTAL_DELETE;
            formattedGroup[monthIndex] = {
                name: monthName,
                [labels.label1]: item.TOTAL_CREATE,
                [labels.label2]: item.TOTAL_DELETE,
                [labels.label3]: cumulativeTrend
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

    const response = await axios.get('/admin/main-notice', {
        params: { page: noticePage, size: 5 }
    });

    setNotices(prev => ({
        ...prev,
        [noticePage]: response.data
    }));
    setfetchedNoticePages(prev => new Set(prev).add(noticePage));
};
