"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function PaginationControls({ currentPage, totalPages, onPageChange, className }: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 1 
    const range = []
    const rangeWithDots = []

   
    if (currentPage > delta + 2) {
      rangeWithDots.push(1)
      if (currentPage > delta + 3) {
        rangeWithDots.push("ellipsis")
      }
    }

  
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      rangeWithDots.push(i)
    }

    // Always show last page
    if (currentPage < totalPages - delta - 1) {
      if (currentPage < totalPages - delta - 2) {
        rangeWithDots.push("ellipsis")
      }
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <Pagination className={className}>
      <PaginationContent className="flex-wrap gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={`${
              currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            } text-xs sm:text-sm px-2 sm:px-3`}
          />
        </PaginationItem>

        <div className="hidden sm:contents">
          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        {/* Mobile: Show only current page info */}
        <div className="sm:hidden flex items-center px-3 py-2 text-sm text-gray-600">
          {currentPage} of {totalPages}
        </div>

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={`${
              currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
            } text-xs sm:text-sm px-2 sm:px-3`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
