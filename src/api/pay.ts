import api from "./baseUrl";

export interface CalculateSalaryWeekHolidayRequest {
  hourSalary: number;
  weekWorkTime: number;
}

export interface CalculateSalaryWeekHolidayResponse {
  code: string;
  message: string;
  weekHolidayPay: number;
}

export interface CalculateSalaryRequest {
  type1: "시급" | "일급" | "주급" | "월급" | "연봉";
  type2: "시급" | "일급" | "주급" | "월급" | "연봉";
  tax?: null | "9.4%" | "3.3%";
  weekHolidayPayChk?: null | "포함";
  probationPeriod?: null | "적용";
  overtime?: number;
  hourSalary?: number;
  dailySalary?: number;
  weekSalary?: number;
  monthSalary?: number;
  yearSalary?: number;
  workTime?: number;
  weekWorkDay?: number;
}

export interface CalculateSalaryResponse {
  code: string;
  message: string;
  hourSalary?: number;
  dailySalary?: number;
  weekSalary?: number;
  monthSalary?: number;
  yearSalary?: number;
  weekHolidayPay?: number;
  overtimePay?: number;
  totalSalary: number;
}

// 주휴수당 계산기
export const calculateSalaryWeekHoliday = async (
  calculateSalaryWeekHolidayRequest: CalculateSalaryWeekHolidayRequest,
) => {
  const { hourSalary, weekWorkTime } = calculateSalaryWeekHolidayRequest;

  try {
    const response = await api.post<CalculateSalaryWeekHolidayResponse>(
      "/calculate/salary/weekHoliday",
      {
        hourSalary,
        weekWorkTime,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 급여 계산기 API
export const calculateSalary = async (
  calculateSalaryRequest: CalculateSalaryRequest,
) => {
  const {
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
  } = calculateSalaryRequest;

  try {
    const response = await api.post<CalculateSalaryResponse>(
      "/calculate/salary",
      {
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
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
