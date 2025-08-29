import { Search } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface SearchBarProps {
  placeholder: string;
  register: UseFormRegisterReturn;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, register }) => {
  return (
    <div className="flex items-center rounded-lg w-auto text-sm min-h-10 px-3 outline-0 ring-1 ring-gray-200 hover:ring-primary focus-within:ring-primary transition-all duration-200">
      <Search className="h-5 w-5" />
      <input
        {...register}
        className="outline-0 border-0 w-full pl-2"
        placeholder={placeholder}
      ></input>
    </div>
  );
};

export default SearchBar;
