import { useState, useEffect } from "react";
import { LoaderIcon, X, Plus, Sparkles } from "lucide-react";
import { useCreateTemplate, useTemplates} from "../../hooks/useTemplates";

const TemplateForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    newCategory: "",
  });

  const [categories, setCategories] = useState([]);

  const { createTemplateMutate, createTemplateIsPending } = useCreateTemplate();
  const { templates, templatesIsPending } = useTemplates();

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

    createTemplateMutate({
      title: formData.title,
      description: formData.description,
      category: categoryToUse,
    });

    setFormData({
      title: "",
      description: "",
      category: "",
      newCategory: "",
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
                (formData.category === "1" && !formData.newCategory.trim())
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