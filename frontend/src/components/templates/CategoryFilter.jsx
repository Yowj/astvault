const CategoryFilter = ({ 
  categories = [], 
  selectedCategory, 
  onCategoryChange, 
}) => {
  return (
    <>
      {/* Desktop Categories */}
      <div className="hidden lg:block w-full">
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-3 w-full">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn w-full border-2 border-secondary hover:bg-accent hover:text-base-100 transition-all duration-200 ${
                selectedCategory === category ? "bg-accent text-base-100" : ""
              }`}
              onClick={() => onCategoryChange(category)}
            >
              <span className="truncate block w-full">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Categories */}
      <div className="lg:hidden flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`btn btn-xs sm:btn-sm whitespace-nowrap px-2 sm:px-3 ${
              selectedCategory === category
                ? "btn-accent shadow-md"
                : "btn-ghost hover:btn-neutral"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategoryFilter;