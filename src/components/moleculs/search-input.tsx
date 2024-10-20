import { useEffect, useRef } from "react";
import { Input } from "../atom/input";
import { Button } from "../atom/button";
import { Search, SearchIcon } from "lucide-react";
import { useAtom } from "jotai";
import { searchQuery, isSearchOpenAtom } from "@/services/atom/atom";

const SearchInput = () => {
    const searchRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useAtom(searchQuery);
    const [isSearchOpen, setIsSearchOpen] = useAtom(isSearchOpenAtom);


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        }

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchOpen]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        setIsSearchOpen(true);
        if (value === "") {
            setIsSearchOpen(false)
        } else {
            setIsSearchOpen(true)
        }
    };

    return (
        <div className={`${isSearchOpen ? "w-full flex-1 relative" : "w-fit"} md:w-auto md:flex-none`} ref={searchRef}>
            {isSearchOpen ? (
                <>
                    <Input
                        type="search"
                        placeholder="Search movies..."
                        value={query} // Bind the input value to query
                        onChange={handleSearch} // Update atom value on input change
                        className="md:w-[300px] lg:w-[400px]"
                    />
                    <SearchIcon size={16} className="absolute top-1/2 right-3 -translate-y-1/2" />
                </>
            ) : (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-transparent"
                >
                    <Search className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default SearchInput;
