import { PAGE_SIZE } from "@/utils/faultLogs";

interface Props {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, loading, onPageChange }: Props) {
  const delta = 2;
  const visiblePages: number[] = [];

  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    visiblePages.push(i);
  }

  const pageButtons: (number | string)[] = [1];
  if (currentPage - delta > 2) pageButtons.push("...");
  pageButtons.push(...visiblePages);
  if (currentPage + delta < totalPages - 1) pageButtons.push("...");
  if (totalPages > 1) pageButtons.push(totalPages);

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {totalPages} ({totalPages * PAGE_SIZE} total records)
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pageButtons.map((page, idx) => (
          <button
            key={idx}
            disabled={page === "..." || loading || page === currentPage}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : page === "..."
                ? "text-gray-400 cursor-default"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}