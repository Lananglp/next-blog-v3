import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';

interface InputSearchProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    debounceDelay?: number;
    className?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({ onSearch, placeholder = 'Cari...', debounceDelay = 1000, className }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const debouncedSearch = useCallback(
        (value: string) => {
            onSearch(value);
        },
        [onSearch]
    );

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        if (searchTerm) {
            timeoutId = setTimeout(() => {
                debouncedSearch(searchTerm);
            }, debounceDelay);
        } else {
            onSearch(''); // Call onSearch with empty string when searchTerm is empty
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [searchTerm, debouncedSearch, debounceDelay, onSearch]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="w-full">
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
                        aria-hidden="true"
                        xmlns="http:www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <Input
                    type="text"
                    className={`ps-8 ${className}`}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleChange}
                    variant={'primary'}
                />
            </div>
        </div>
    );
};

export default InputSearch;