import { useEffect, useState } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import "../../styles/components/member/Calendar.css";

// render: 각 월의 일수 //
const dayCountList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const Calendar = ({ settingStartDate, settingEndDate, startDate, endDate }) => {
  // render: 현재 표시 중인 날짜 상태 //
  const [showDate, setShowDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  // render: 현재 월과 다음 월의 날짜 목록 //
  const [dayList, setDayList] = useState([]);
  const [nextDayList, setNextDayList] = useState([]);

  // function: 오늘 이전 날짜인지 확인 //
  const isBeforeToday = (date) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // 현재 년도와 월이 아닌 경우 false 반환
    if (date.year !== currentYear || date.month !== currentMonth) {
      return false;
    }

    today.setHours(0, 0, 0, 0);
    return new Date(date.year, date.month, date.date) < today;
  };

  // function: 월별 날짜 목록 생성 //
  const makeDayList = (year, month) => {
    const targetDate = new Date(year, month, 1);
    const result = [];

    for (let i = 0; i < targetDate.getDay(); i++) {
      result.push({ year: -i, month: -i, date: -i });
    }

    for (let i = 0; i < dayCountList[month]; i++) {
      result.push({ year, month, date: i + 1 });
    }

    if (
      month === 1 &&
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    ) {
      result.push({ year, month, date: 29 });
    }
    return result;
  };

  // function: 표시 월 변경 //
  const changeShowDate = (direction) => {
    if (direction) {
      if (showDate.month === 0) {
        setShowDate({ year: showDate.year - 1, month: 11 });
      } else {
        setShowDate({ year: showDate.year, month: showDate.month - 1 });
      }
    } else {
      if (showDate.month === 11) {
        setShowDate({ year: showDate.year + 1, month: 0 });
      } else {
        setShowDate({ year: showDate.year, month: showDate.month + 1 });
      }
    }
  };

  // function: 날짜 선택 처리 //
  const selectDateHandler = (date) => {
    if (date.year <= 0 || isBeforeToday(date)) return;
    const selectedDate = new Date(date.year, date.month, date.date);

    if (
      startDate &&
      endDate &&
      selectedDate.getTime() >= startDate.getTime() &&
      selectedDate.getTime() <= endDate.getTime()
    ) {
      settingStartDate(null);
      settingEndDate(null);
    } else if (
      !startDate ||
      (startDate && endDate) ||
      (startDate && selectedDate.getTime() < startDate.getTime())
    ) {
      settingStartDate(selectedDate);
      settingEndDate(null);
    } else if (!endDate || selectedDate.getTime() > startDate.getTime()) {
      settingEndDate(selectedDate);
    }
  };

  // function: 날짜 클래스 이름 생성 //
  const makeDateClassName = (thisDate) => {
    if (thisDate.year <= 0) return "disabled not_selected";
    if (isBeforeToday(thisDate)) return "disabled";

    const tDate = new Date(thisDate.year, thisDate.month, thisDate.date);

    if (startDate && tDate.getTime() === startDate.getTime()) {
      return "selected start";
    }

    if (endDate && tDate.getTime() === endDate.getTime()) {
      return "selected end";
    }

    if (startDate && endDate && tDate > startDate && tDate < endDate) {
      return "included";
    }

    return "not_selected";
  };
  // function: 달력 행 생성 //
  const makeCalendar = (partList) => (
    <tr className="date_row">
      {partList.map((date) => (
        <td
          className={makeDateClassName(date)}
          key={`${date.year}-${date.month}-${date.date}`}
          onClick={() => selectDateHandler(date)}
        >
          <div className="date_box">{date.year <= 0 ? " " : date.date}</div>
        </td>
      ))}
    </tr>
  );

  // function: 날짜 목록 업데이트 //
  useEffect(() => {
    setDayList(makeDayList(showDate.year, showDate.month));
    setNextDayList(
      makeDayList(showDate.year, showDate.month === 11 ? 0 : showDate.month + 1)
    );
  }, [showDate]);

  // render: 달력 컴포넌트 //
  return (
    <div className="calendar">
      <div className="container">
        <h2>{`${showDate.year}년 ${showDate.month + 1}월`}</h2>
        <table className="table">
          <tbody>
            <tr className="weekdays">
              <td className="sunday">일</td>
              <td>월</td>
              <td>화</td>
              <td>수</td>
              <td>목</td>
              <td>금</td>
              <td>토</td>
            </tr>
            {makeCalendar(dayList.slice(0, 7))}
            {makeCalendar(dayList.slice(7, 14))}
            {makeCalendar(dayList.slice(14, 21))}
            {makeCalendar(dayList.slice(21, 28))}
            {makeCalendar(dayList.slice(28, 35))}
            {makeCalendar(dayList.slice(35, 42))}
          </tbody>
        </table>
        {(showDate.year !== new Date().getFullYear() ||
          showDate.month !== new Date().getMonth()) && (
          <div className="left">
            <SlArrowLeft onClick={() => changeShowDate(true)} />
          </div>
        )}
        <div className="right">
          <SlArrowRight onClick={() => changeShowDate(false)} />
        </div>
      </div>
      <div className="container next">
        <h2>
          {showDate.month === 11
            ? `${showDate.year + 1}년 1월`
            : `${showDate.year}년 ${showDate.month + 2}월`}
        </h2>
        <table className="table">
          <tbody>
            <tr className="weekdays">
              <td className="sunday">일</td>
              <td>월</td>
              <td>화</td>
              <td>수</td>
              <td>목</td>
              <td>금</td>
              <td>토</td>
            </tr>
            {makeCalendar(nextDayList.slice(0, 7))}
            {makeCalendar(nextDayList.slice(7, 14))}
            {makeCalendar(nextDayList.slice(14, 21))}
            {makeCalendar(nextDayList.slice(21, 28))}
            {makeCalendar(nextDayList.slice(28, 35))}
            {makeCalendar(nextDayList.slice(35, 42))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
