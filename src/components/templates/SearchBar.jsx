import { Search, X } from "lucide-react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-3 h-3 sm:w-4 sm:h-4 z-50" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search templates..."
        className="input input-bordered w-full pl-8 sm:pl-10 pr-8 sm:pr-10 focus:input-primary h-10 sm:h-12 text-sm sm:text-base"
      />
      {searchTerm && (
        <button
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-50 hover:bg-base-200 rounded-full p-1 transition-colors"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;