import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTemplates } from "../hooks/useTemplates";
import { usePagination } from "../hooks/usePagination";
import useAuthUser from "../hooks/useAuthUser";
import TemplateForm from "../components/templates/TemplateForm";
import TemplatesContainer from "../components/templates/TemplatesContainer";
import Pagination from "../components/templates/Pagination";
import SearchBar from "../components/templates/SearchBar";
import CategoryFilter from "../components/templates/CategoryFilter";
import CreateButton from "../components/templates/CreateButton";

const ITEMS_PER_PAGE = 11;

const Home = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { templates, templatesIsPending } = useTemplates();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    page: 1
  });

  const categories = useMemo(
    () => [...new Set((templates || []).map((t) => t.category))],
    [templates]
  );

  const filteredTemplates = useMemo(() => {
    return (templates || []).filter((template) => {
      const matchesSearch =
        !filters.searchTerm ||
        template.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesCategory = !filters.category || template.category === filters.category;

      return matchesSearch && matchesCategory;
    });
  }, [templates, filters.searchTerm, filters.category]);

  const { currentItems, totalPages, pageNumbers } = usePagination(
    filteredTemplates,
    filters.page,
    ITEMS_PER_PAGE
  );

  const updateFilters = useCallback((updates) => {
    setFilters(prev => ({ ...prev, page: 1, ...updates }));
  }, []);

  const handleCreateClick = useCallback(() => {
    if (authUser) {
      setIsFormOpen(true);
    } else {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [authUser, navigate]);

  return (
    <div className="flex flex-col lg:flex-row bg-base-100 min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-8rem)] px-4 md:px-6 lg:px-8">
      <DesktopSidebar
        onClearFilters={() => updateFilters({ searchTerm: "", category: "" })}
        onCreateClick={handleCreateClick}
        categories={categories}
        selectedCategory={filters.category}
        onCategoryChange={(category) => updateFilters({ category })}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <MobileHeader
          onClearFilters={() => updateFilters({ searchTerm: "", category: "" })}
          onCreateClick={handleCreateClick}
          categories={categories}
          selectedCategory={filters.category}
          onCategoryChange={(category) => updateFilters({ category })}
        />

        <main className="flex flex-col justify-between flex-1 p-2 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
          <div className="flex-1 space-y-3 sm:space-y-4 min-h-0">
            <div className="flex-shrink-0">
              <SearchBar
                searchTerm={filters.searchTerm}
                onSearchChange={(searchTerm) => updateFilters({ searchTerm })}
              />
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <TemplatesContainer
                templates={currentItems}
                isLoading={templatesIsPending}
                toggleOpen={() => setIsFormOpen(false)}
                searchTerm={filters.searchTerm}
                selectedCategory={filters.category}
              />
            </div>
          </div>

          <div className="flex-shrink-0 pt-2 sm:pt-4">
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            />
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <CreateButton floating onClick={handleCreateClick} />
      </div>

      {isFormOpen && <TemplateForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

const DesktopSidebar = ({ onClearFilters, onCreateClick, categories, selectedCategory, onCategoryChange }) => (
  <aside className="hidden lg:flex flex-col w-60 xl:w-72 p-3 lg:p-4 space-y-3 lg:space-y-4 h-full">
    <button className="btn btn-primary btn-sm lg:btn-md w-full" onClick={onClearFilters}>
      Show All Templates
    </button>
    <CreateButton onClick={onCreateClick} />
    <CategoryFilter
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={onCategoryChange}
    />
  </aside>
);

const MobileHeader = ({ onClearFilters, onCreateClick, categories, selectedCategory, onCategoryChange }) => (
  <div className="lg:hidden bg-base-200 p-2 sm:p-4 space-y-2 sm:space-y-3 border-b border-base-300">
    <div className="flex gap-2">
      <button
        className="btn btn-primary btn-xs sm:btn-sm flex-1 text-xs sm:text-sm"
        onClick={onClearFilters}
      >
        <span className="hidden xs:inline">All Templates</span>
        <span className="xs:hidden">All</span>
      </button>
      <CreateButton mobile onClick={onCreateClick} />
    </div>
    <CategoryFilter
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={onCategoryChange}
      mobile
    />
  </div>
);

export default Home;