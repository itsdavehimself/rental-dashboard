import type React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { type UseFormRegisterReturn } from "react-hook-form";

interface SearchInputProps<T> {
  label: string;
  placeholder: string;
  debouncedSearch: () => void;
  results: T[];
  setResults: React.Dispatch<React.SetStateAction<T[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  renderResult: (result: T) => React.ReactNode;
  register?: UseFormRegisterReturn;
  error?: string | undefined;
  defaultText?: string;
}

const SearchInput = <T,>({
  label,
  placeholder,
  debouncedSearch,
  results,
  setResults,
  isLoading,
  setIsLoading,
  renderResult,
  register,
  error,
  defaultText,
  ...rest
}: SearchInputProps<T>) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register?.onChange(e);
    const value = e.target.value;

    if (value.trim() === "") {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debouncedSearch();
  };

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">{label}</label>
        <input
          {...register}
          {...rest}
          onChange={handleOnChange}
          type="text"
          placeholder={placeholder}
          defaultValue={defaultText}
          autoComplete="off"
          className={`text-sm outline-1 w-full h-10 pl-2 
    transition-colors duration-200 outline-gray-200
    ${
      error
        ? "outline-red-500 hover:outline-red-500 focus:outline-red-500"
        : "hover:outline-black focus:outline-primary focus:outline-1"
    }
    ${results.length > 0 ? "rounded-t-lg" : "rounded-lg"}`}
        />
      </div>

      {error && <p className="text-red-500 text-sm pt-1">{error}</p>}

      {results.length > 0 && (
        <div className="absolute z-100 left-0 top-full w-full ring-primary ring-1 rounded-b-lg bg-white h-fit shadow-md overflow-scroll">
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

export default SearchInput;
