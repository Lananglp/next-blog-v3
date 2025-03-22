'use client';

import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalData: number;
    dataPerPage: number;
    onPageChange: (page: number) => void;
    className?: string;
    align?: 'start' | 'center' | 'end';
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalData,
    dataPerPage,
    onPageChange,
    className,
    align='end'
}) => {
    const totalPages = Math.ceil(totalData / dataPerPage);

    const [maxVisibleButtons, setMaxVisibleButtons] = useState<number>(10); // Use state

    const calculateMaxVisibleButtons = useCallback(() => { // Use useCallback
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1200) {
            setMaxVisibleButtons(10);
        } else if (screenWidth >= 768) {
            setMaxVisibleButtons(5);
        } else {
            setMaxVisibleButtons(3);
        }
    }, []); // Empty dependency array because it only uses window.innerWidth

    useEffect(() => {
        calculateMaxVisibleButtons(); // Initial calculation

        window.addEventListener('resize', calculateMaxVisibleButtons);
        return () => {
            window.removeEventListener('resize', calculateMaxVisibleButtons);
        };
    }, [calculateMaxVisibleButtons]);

    const generatePageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = startPage + maxVisibleButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const pages = generatePageNumbers();

    return (
        <div className={`
            flex items-center gap-1 
            ${align === 'start' && 'justify-start'} ${align === 'center' && 'justify-center'} ${align === 'end' && 'justify-end'} 
            ${className}
            `}
        >
            <Button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant={'editorBlockBar'}
                size={'iconXs'}
            >
                <ChevronLeft />
            </Button>
            {pages[0] > 1 && (
                <>
                    <Button
                        type="button"
                        onClick={() => handlePageChange(1)}
                        variant={currentPage === 1 ? 'primary' : 'editorBlockBar'}
                        size={'iconXs'}
                    >
                        1
                    </Button>
                    {pages[0] > 2 && <span className="px-2 dark:text-zinc-300">...</span>}
                </>
            )}
            {pages.map((page) => (
                <Button
                    type="button"
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? 'primary' : 'editorBlockBar'}
                    size={'iconXs'}
                >
                    {page}
                </Button>
            ))}
            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && <span className="px-2 dark:text-zinc-300">...</span>}
                    <Button
                        type="button"
                        onClick={() => handlePageChange(totalPages)}
                        variant={currentPage === totalPages ? 'primary' : 'editorBlockBar'}
                        size={'iconXs'}
                    >
                        {totalPages}
                    </Button>
                </>
            )}
            <Button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant={'editorBlockBar'}
                size={'iconXs'}
            >
                <ChevronRight />
            </Button>
        </div>
    );
};