import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PaginationProps {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (!Number.isFinite(totalPages) || totalPages <= 0) return null;


    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <nav className="flex items-center justify-end mt-6 gap-2">
            {/* Previous Button */}
            <button
                onClick={handlePrevious}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex items-center gap-1"
                )}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isActive = currentPage === page;
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            buttonVariants({ variant: isActive ? "outline" : "ghost" }),
                            "w-9 h-9 rounded-md"
                        )}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                onClick={handleNext}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex items-center gap-1"
                )}
                disabled={currentPage === totalPages}
            >
                Next <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
};
