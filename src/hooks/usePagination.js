import { useMemo } from 'react';

export const usePagination = (items = [], currentPage = 1, itemsPerPage = 11) => {
  const paginationData = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);
    
    return {
      currentItems,
      totalPages,
      totalItems,
      hasMultiplePages: totalPages > 1,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
    };
  }, [items, currentPage, itemsPerPage]);

  // Generate page numbers for pagination UI
  const generatePageNumbers = (totalPages, currentPage) => {
    const pages = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const delta = isMobile ? 1 : 2;
    
    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination with ellipsis
      const start = Math.max(1, currentPage - delta);
      const end = Math.min(totalPages, currentPage + delta);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return {
    ...paginationData,
    pageNumbers: generatePageNumbers(paginationData.totalPages, currentPage),
  };
};