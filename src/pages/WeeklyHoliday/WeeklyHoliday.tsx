import { useState } from "react";
import AppBar from "../../components/AppBar";
import {
  calculateSalaryWeekHoliday,
  CalculateSalaryWeekHolidayRequest,
} from "../../api/pay";

function WeeklyHoliday() {
  const [hourSalary, setHourSalary] = useState<number>(0); // 시급
  const [weekWorkTime, setWeekWorkTime] = useState<number>(0); // 일주 근무시간

  const [selectedHour, setSelectedHour] = useState<number>(0); // 선택된 시간
  const [selectedMinute, setSelectedMinute] = useState<number>(0); // 선택된 분

  const [weekHolidaySalary, setWeekHolidaySalary] = useState<number>(0); // 주휴수당

  // 시급 변경 이벤트
  const handleHourSalaryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHourSalary(Number(event.target.value));
  };

  // 시간 변경 이벤트
  const handleHourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const hour = Number(event.target.value);
    setSelectedHour(hour);

    // 시간이 40시간이면 분을 '00분'으로 고정
    if (hour === 40) {
      setSelectedMinute(0);
      calculateWeekWorkTime(hour, 0);
    } else {
      setSelectedMinute(0); // 분 초기화
      calculateWeekWorkTime(hour, 0);
    }
  };

  // 분 변경 이벤트
  const handleMinuteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const minute = Number(event.target.value);

    // 시간이 40시간이면 분 변경 불가
    if (selectedHour === 40) {
      setSelectedMinute(0);
      return;
    }

    setSelectedMinute(minute);
    const minuteToHour = convertMinuteToHour(minute);
    calculateWeekWorkTime(selectedHour, minuteToHour);
  };

  // 분을 시간 단위로 변환
  const convertMinuteToHour = (minute: number): number => {
    switch (minute) {
      case 10:
        return 0.17;
      case 20:
        return 0.33;
      case 30:
        return 0.5;
      case 40:
        return 0.67;
      case 50:
        return 0.83;
      default:
        return 0;
    }
  };

  // 일주일 근무 시간 계산
  const calculateWeekWorkTime = (hour: number, minuteToHour: number) => {
    const totalTime = hour + minuteToHour; // 시간과 분(시간 단위)을 합산
    setWeekWorkTime(Number(totalTime.toFixed(2))); // 소수점 둘째 자리 반올림
  };

  // 초기화 버튼 클릭 이벤트
  const handleResetButtonClick = () => {
    setHourSalary(0);
    setWeekWorkTime(0);
    setSelectedHour(0);
    setSelectedMinute(0);
    setWeekHolidaySalary(0);
  };

  // 계산하기 버튼 클릭 이벤트
  const handleCalculateButtonClick = () => {
    // 주휴수당 게산 API Request
    const CalculateSalaryWeekHolidayRequest: CalculateSalaryWeekHolidayRequest =
      {
        hourSalary,
        weekWorkTime,
      };

    // 주휴수당 계산 API 호출
    calculateSalaryWeekHoliday(CalculateSalaryWeekHolidayRequest).then(
      (response) => {
        if (response) {
          setWeekHolidaySalary(response.weekHolidayPay);
        }
      },
    );
  };

  return (
    <div className="flex w-full flex-col">
      <AppBar title={"주휴수당계산기"} />

      <div className="flex w-full flex-col gap-8 bg-white px-5 pb-[50px] pt-[22px]">
        {/* 주휴수당이란? */}
        <div className="flex w-full items-center gap-3">
          <img
            src="/assets/images/coin.png"
            alt="Coin"
            className="w-20 min-w-20"
          />
          <div className="flex flex-col gap-2.5">
            <span className="text-xl font-bold">
              <span className="text-[#0099FF]">주휴수당</span>
              이란?
            </span>
            <span className="text-base">
              <span className="font-bold">1주일 15시간 이상 근무</span>하면
              발생하는 수당입니다
            </span>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="flex w-full flex-col gap-6">
          {/* 시급 */}
          <div className="flex w-full flex-col gap-2">
            <span className="text-base text-[#666666]">시급</span>
            <div className="flex h-9 min-h-9 w-full rounded-[3px] border border-solid border-normal px-[10px]">
              <input
                type="number"
                className="h-full w-full bg-white text-base"
                value={hourSalary || ""}
                onChange={handleHourSalaryChange}
                inputMode="numeric"
              />
            </div>
          </div>

          {/* 일주 근무시간 */}
          <div className="flex w-full flex-col gap-2">
            <span className="text-base text-[#666666]">일주 근무시간</span>
            <div className="flex w-full items-center justify-between gap-2.5">
              <div className="relative flex h-9 min-h-9 flex-1 overflow-hidden rounded-md border border-solid border-normal">
                <select
                  className="h-full w-full appearance-none bg-white px-[10px] py-[6px] text-base hover:outline-none focus:outline-none"
                  value={selectedHour}
                  onChange={handleHourChange}
                >
                  <option value="hour">시간</option>
                  {Array.from({ length: 26 }, (_, index) => index + 15).map(
                    (hour) => (
                      <option key={hour} value={hour}>
                        {hour}시간
                      </option>
                    ),
                  )}
                </select>
                <img
                  src="/assets/images/icons/svg/down_arrow_bold_short.svg"
                  alt="Arrow Down"
                  className="absolute right-[10px] top-1/2 h-[5px] w-[10px] -translate-y-1/2 transform"
                />
              </div>
              <div className="relative flex h-9 min-h-9 flex-1 overflow-hidden rounded-md border border-solid border-normal">
                <select
                  className="h-full w-full appearance-none bg-white px-[10px] py-[6px] text-base hover:outline-none focus:outline-none"
                  value={selectedMinute}
                  onChange={handleMinuteChange}
                  disabled={selectedHour === 40}
                >
                  <option value="minute">분</option>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <option key={index} value={10 * index}>
                      {10 * index}분
                    </option>
                  ))}
                </select>
                <img
                  src="/assets/images/icons/svg/down_arrow_bold_short.svg"
                  alt="Arrow Down"
                  className="absolute right-[10px] top-1/2 h-[5px] w-[10px] -translate-y-1/2 transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 초기화 / 계산하기 */}
      <div className="flex w-full items-center gap-5 px-5 py-[6px]">
        <button
          type="button"
          className="h-9 min-h-9 flex-1 rounded-[3px] border border-solid border-normal bg-white text-base"
          onClick={handleResetButtonClick}
        >
          초기화
        </button>
        <button
          type="button"
          className="h-9 min-h-9 flex-1 rounded-[3px] border border-solid border-normal bg-[#DC143C] text-base text-white"
          onClick={handleCalculateButtonClick}
        >
          계산하기
        </button>
      </div>

      {/* 계산 결과 */}
      {weekHolidaySalary > 0 && (
        <div className="flex w-full flex-col gap-5 bg-white px-5 pb-[70px] pt-10">
          <div className="flex w-full items-center justify-between">
            <span className="text-bse text-[#666666]">예상 주휴수당</span>
            <span className="text-base font-semibold">
              월{" "}
              <span className="text-[#0099FF]">
                {weekHolidaySalary.toLocaleString()}
              </span>
              원
            </span>
          </div>

          <hr className="border-t border-solid border-[#D9D9D9]" />

          <span className="text-xs text-[#666666]">
            - 아르바이트 근로계약 조건, 근로 여건에 따라 주휴수당은 달라질 수
            있습니다.
          </span>
        </div>
      )}

      {/* 초기화 */}
      {weekHolidaySalary > 0 && (
        <div className="flex w-full items-center justify-center px-10 py-[6px]">
          <button
            type="button"
            className="h-9 min-h-9 w-[150px] rounded-[3px] border border-solid border-normal bg-white text-base"
            onClick={handleResetButtonClick}
          >
            초기화
          </button>
        </div>
      )}
    </div>
  );
}

export default WeeklyHoliday;
