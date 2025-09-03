import { Search } from "lucide-react";
import type React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface DebouncedSearchBarProps<T> {
  placeholder: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearch: () => void;
  results: T[];
  setResults: React.Dispatch<React.SetStateAction<T[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  renderResult: (result: T) => React.ReactNode;
}

const DebouncedSearchBar = <T,>({
  placeholder,
  search,
  setSearch,
  debouncedSearch,
  results,
  setResults,
  isLoading,
  setIsLoading,
  renderResult,
}: DebouncedSearchBarProps<T>) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setResults([]);
      setIsLoading(true);
      return;
    }
    setIsLoading(true);
    debouncedSearch();
  };

  return (
    <div className="relative flex flex-col">
      <div
        className={`relative flex items-center w-auto text-sm min-h-10 px-3 outline-0 ring-1 ring-gray-200 transition-[box-shadow] duration-200 ${
          search ? "rounded-t-lg ring-primary" : "rounded-lg"
        } hover:ring-primary focus-within:ring-primary`}
      >
        <Search className="h-5 w-5" />
        <input
          className="outline-0 border-0 w-full pl-2"
          placeholder={placeholder}
          value={search}
          onChange={handleOnChange}
        />
      </div>
      {search && (
        <div className="absolute left-0 top-full w-full ring-primary ring-1 rounded-b-lg bg-white h-fit shadow-md overflow-scroll">
          {isLoading && (
            <div className="flex justify-center items-center w-full text-sm text-gray-400 h-10">
              <LoadingSpinner dimensions={{ x: 6, y: 6 }} />
            </div>
          )}
          {results.length === 0 && !isLoading && (
            <div className="flex justify-center items-center w-full text-sm text-gray-400 h-10">
              No results found.
            </div>
          )}
          {results.length > 0 && !isLoading && results.map(renderResult)}
        </div>
      )}
    </div>
  );
};

export default DebouncedSearchBar;
