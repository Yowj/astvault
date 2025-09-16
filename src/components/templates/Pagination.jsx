
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  pageNumbers = [] 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-4 sm:mt-6 lg:mt-8 px-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-xs sm:btn-sm btn-outline disabled:opacity-50 flex-shrink-0"
      >
        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden md:inline text-xs sm:text-sm">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide max-w-[200px] sm:max-w-none">
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`btn btn-xs sm:btn-sm min-w-[2rem] sm:min-w-[2.5rem] flex-shrink-0 text-xs sm:text-sm ${
              page === currentPage 
                ? 'btn-primary' 
                : page === '...' 
                  ? 'btn-ghost cursor-default' 
                  : 'btn-ghost hover:btn-outline'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-xs sm:btn-sm btn-outline disabled:opacity-50 flex-shrink-0"
      >
        <span className="hidden md:inline text-xs sm:text-sm">Next</span>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};

export default Pagination;