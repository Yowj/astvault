import React, { useState, memo } from "react";
import { Trash2, PencilLine, Copy, X, LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteTemplate, useTemplates, useUpdateTemplate } from "../../hooks/useTemplates";
// eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";

const Template = ({ title, description, id, category, creator_name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToggleDelete, setIsToggleDelete] = useState(false);
  const [isToggleEdit, setIsToggleEdit] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: title,
    description: description,
    category: category,
    newCategory: "",
  });

  const { updateTemplateMutate, updateTemplateIsPending } = useUpdateTemplate();
  const { deleteTemplateMutate, deleteTemplateIsPending } = useDeleteTemplate();

  const { templates, templatesIsPending } = useTemplates();

  React.useEffect(() => {
    if (templates && Array.isArray(templates)) {
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
    const categoryToUse = formData.newCategory || formData.category;

    updateTemplateMutate({
      id,
      title: formData.title,
      description: formData.description,
      category: categoryToUse,
    });

    editToggle();
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const deleteToggle = () => {
    setIsToggleDelete(!isToggleDelete);
  };

  const editToggle = () => {
    setIsToggleEdit(!isToggleEdit);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="border-b border-primary/20 py-2 sm:py-3 relative w-full min-w-0">
      <button
        onClick={toggleOpen}
        className="flex justify-between items-start w-full text-left group min-h-0 min-w-0"
      >
        <h3 className="text-base sm:text-lg lg:text-xl font-medium text-primary break-words flex-1 group-hover:text-primary/80 transition-colors duration-200 pr-2 sm:pr-4 leading-snug min-w-0">
          {title}
        </h3>
        <span
          className={`transform transition-transform duration-200 text-primary/60 shrink-0 mt-1 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="mt-2 sm:mt-3 w-full min-w-0"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 w-full min-w-0">
              <p
                className="text-secondary cursor-pointer hover:text-accent break-words flex-1 transition-colors duration-200 leading-relaxed text-xs sm:text-sm lg:text-base overflow-hidden order-2 sm:order-1 min-w-0 max-w-full"
                onClick={() => copyToClipboard(description)}
                title="Click to copy"
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {description}
              </p>

              <div className="flex gap-1 sm:gap-2 flex-shrink-0 order-1 sm:order-2 justify-end max-w-fit">
                <button
                  onClick={() => editToggle()}
                  className="btn btn-ghost btn-xs hover:btn-primary p-1 sm:p-2 flex-shrink-0"
                  title="Edit"
                >
                  <PencilLine className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(description)}
                  className="btn btn-ghost btn-xs hover:btn-success p-1 sm:p-2 flex-shrink-0"
                  title="Copy"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => deleteToggle()}
                  className="btn btn-ghost btn-xs hover:btn-error p-1 sm:p-2 flex-shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs text-base-content/60 mt-2">Added by: {creator_name}</div>
          </motion.div>
        </AnimatePresence>
      )}

      {isToggleDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 border border-base-300 p-3 sm:p-4 lg:p-6 rounded-xl shadow-2xl relative w-full bg-base-100 max-w-xs sm:max-w-sm lg:max-w-md items-center">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-base-content mb-2">
                Delete Template
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-base-content/70 leading-relaxed">
                Are you sure you want to delete this template? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full">
              <button
                onClick={deleteToggle}
                className="btn btn-outline btn-xs sm:btn-sm lg:btn-md flex-1 text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTemplateMutate(id);
                  setIsToggleDelete(false);
                }}
                className="btn btn-error btn-xs sm:btn-sm lg:btn-md flex-1 text-xs sm:text-sm"
                disabled={deleteTemplateIsPending}
              >
                {deleteTemplateIsPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isToggleEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md lg:max-w-lg xl:max-w-xl relative overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6 border-b border-base-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <PencilLine className="w-5 h-5 text-primary-content" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-base-content">Edit Template</h2>
                    <p className="text-sm text-base-content/70 mt-0.5">
                      Update your template information
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-base-300 rounded-lg transition-colors duration-200"
                  onClick={editToggle}
                  aria-label="Close"
                  disabled={updateTemplateIsPending}
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
                    <span className="label-text font-semibold text-base-content">Title</span>
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
                    <span className="label-text font-semibold text-base-content">Category</span>
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
                    <span className="label-text font-semibold text-base-content">Content</span>
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
                  onClick={editToggle}
                  disabled={updateTemplateIsPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={
                    updateTemplateIsPending ||
                    !formData.title.trim() ||
                    !formData.description.trim() ||
                    !formData.category ||
                    (formData.category === "1" && !formData.newCategory.trim())
                  }
                  onClick={handleSubmit}
                >
                  {updateTemplateIsPending ? (
                    <>
                      <LoaderIcon className="animate-spin w-4 h-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <PencilLine className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Badge */}
      <div className="absolute right-0 bottom-0.5 sm:bottom-1 text-xs text-primary/70 hover:text-primary transition-colors duration-200 truncate max-w-20 sm:max-w-32">
        {category}
      </div>
    </div>
  );
};

export default memo(Template);
