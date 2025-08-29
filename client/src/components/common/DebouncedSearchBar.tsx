import { Search } from "lucide-react";

interface DebouncedSearchBarProps<T> {
  placeholder: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearch: () => void;
  setResults: React.Dispatch<React.SetStateAction<T[]>>;
}

const DebouncedSearchBar = <T,>({
  placeholder,
  search,
  setSearch,
  debouncedSearch,
  setResults,
}: DebouncedSearchBarProps<T>) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    debouncedSearch();
  };

  return (
    <div className="flex items-center rounded-lg w-auto text-sm min-h-10 px-3 outline-0 ring-1 ring-gray-200 hover:ring-primary focus-within:ring-primary transition-all duration-200">
      <Search className="h-5 w-5" />
      <input
        className="outline-0 border-0 w-full pl-2"
        placeholder={placeholder}
        value={search}
        onChange={handleOnChange}
      ></input>
    </div>
  );
};

export default DebouncedSearchBar;
