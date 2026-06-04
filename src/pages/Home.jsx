import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Globe, Users, HelpCircle, Copy, Pin, Plus } from "lucide-react";
import { useTemplates } from "../hooks/useTemplates";
import { usePins, usePinTemplate, useUnpinTemplate } from "../hooks/usePins";
import { usePagination } from "../hooks/usePagination";
import useAuthUser from "../hooks/useAuthUser";
import { useUserFamilies } from "../hooks/useFamilies";
import TemplateForm from "../components/templates/TemplateForm";
import TemplatesContainer from "../components/templates/TemplatesContainer";
import PinnedPanel from "../components/templates/PinnedPanel";
import Pagination from "../components/templates/Pagination";
import SearchBar from "../components/templates/SearchBar";
import CategoryFilter from "../components/templates/CategoryFilter";
import CreateButton from "../components/templates/CreateButton";

const ITEMS_PER_PAGE = 11;

const Home = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { templates, templatesIsPending } = useTemplates();
  const { families } = useUserFamilies();
  const { pinnedIds } = usePins(authUser?.id);
  const { pinTemplateMutate } = usePinTemplate();
  const { unpinTemplateMutate } = useUnpinTemplate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [familyTab, setFamilyTab] = useState("all"); // "all" | "public" | family.id
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

      const matchesTab =
        familyTab === "all" ||
        (familyTab === "public" && template.visibility === "public") ||
        (familyTab !== "public" && template.family_id === familyTab);

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [templates, filters.searchTerm, filters.category, familyTab]);

  const pinnedTemplates = useMemo(
    () => (templates || []).filter((t) => pinnedIds.has(t.id)),
    [templates, pinnedIds]
  );

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
            <div className="flex-shrink-0 lg:hidden">
              <HowTemplatesWork />
            </div>

            <div className="flex-shrink-0">
              <SearchBar
                searchTerm={filters.searchTerm}
                onSearchChange={(searchTerm) => updateFilters({ searchTerm })}
              />
            </div>

            {(families.length > 0) && (
              <div className="flex-shrink-0 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                <button
                  className={`btn btn-xs gap-1 shrink-0 ${familyTab === "all" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => { setFamilyTab("all"); updateFilters({}); }}
                >
                  All
                </button>
                <button
                  className={`btn btn-xs gap-1 shrink-0 ${familyTab === "public" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => { setFamilyTab("public"); updateFilters({}); }}
                >
                  <Globe className="w-3 h-3" /> Public
                </button>
                {families.map((f) => (
                  <button
                    key={f.id}
                    className={`btn btn-xs gap-1 shrink-0 ${familyTab === f.id ? "btn-secondary" : "btn-ghost"}`}
                    onClick={() => { setFamilyTab(f.id); updateFilters({}); }}
                  >
                    <Users className="w-3 h-3" />
                    <span className="max-w-[100px] truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-auto">
              <TemplatesContainer
                templates={currentItems}
                isLoading={templatesIsPending}
                toggleOpen={() => setIsFormOpen(false)}
                searchTerm={filters.searchTerm}
                selectedCategory={filters.category}
                pinnedIds={pinnedIds}
                onPin={pinTemplateMutate}
                onUnpin={unpinTemplateMutate}
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

      <PinnedPanel pinnedTemplates={pinnedTemplates} onUnpin={unpinTemplateMutate} />

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
    <HowTemplatesWork />
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

const HowTemplatesWork = () => (
  <details className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
    <summary className="collapse-title text-sm font-semibold min-h-0 py-3 px-4">
      <span className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-primary shrink-0" />
        How it works
      </span>
    </summary>
    <div className="collapse-content">
      <ul className="space-y-2.5 text-sm text-base-content/70 pt-1">
        <li className="flex items-start gap-2">
          <Copy className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span>Copy a template's content to your clipboard with one click</span>
        </li>
        <li className="flex items-start gap-2">
          <Pin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span>Pin templates to your sidebar for quick access</span>
        </li>
        <li className="flex items-start gap-2">
          <Plus className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span>Create your own — pick a title, category, and write the content</span>
        </li>
        <li className="flex items-start gap-2">
          <Globe className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span>Public templates are visible to everyone on the app</span>
        </li>
        <li className="flex items-start gap-2">
          <Users className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span>Family-only templates are visible only to members of that family</span>
        </li>
      </ul>
    </div>
  </details>
);

export default Home;