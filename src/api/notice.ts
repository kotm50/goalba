import api from "./baseUrl";

export interface NoticeList {
  num: number;
  title: string;
  content: string;
  type: string;
  created: string;
  updated: string;
  faqCategory?: string;
  viewCount?: number;
}

export interface NoticeFindAllListRequest {
  page: number;
  size: number;
  type: "B01" | "B02";
  keyword?: string;
}

export interface NoticeFindAllListResponse {
  code: string;
  message: string;
  noticeList: NoticeList[];
  totalPages: number;
}

export interface FindOneNotice {
  num: number;
  title: string;
  content: string;
  type: string;
  created: string;
  updated: string;
  viewCount?: number;
}

export interface NoticeFindOneResponse {
  code: string;
  message: string;
  findOneNotice: FindOneNotice;
}

export interface NoticeFindFaqCategoryRequest {
  page: number;
  size: number;
  faqCategory: string | null;
  keyword?: string;
}

// 공지사항, FAQ 전체 조회
export const noticeFindAllList = async (
  noticeFindAllListRequest: NoticeFindAllListRequest,
) => {
  const { page, size, type, keyword } = noticeFindAllListRequest;

  try {
    const response = await api.post<NoticeFindAllListResponse>(
      "/notice/find/allList",
      {
        page,
        size,
        type,
        keyword,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 원하는 공지사항, FAQ 상세 조회
export const noticeFindOne = async (num: number) => {
  try {
    const response = await api.post<NoticeFindOneResponse>("/notice/find/one", {
      num,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 카테고리별 FAQ 찾기
export const noticeFindFaqCategory = async (
  noticeFindFaqCategoryRequest: NoticeFindFaqCategoryRequest,
) => {
  const { page, size, faqCategory, keyword } = noticeFindFaqCategoryRequest;

  try {
    const response = await api.post<NoticeFindAllListResponse>(
      "/notice/find/faq/category",
      {
        page,
        size,
        faqCategory,
        keyword,
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
