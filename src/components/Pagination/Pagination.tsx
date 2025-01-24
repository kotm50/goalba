interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

function Pagination(props: PaginationProps) {
  const { currentPage = 1, totalPages = 1, onPageChange } = props;

  // 현재 페이지 기준으로 보여줄 페이지 범위 계산
  const getVisiblePages = () => {
    const maxVisiblePages = 5; // 한 번에 보여줄 페이지 수
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    // 만약 끝 범위가 totalPages보다 작으면 시작 범위를 조정
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mx-auto flex h-8 max-w-[300px] items-center justify-center gap-[31px]">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded border border-solid border-normal bg-white disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => {
          if (currentPage && onPageChange) {
            onPageChange(currentPage - 1);
          }
        }}
      >
        <img
          src="/assets/images/icons/svg/pagination_left_arrow.svg"
          alt="Left"
          className="w-[5px]"
        />
      </button>
      {visiblePages.map((page, index) => (
        <button
          key={index}
          type="button"
          className={`text-base ${
            page === currentPage ? "text-[#DC143C]" : ""
          }`}
          onClick={() => {
            if (onPageChange) {
              onPageChange(page);
            }
          }}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded border border-solid border-normal bg-white disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => {
          if (currentPage && onPageChange) {
            onPageChange(currentPage + 1);
          }
        }}
      >
        <img
          src="/assets/images/icons/svg/pagination_right_arrow.svg"
          alt="Right"
          className="w-[5px]"
        />
      </button>
    </div>
  );
}

export default Pagination;
