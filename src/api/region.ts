import api from "./baseUrl";

export interface FormMailAdSigunguListResponse {
  code: string;
  message: string;
  regionsList: RegionsListSigungu[];
}

export interface RegionsListSigungu {
  sido: string;
  sigungu?: string;
  dongEubMyun?: string;
}

export interface FormMailAdDongEubMyunListResponse {
  code: string;
  message: string;
  regionsList: RegionsListDongEubMyun[];
}

export interface RegionsListDongEubMyun {
  sido: string;
  sigungu: string;
  dongEubMyun: string;
}

// 지역 조회 (시/군/구)
export const formMailAdSigunguList = async (sido: string) => {
  try {
    const response = await api.post<FormMailAdSigunguListResponse>(
      "/formMail_ad/sigunguList",
      { sido },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 지역 조회 (동/읍/면)
export const formMailAdDonEubMyunList = async (
  sido: string,
  sigungu: string,
) => {
  try {
    const response = await api.post<FormMailAdDongEubMyunListResponse>(
      "/formMail_ad/dongEubMyunList",
      { sido, sigungu },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
