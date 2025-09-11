import React, { useState } from "react";
import { useTemplates } from "../hooks/useTemplates";
import { usePagination } from "../hooks/usePagination";
import TemplateForm from "../components/templates/TemplateForm";
import TemplatesContainer from "../components/templates/TemplatesContainer";
import Pagination from "../components/templates/Pagination";
import SearchBar from "../components/templates/SearchBar";
import CategoryFilter from "../components/templates/CategoryFilter";
import CreateButton from "../components/templates/CreateButton";

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { templates, templatesIsPending } = useTemplates();

  // Filter templates based on search and category
  const filteredTemplates = (templates || []).filter((template) => {
    const matchesSearch =
      !searchTerm ||
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories from templates
  const categories = [...new Set((templates || []).map((t) => t.category))];

  // Pagination
  const { currentItems, totalPages, pageNumbers } = usePagination(
    filteredTemplates,
    currentPage,
    11
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-base-100 min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)] px-4 md:px-6 lg:px-8">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-72 p-3 lg:p-4 space-y-3 lg:space-y-4  h-full">
        <button className="btn btn-primary btn-sm lg:btn-md w-full" onClick={handleClearFilters}>
          Show All Templates
        </button>

        <CreateButton onClick={() => setIsFormOpen(true)} />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-base-200 p-2 sm:p-4 space-y-2 sm:space-y-3 border-b border-base-300">
          <div className="flex gap-2">
            <button className="btn btn-primary btn-xs sm:btn-sm flex-1 text-xs sm:text-sm" onClick={handleClearFilters}>
              <span className="hidden xs:inline">All Templates</span>
              <span className="xs:hidden">All</span>
            </button>
            <CreateButton size="sm" mobile onClick={() => setIsFormOpen(true)} />
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            mobile
          />
        </div>

        {/* Main Content Area */}
        <main className="flex flex-col justify-between flex-1 p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
          <div className="flex-1 space-y-3 sm:space-y-4 min-h-0">
            <div className="flex-shrink-0">
              <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <TemplatesContainer
                templates={currentItems}
                isLoading={templatesIsPending}
                toggleOpen={() => setIsFormOpen(false)}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>

          <div className="flex-shrink-0 pt-2 sm:pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      {/* Mobile FAB */}
      <div className="lg:hidden">
        <CreateButton floating onClick={() => setIsFormOpen(true)} />
      </div>

      {/* Template Form Modal */}
      {isFormOpen && <TemplateForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default Home;
