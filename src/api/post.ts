import api from "./baseUrl";

export interface DefaultResponse {
  code: string;
  message: string;
}

export interface FormMailAdAllJobsiteListRequest {
  page: number;
  size: number;
}

export interface JobsiteUserFindBookmarkListRequest {
  page: number;
  size: number;
  userId: string;
  type: "scrape" | "favorite";
}

export interface JobsiteUserFindBookmarkListResponse {
  code: string;
  message: string;
  jobSiteList: JobSiteList[];
  totalCount: number;
  totalPages: number;
}

export interface BookMarkList {
  num: number;
  userId: string;
  aid: string;
  type: string;
}

export interface JobsiteUserDeleteBookmarkOneRequest {
  userId: string;
  aid: string;
  type: string;
}

export interface JobsiteUserDeleteBookmarkAllRequest {
  userId: string;
  type: string;
}

export interface JobSiteList {
  aid: string;
  startDate?: string;
  endDate?: string | null;
  extensionDay?: number;
  adImg?: string;
  detailContent?: string;
  logoImg?: string;
  totalDay?: number;
  heaven?: string;
  albamon?: string;
  telejob?: string;
  adTypeM?: string;
  adTypeH?: string;
  userName?: string;
  company?: string;
  address?: string;
  title?: string;
  workStart?: string;
  workEnd?: string;
  restTime?: string;
  minPay?: string;
  maxPay?: string;
  workDay?: string;
  workDateDetail?: string;
  welfare?: string;
  experience?: string;
  adNum?: string;
  workTime?: boolean;
  workDate?: boolean;
  workTimeDetail?: string;
  grade?: number;
  sido?: string;
  sigungu?: string;
  dongEubMyun?: string;
  salary?: string;
  salaryType?: string;
  jobType?: string;
  employmentType?: string;
  recruitCount?: string;
  workPeriod?: string;
  workDays?: string;
  gender?: string;
  age?: string;
  education?: string;
  preConditions?: string;
  etcConditions?: string;
  applyMethod?: string;
  nearUniversity?: string;
  x?: number;
  y?: number;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  hashtag?: string;
  created?: string;
  updated?: string;
  photoList?: string;
  probation?: string;
  periodDiscussion?: string;
  applyUrl?: string;
}

export interface FormMailAdAllJobsiteListResponse {
  code: string;
  message: string;
  jobSiteList?: JobSiteList[];
  totalPages: number;
}

export interface FormMailAdFindOneJobsiteResponse {
  code: string;
  message: string;
  jobSiteList: JobSiteList[];
}

export interface FormMailAdSearchGradeListRequest {
  page: number;
  size: number;
  grade: number;
}

export interface FormMailAdSelectByRegionsSortRequest {
  page: number;
  size: number;
  regions?: Region[];
  registerType?: string;
  sortType?: string;
  adType?: string;
  keyword?: string;
}

export interface FormMailAdSelectByRegionsSortResponse {
  code: string;
  message: string;
  jobSiteList: JobSiteList[];
  totalPages: number;
  totalCount: number;
}

export interface Region {
  sido?: string;
  sigungu?: string;
  dongEubMyun?: string;
}

export interface FormMailAdFindNearInfoResponse {
  code: string;
  message: string;
  nearInfoList: NearInfo[];
}

export interface NearInfo {
  aid: string;
  nearStation: string;
  distance: string;
  durationTime: string;
  line: string;
  subwayColor?: string;
}

export interface JobsiteUserAddBookmarkRequest {
  userId: string;
  aid: string;
  type: string;
}

export interface JobsiteDupBookmarkCheckRequest {
  userId: string;
  aid: string;
  type: "scrape" | "favorite";
}

export interface JobsiteUserRecentViewsResponse {
  code: string;
  message: string;
  jobSiteList: JobSiteList[];
  totalCount: number;
}

// 스크랩 or 좋아요 전체 조회
export const jobsiteUserFindBookmarkList = async (
  jobsiteUserFindBookmarkListRequest: JobsiteUserFindBookmarkListRequest,
) => {
  const { page, size, userId, type } = jobsiteUserFindBookmarkListRequest;

  try {
    const response = await api.post<JobsiteUserFindBookmarkListResponse>(
      "/jobsite/user/find/bookmarkList",
      {
        page,
        size,
        userId,
        type,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 스크랩 or 좋아요 하나 삭제
export const jobsiteUserDeleteBookmarkOne = async (
  jobsiteUserDeleteBookmarkOneRequest: JobsiteUserDeleteBookmarkOneRequest,
) => {
  const { userId, aid, type } = jobsiteUserDeleteBookmarkOneRequest;

  try {
    const response = await api.delete<DefaultResponse>(
      "/jobsite/user/delete/bookmark/one",
      {
        data: {
          userId,
          aid,
          type,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 스크랩 or 좋아요 전체 삭제
export const jobsiteUserDeleteBookmarkAll = async (
  jobsiteUserDeleteBookmarkAllRequest: JobsiteUserDeleteBookmarkAllRequest,
) => {
  const { userId, type } = jobsiteUserDeleteBookmarkAllRequest;

  try {
    const response = await api.delete<DefaultResponse>(
      "/jobsite/user/delete/bookmark/all",
      {
        data: {
          userId,
          type,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 잡사이트용 광고 전체 조회 (종료기간 끝난 광고 조회 X)
export const formMailAdAllJobsiteList = async (
  formMailAdAllJobsiteListRequest: FormMailAdAllJobsiteListRequest,
) => {
  const { page, size } = formMailAdAllJobsiteListRequest;

  try {
    const response = await api.post<FormMailAdAllJobsiteListResponse>(
      "/formMail_ad/allJobsiteList",
      {
        page,
        size,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 잡사이트용 aid가 일치하는 광고 조회 (종료기간 끝난 광고 조회 X)
export const formMailAdFindOneJobsite = async (aid: string) => {
  try {
    const response = await api.post<FormMailAdFindOneJobsiteResponse>(
      "/formMail_ad/findOneJobsite",
      {
        aid,
      },
    );

    return response.data.jobSiteList[0];
  } catch (error) {
    console.error(error);
  }
};

// 잡사이트용 grade 별로 유료 광고 조회 (종료기간 끝난 광고 조회 X
export const formMailAdSearchGradeList = async (
  formMailAdSearchGradeListRequest: FormMailAdSearchGradeListRequest,
) => {
  const { page, size, grade } = formMailAdSearchGradeListRequest;

  try {
    const response = await api.post<FormMailAdAllJobsiteListResponse>(
      "/formMail_ad/searchGradeList",
      {
        page,
        size,
        grade,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 포커스 공고 조회
export const formMailAdSearchFocusList = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  try {
    const response = await api.post<FormMailAdAllJobsiteListResponse>(
      "/formMail_ad/searchFocusList",
      {
        page,
        size,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 최근에 본 공고 저장
export const saveRecentJob = (jobId: string, userId: string) => {
  if (!userId) {
    return;
  }

  const key = `recentJobs_${userId}`; // 사용자별 키
  const maxJobs = 20; // 최대 저장 개수

  // 기존 데이터 불러오기
  let recentJobs: string[] = JSON.parse(localStorage.getItem(key) || "[]");

  // 중복 제거 및 최신 공고 추가
  recentJobs = recentJobs.filter((id) => id !== jobId); // 중복 제거
  recentJobs.unshift(jobId); // 맨 앞에 추가

  // 최대 개수 제한
  if (recentJobs.length > maxJobs) {
    recentJobs = recentJobs.slice(0, maxJobs);
  }

  // localStorage에 저장
  localStorage.setItem(key, JSON.stringify(recentJobs));
};

// 최근 본 공고 불러오기
export const getRecentJobs = (userId: string): string[] => {
  if (!userId) {
    return [];
  }

  const key = `recentJobs_${userId}`; // 사용자별 키
  return JSON.parse(localStorage.getItem(key) || "[]");
};

// 잡사이트용 지역, 등록일 조건, 정렬 조건 사용한 공고 조회 (종료기간 끝난 공고 조회 X)
export const formMailAdSelectByRegionsSort = async (
  formMailAdSelectByRegionsSortRequest: FormMailAdSelectByRegionsSortRequest,
) => {
  const { page, size, regions, registerType, sortType, adType, keyword } =
    formMailAdSelectByRegionsSortRequest;

  try {
    const response = await api.post<FormMailAdSelectByRegionsSortResponse>(
      "/formMail_ad/selectByRegions/sort",
      {
        page,
        size,
        regions,
        registerType,
        sortType,
        adType,
        keyword,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 상세 공고 주변 역 정보 조회
export const formMailAdFindNearInfo = async (aid: string) => {
  try {
    const response = await api.post<FormMailAdFindNearInfoResponse>(
      "formMail_ad/find/nearInfo",
      {
        aid,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 스크랩 or 좋아요 추가
export const jobsiteUserAddBookmark = async (
  jobsiteUserAddBookmarkRequest: JobsiteUserAddBookmarkRequest,
) => {
  const { userId, aid, type } = jobsiteUserAddBookmarkRequest;

  try {
    const response = await api.post<DefaultResponse>(
      "/jobsite/user/add/bookmark",
      {
        userId,
        aid,
        type,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 스크랩 or 좋아요 중복 체크
export const jobsiteDupBookmarkCheck = async (
  jobsiteDupBookmarkCheckRequest: JobsiteDupBookmarkCheckRequest,
) => {
  const { userId, aid, type } = jobsiteDupBookmarkCheckRequest;

  try {
    const response = await api.post<DefaultResponse>(
      "/jobsite/user/dup/bookmark/check",
      {
        userId,
        aid,
        type,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 최근 열람 공고 조회 API
export const jobsiteUserRecentViews = async (userId: string) => {
  try {
    const response = await api.post<JobsiteUserRecentViewsResponse>(
      "/jobsite/user/recent/views",
      {
        userId,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
