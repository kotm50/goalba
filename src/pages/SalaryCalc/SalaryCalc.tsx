import { useEffect, useRef, useState } from "react";
import AppBar from "../../components/AppBar";
import {
  calculateSalary,
  CalculateSalaryRequest,
  CalculateSalaryResponse,
} from "../../api/pay";

function SalaryCalc() {
  const [type1, setType1] = useState<
    "시급" | "일급" | "주급" | "월급" | "연봉"
  >("시급"); // from
  const [type2, setType2] = useState<
    "시급" | "일급" | "주급" | "월급" | "연봉"
  >("월급"); // to
  const [tax, setTax] = useState<null | "9.4%" | "3.3%">(null); // 세금 적용 여부
  const [weekHolidayPayChk, setWeekHolidayPayChk] = useState<null | "포함">(
    "포함",
  ); // 주휴수당 포함 여부
  const [probationPeriod, setProbationPeriod] = useState<null | "적용">(null); // 수습기간 적용 여부
  const [overtime, setOvertime] = useState<number>(0); // 연장 근무 시간
  const [hourSalary, setHourSalary] = useState<number>(0); // 시급
  const [dailySalary, setDailySalary] = useState<number>(0); // 일급
  const [weekSalary, setWeekSalary] = useState<number>(0); // 주급
  const [monthSalary, setMonthSalary] = useState<number>(0); // 월급
  const [yearSalary, setYearSalary] = useState<number>(0); // 연봉
  const [workTime, setWorkTime] = useState<number>(0); // 일일 근무시간
  const [weekWorkDay, setWeekWorkDay] = useState<number>(0); // 일주 근무일수

  const [calcResult, setCalcResult] = useState<CalculateSalaryResponse>(); // 계산 결과

  // const [confirmTitle, setConfirmTitle] = useState<string>(""); // 확인 팝업 제목
  // const [confirmMessage, setConfirmMessage] = useState<string>(""); // 확인 팝업 메시지
  // const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false); // 확인 팝업 오픈 여부

  const resultRef = useRef<HTMLDivElement>(null); // 결과 스크롤

  // type1 선택 이벤트
  const handleType1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "시급" | "일급" | "주급" | "월급" | "연봉";

    setType1(value);
  };

  // type2 선택 이벤트
  const handleType2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "시급" | "일급" | "주급" | "월급" | "연봉";

    // type1과 type2가 같지 않을 때만 type2 변경
    if (value !== type1) {
      setType2(value);
    }
  };

  // 시급/일급/주급/월급/연봉 입력 이벤트
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    switch (type1) {
      case "시급":
        setHourSalary(Number(value));
        break;
      case "일급":
        setDailySalary(Number(value));
        break;
      case "주급":
        setWeekSalary(Number(value));
        break;
      case "월급":
        setMonthSalary(Number(value));
        break;
      case "연봉":
        setYearSalary(Number(value));
        break;
    }
  };

  // 일일 근무시간 입력 이벤트
  const handleWorkTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setWorkTime(Number(value));
  };

  // 일주 근무일수 입력 이벤트
  const handleWeekWorkDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setWeekWorkDay(Number(value));
  };

  // 월 연장 근무시간 입력 이벤트
  const handleOvertimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setOvertime(Number(value));
  };

  // 세금 적용 여부 선택 이벤트
  const handleTaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "null" | "9.4%" | "3.3%";

    // 미적용 선택 시 null로 변경
    if (value === "null") {
      setTax(null);
      return;
    }

    setTax(value);
  };

  // 주휴수당 적용 여부 선택 이벤트
  const handleWeekHolidayPayChkChange = (value: null | "포함") => {
    setWeekHolidayPayChk(value);
  };

  // 수습기간 적용 여부 선택 이벤트
  const handleProbationPeriodChange = (value: null | "적용") => {
    setProbationPeriod(value);
  };

  // 계산하기 버튼 클릭 이벤트
  const handleCalulateButtonClick = () => {
    // 급여 계산기 API Request
    const calculateSalaryRequest: CalculateSalaryRequest = {
      type1,
      type2,
      tax,
      weekHolidayPayChk,
      probationPeriod,
      overtime,
      hourSalary,
      dailySalary,
      weekSalary,
      monthSalary,
      yearSalary,
      workTime,
      weekWorkDay,
    };

    // 급여 계산기 API 호출
    calculateSalary(calculateSalaryRequest)
      .then((response) => {
        if (response && response.code === "C000") {
          setCalcResult(response);

          // 결과로 스크롤 이동
          setTimeout(() => {
            if (resultRef.current) {
              resultRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 초기화 버튼 클릭 이벤트
  const handleResetButtonClick = () => {
    setType1("시급");
    setType2("월급");
    setTax(null);
    setWeekHolidayPayChk("포함");
    setProbationPeriod(null);
    setOvertime(0);
    setHourSalary(0);
    setDailySalary(0);
    setWeekSalary(0);
    setMonthSalary(0);
    setYearSalary(0);
    setWorkTime(0);
    setWeekWorkDay(0);
    setCalcResult(undefined);
  };

  // type1, type2 변경 시 초기화
  useEffect(() => {
    setWeekHolidayPayChk("포함");
    setProbationPeriod(null);
    setOvertime(0);
    setHourSalary(0);
    setDailySalary(0);
    setWeekSalary(0);
    setMonthSalary(0);
    setYearSalary(0);
    setWorkTime(0);
    setWeekWorkDay(0);
    setCalcResult(undefined);
  }, [type1, type2]);

  // type1 변경 시 type2 변경
  useEffect(() => {
    if (type1 === "시급") {
      setType2("일급");
    } else {
      setType2("시급");
    }
  }, [type1]);

  return (
    <div className="flex w-full flex-col">
      <AppBar title={"급여계산기"} />

      {/* 올해 최저시급 */}
      <div className="flex items-center gap-3 bg-white px-5 pb-5 pt-3">
        <img
          src="/assets/images/calculator.png"
          alt="Calculator"
          className="h-[120px]"
        />
        <div className="flex flex-col gap-2.5">
          <h1 className="text-base font-bold">2025년 최저시급은</h1>
          <h2 className="text-base font-bold">
            <span className="text-[32px] text-[#0099FF]">10,030원</span>
            <span className="ml-[10px]">입니다</span>
          </h2>
        </div>
      </div>

      {/* 변환 선택 드롭다운 */}
      <div className="flex w-full items-center justify-between px-[10px] py-3">
        <div className="relative flex h-9 min-h-9 w-[140px] min-w-[140px] overflow-hidden rounded-md border border-solid border-normal">
          <select
            className="h-full w-full appearance-none bg-white px-[10px] py-[6px] text-base font-bold hover:outline-none focus:outline-none"
            value={type1}
            onChange={(e) => handleType1Change(e)}
          >
            <option value="시급">시급</option>
            <option value="일급">일급</option>
            <option value="주급">주급</option>
            <option value="월급">월급</option>
            <option value="연봉">연봉</option>
          </select>
          <img
            src="/assets/images/icons/svg/down_arrow_bold_short.svg"
            alt="Arrow Down"
            className="absolute right-[10px] top-1/2 h-[5px] w-[10px] -translate-y-1/2 transform"
          />
        </div>
        <img
          src="/assets/images/icons/svg/right_arrow_bold_square.svg"
          alt="transform"
          className="h-3"
        />
        <div className="relative flex h-9 min-h-9 w-[140px] min-w-[140px] overflow-hidden rounded-md border border-solid border-normal">
          <select
            className="h-full w-full appearance-none bg-white px-[10px] py-[6px] text-base font-bold hover:outline-none focus:outline-none"
            value={type2}
            onChange={(e) => handleType2Change(e)}
          >
            <option value="시급" disabled={type1 === "시급"}>
              시급
            </option>
            <option value="일급" disabled={type1 === "일급"}>
              일급
            </option>
            <option value="주급" disabled={type1 === "주급"}>
              주급
            </option>
            <option value="월급" disabled={type1 === "월급"}>
              월급
            </option>
            <option value="연봉" disabled={type1 === "연봉"}>
              연봉
            </option>
          </select>
          <img
            src="/assets/images/icons/svg/down_arrow_bold_short.svg"
            alt="Arrow Down"
            className="absolute right-[10px] top-1/2 h-[5px] w-[10px] -translate-y-1/2 transform"
          />
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="flex w-full flex-col gap-6 bg-white px-5 py-[26px]">
        {/* type1 입력 */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-base text-[#666666]">{type1}</span>
          <div className="flex h-9 min-h-9 w-full rounded-[3px] border border-solid border-normal px-[10px]">
            <input
              type="number"
              className="h-full w-full bg-white text-base"
              value={
                type1 === "시급"
                  ? hourSalary || ""
                  : type1 === "일급"
                    ? dailySalary || ""
                    : type1 === "주급"
                      ? weekSalary || ""
                      : type1 === "월급"
                        ? monthSalary || ""
                        : yearSalary || ""
              }
              onChange={(e) => handleSalaryChange(e)}
            />
          </div>
        </div>

        {/* 일일 근무시간 */}
        {[
          ["시급", "일급"],
          ["시급", "주급"],
          ["시급", "월급"],
          ["시급", "연봉"],
          ["일급", "시급"],
          ["일급", "주급"],
          ["일급", "월급"],
          ["일급", "연봉"],
          ["주급", "시급"],
          ["월급", "시급"],
          ["연봉", "시급"],
        ].some(([from, to]) => type1 === from && type2 === to) && (
          <div className="flex w-full flex-col gap-2">
            <span className="text-base text-[#666666]">일일 근무시간</span>
            <div className="relative flex h-9 min-h-9 w-full overflow-hidden rounded-md border border-solid border-normal">
              <select
                className="h-full w-full appearance-none bg-white px-[10px] py-[6px] text-sm text-[#333333] hover:outline-none focus:outline-none"
                value={workTime || ""}
                onChange={(e) => handleWorkTimeChange(e)}
              >
                <option value="">선택</option>
                {Array.from({ length: 48 }, (_, i) => (
                  <option key={i} value={(i + 1) * 0.5}>
                    {(i + 1) * 0.5}시간
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
        )}

        {/* 일주 근무일수 */}
        {[
          ["시급", "주급"],
          ["시급", "월급"],
          ["시급", "연봉"],
          ["일급", "주급"],
          ["일급", "월급"],
          ["일급", "연봉"],
          ["주급", "시급"],
          ["주급", "일급"],
          ["월급", "시급"],
          ["월급", "일급"],
          ["연봉", "시급"],
          ["연봉", "일급"],
        ].some(([from, to]) => type1 === from && type2 === to) && (
          <div className="flex w-full flex-col gap-2">
            <span className="text-base text-[#666666]">일주 근무일수</span>
            <div className="relative flex h-9 min-h-9 w-full overflow-hidden rounded-md border border-solid border-normal">
              <select
                className="h-full w-full appearance-none bg-white px-[10px] py-[6px] text-sm text-[#333333] hover:outline-none focus:outline-none"
                value={weekWorkDay || ""}
                onChange={(e) => handleWeekWorkDayChange(e)}
              >
                <option value="">선택</option>
                {Array.from({ length: 7 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}일
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
        )}

        {/* 연장 근무 시간 */}
        {type1 === "시급" && (type2 === "주급" || type2 === "월급") && (
          <div className="flex w-full flex-col gap-2">
            <span className="text-base text-[#666666]">
              {type2 === "주급" && "주"}
              {type2 === "월급" && "월"} 연장 근무시간
            </span>
            <div className="relative flex h-9 min-h-9 w-full overflow-hidden rounded-md border border-solid border-normal">
              <select
                className="h-full w-full appearance-none bg-white px-[10px] py-[6px] text-sm text-[#333333] hover:outline-none focus:outline-none"
                value={overtime || ""}
                onChange={(e) => handleOvertimeChange(e)}
              >
                <option value="">선택</option>
                {Array.from({ length: 48 }, (_, i) => (
                  <option key={i} value={(i + 1) * 0.5}>
                    {(i + 1) * 0.5}시간
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
        )}

        {/* 주휴수당 */}
        {[
          ["시급", "일급"],
          ["시급", "주급"],
          ["시급", "월급"],
          ["시급", "연봉"],
          ["일급", "시급"],
          ["일급", "주급"],
          ["일급", "월급"],
          ["일급", "연봉"],
        ].some(([from, to]) => type1 === from && type2 === to) && (
          <div className="flex w-full flex-col gap-2">
            <span className="text-base text-[#666666]">주휴수당</span>
            <div className="flex h-9 min-h-9 w-full items-center gap-2.5">
              <button
                type="button"
                className={`${weekHolidayPayChk === "포함" && "bg-[#DC143C33]"} flex h-full flex-1 items-center justify-center rounded border border-solid border-normal text-sm`}
                onClick={() => handleWeekHolidayPayChkChange("포함")}
              >
                포함
              </button>
              <button
                type="button"
                className={`${weekHolidayPayChk === null && "bg-[#DC143C33]"} flex h-full flex-1 items-center justify-center rounded border border-solid border-normal text-sm`}
                onClick={() => handleWeekHolidayPayChkChange(null)}
              >
                미포함
              </button>
            </div>
          </div>
        )}

        {/* 세금 적용 여부 */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-base text-[#666666]">세금</span>
          <div className="relative flex h-9 min-h-9 w-full overflow-hidden rounded-md border border-solid border-normal">
            <select
              className="h-full w-full appearance-none bg-white px-[10px] py-[6px] text-sm text-[#333333] hover:outline-none focus:outline-none"
              value={tax || "null"}
              onChange={(e) => handleTaxChange(e)}
            >
              <option value="null">미적용</option>
              <option value="9.4%">9.4%</option>
              <option value="3.3%">3.3%</option>
            </select>
            <img
              src="/assets/images/icons/svg/down_arrow_bold_short.svg"
              alt="Arrow Down"
              className="absolute right-[10px] top-1/2 h-[5px] w-[10px] -translate-y-1/2 transform"
            />
          </div>
        </div>

        {/* 수습 적용 여부 */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-base text-[#666666]">수습</span>
          <div className="flex h-9 min-h-9 w-full items-center gap-2.5">
            <button
              type="button"
              className={`${probationPeriod === "적용" && "bg-[#DC143C33]"} flex h-full flex-1 items-center justify-center rounded border border-solid border-normal text-sm`}
              onClick={() => handleProbationPeriodChange("적용")}
            >
              적용
            </button>
            <button
              type="button"
              className={`${probationPeriod === null && "bg-[#DC143C33]"} flex h-full flex-1 items-center justify-center rounded border border-solid border-normal text-sm`}
              onClick={() => handleProbationPeriodChange(null)}
            >
              미적용
            </button>
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
          onClick={handleCalulateButtonClick}
        >
          계산하기
        </button>
      </div>

      {/* 계산 결과 */}
      {calcResult && (
        <div ref={resultRef} className="w-full">
          <div className="flex flex-col gap-5 bg-white px-5 pb-5 pt-10">
            <div className="flex w-full items-center justify-between">
              <span className="text-base text-[#666666]">예상 {type2}</span>
              <span className="text-base font-semibold">
                {type2 === "시급" && calcResult.hourSalary?.toLocaleString()}
                {type2 === "일급" && calcResult.dailySalary?.toLocaleString()}
                {type2 === "주급" && calcResult.weekSalary?.toLocaleString()}
                {type2 === "월급" && calcResult.monthSalary?.toLocaleString()}
                {type2 === "연봉" && calcResult.yearSalary?.toLocaleString()}원
              </span>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="text-base text-[#666666]">예상 주휴수당</span>
              <span className="text-base font-semibold">
                {weekHolidayPayChk === "포함"
                  ? `(+) ${calcResult.weekHolidayPay?.toLocaleString()}원`
                  : "-"}
              </span>
            </div>

            {type1 === "시급" && (type2 === "주급" || type2 === "월급") && (
              <div className="flex w-full items-center justify-between">
                <span className="text-base text-[#666666]">
                  예상 {type2 === "주급" && "주"}
                  {type2 === "월급" && "월"} 연장수당
                </span>
                <span className="text-base font-semibold">
                  (+) {calcResult.overtimePay?.toLocaleString()}원
                </span>
              </div>
            )}
            <hr className="border-t border-solid border-[#D9D9D9]" />
            <div className="flex w-full items-center justify-between">
              <span className="text-base text-[#666666]">최종 환산금액</span>
              <span className="text-base font-semibold">
                {calcResult.totalSalary.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 초기화 */}
          <div className="flex w-full items-center justify-center px-10 py-[6px]">
            <button
              type="button"
              className="h-9 min-h-9 w-[150px] rounded-[3px] border border-solid border-normal bg-white text-base"
              onClick={handleResetButtonClick}
            >
              초기화
            </button>
          </div>
        </div>
      )}

      {/* 확인 팝업 */}
      {/* {isConfirmPopupOpen && (
        <ConfirmPopup
          title={confirmTitle}
          message={confirmMessage}
          onClose={() => setIsConfirmPopupOpen(false)}
        />
      )} */}
    </div>
  );
}

export default SalaryCalc;
