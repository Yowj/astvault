import { useState, useEffect } from "react";
import { LoaderIcon, X, Plus, Sparkles, ImageIcon, Paperclip, Globe, Users } from "lucide-react";
import { useCreateTemplate, useTemplates} from "../../hooks/useTemplates";
import { useUserFamilies } from "../../hooks/useFamilies";

const TemplateForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    newCategory: "",
    imageUrl: "",
    fileUrl: "",
    visibility: "public",
    familyId: "",
  });

  const [categories, setCategories] = useState([]);

  const { createTemplateMutate, createTemplateIsPending } = useCreateTemplate();
  const { templates, templatesIsPending } = useTemplates();
  const { families } = useUserFamilies();

  useEffect(() => {
    if (templates && templates.length > 0) {
      const categories = templates.map((template) => template.category);
      const uniqueCategories = Array.from(new Set(categories));
      setCategories(uniqueCategories);
    }
  }, [templates]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryToUse = formData.category === "1" ? formData.newCategory : formData.category;

    const resolvedFamilyId =
      formData.visibility === "family"
        ? families.length === 1
          ? families[0].id
          : formData.familyId
        : null;

    const resolvedFamilyName =
      formData.visibility === "family"
        ? families.find((f) => f.id === resolvedFamilyId)?.name || null
        : null;

    createTemplateMutate({
      title: formData.title,
      description: formData.description,
      category: categoryToUse,
      imageUrl: formData.imageUrl.trim() || null,
      fileUrl: formData.fileUrl.trim() || null,
      visibility: formData.visibility,
      familyId: resolvedFamilyId,
      familyName: resolvedFamilyName,
    });

    setFormData({
      title: "",
      description: "",
      category: "",
      newCategory: "",
      imageUrl: "",
      fileUrl: "",
      visibility: "public",
      familyId: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md lg:max-w-lg xl:max-w-xl relative overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-300">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-content" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-base-content">
                  Create Template
                </h2>
                <p className="text-sm text-base-content/70 mt-0.5">
                  Share your template with the community
                </p>
              </div>
            </div>
            <button
              className="p-2 hover:bg-base-300 rounded-lg transition-colors duration-200"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-5 h-5 text-base-content/70" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Title
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category Select */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Category
                </span>
              </label>
              <select
                name="category"
                className="select select-bordered w-full focus:select-primary transition-all duration-200"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {!templatesIsPending &&
                  categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                <option value="1">+ Create new category</option>
              </select>
            </div>

            {/* New Category Input */}
            {formData.category === "1" && (
              <div className="form-control animate-in slide-in-from-top duration-300">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">
                    New Category Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter the name for your new category"
                  className="input input-bordered w-full focus:input-primary transition-all duration-200"
                  name="newCategory"
                  value={formData.newCategory}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Visibility Selector */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">Visibility</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    className="radio radio-primary radio-sm"
                    checked={formData.visibility === "public"}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, visibility: "public", familyId: "" }))
                    }
                  />
                  <span className="flex items-center gap-1.5 text-sm">
                    <Globe className="w-3.5 h-3.5" /> Public
                  </span>
                </label>
                <label
                  className={`flex items-center gap-2 ${
                    families.length === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="family"
                    className="radio radio-secondary radio-sm"
                    checked={formData.visibility === "family"}
                    disabled={families.length === 0}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, visibility: "family" }))
                    }
                  />
                  <span className="flex items-center gap-1.5 text-sm">
                    <Users className="w-3.5 h-3.5" /> Family only
                  </span>
                </label>
              </div>
              {families.length === 0 && (
                <div className="label">
                  <span className="label-text-alt text-base-content/50">
                    Join or create a family first to share family-only templates
                  </span>
                </div>
              )}
            </div>

            {/* Family selector (shown when visibility is "family" and user has multiple families) */}
            {formData.visibility === "family" && families.length > 1 && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Share with</span>
                </label>
                <select
                  name="familyId"
                  className="select select-bordered w-full focus:select-secondary"
                  value={formData.familyId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a family
                  </option>
                  {families.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description Textarea */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content">
                  Content
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-32 sm:h-64 focus:textarea-primary transition-all duration-200 resize-none leading-relaxed p-3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <div className="label">
                <span className="label-text-alt text-base-content/60">
                  💡 Make it clear and useful for others to understand and use
                </span>
              </div>
            </div>

            {/* References (optional) */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-base-content">References <span className="text-base-content/40 font-normal">(optional)</span></p>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text flex items-center gap-1.5 text-base-content/70">
                    <ImageIcon className="w-3.5 h-3.5" /> Image URL
                  </span>
                </label>
                <input
                  type="url"
                  className="input input-bordered input-sm w-full focus:input-primary transition-all duration-200"
                  name="imageUrl"
                  placeholder="https://example.com/image.png"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text flex items-center gap-1.5 text-base-content/70">
                    <Paperclip className="w-3.5 h-3.5" /> File / Link URL
                  </span>
                </label>
                <input
                  type="url"
                  className="input input-bordered input-sm w-full focus:input-primary transition-all duration-200"
                  name="fileUrl"
                  placeholder="https://example.com/file.pdf"
                  value={formData.fileUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-base-200/50 px-4 py-4 sm:px-6 border-t border-base-300">
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={createTemplateIsPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={
                createTemplateIsPending ||
                !formData.title.trim() ||
                !formData.description.trim() ||
                !formData.category ||
                (formData.category === "1" && !formData.newCategory.trim()) ||
                (formData.visibility === "family" && families.length > 1 && !formData.familyId)
              }
              onClick={handleSubmit}
            >
              {createTemplateIsPending ? (
                <>
                  <LoaderIcon className="animate-spin w-4 h-4" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Template
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;