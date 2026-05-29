import React, { useState, memo } from "react";
import { Trash2, PencilLine, Copy, X, LoaderIcon, Pin, PinOff, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteTemplate, useTemplates, useUpdateTemplate } from "../../hooks/useTemplates";
// eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";
import useAuthUser from "../../hooks/useAuthUser";
import { useNavigate } from "react-router";

const NEW_CATEGORY = "__new_category__";

const Template = ({ title, description, id, category, creator_name, isPinned, onPin, onUnpin }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isToggleDelete, setIsToggleDelete] = useState(false);
  const [isToggleEdit, setIsToggleEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  const { authUser } = useAuthUser();

  const [formData, setFormData] = useState({
    title,
    description,
    category,
    newCategory: "",
  });

  const { updateTemplateMutate, updateTemplateIsPending } = useUpdateTemplate();
  const { deleteTemplateMutate, deleteTemplateIsPending } = useDeleteTemplate();
  const { templates, templatesIsPending } = useTemplates();

  React.useEffect(() => {
    if (templates && Array.isArray(templates)) {
      const uniqueCategories = Array.from(new Set(templates.map((t) => t.category)));
      setCategories(uniqueCategories);
    }
  }, [templates]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryToUse =
      formData.category === NEW_CATEGORY ? formData.newCategory : formData.category;
    updateTemplateMutate({
      id,
      title: formData.title,
      description: formData.description,
      category: categoryToUse,
    });
    setIsToggleEdit(false);
  };

  const requireAuth = (action) => {
    if (!authUser) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    action();
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const deleteToggle = () => requireAuth(() => setIsToggleDelete((prev) => !prev));
  const editToggle = () => requireAuth(() => setIsToggleEdit((prev) => !prev));
  const pinToggle = () => requireAuth(() => (isPinned ? onUnpin(id) : onPin(id)));

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(description);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      {/* Card */}
      <div
        className={`rounded-xl bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-base-300 ${
          isPinned ? "border-l-4 border-l-warning" : ""
        }`}
      >
        {/* Card Header — always visible */}
        <div className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-4">
          <button
            onClick={pinToggle}
            className={`shrink-0 p-1 rounded-md transition-colors duration-200 ${
              isPinned
                ? "text-warning hover:text-warning/60"
                : "text-base-content/25 hover:text-warning"
            }`}
            title={isPinned ? "Unpin template" : "Pin template"}
          >
            {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleOpen}
            className="flex-1 flex items-center gap-3 text-left group min-w-0"
          >
            <h3 className="flex-1 text-base sm:text-lg font-semibold text-base-content group-hover:text-primary transition-colors duration-200 break-words min-w-0">
              {title}
            </h3>
            <span className="badge badge-ghost badge-sm text-primary/70 border-primary/20 shrink-0 hidden sm:inline-flex">
              {category}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-base-content/40 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key={id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-base-200 pt-3 space-y-3">
                <p className="text-sm sm:text-base text-base-content/80 leading-relaxed whitespace-pre-wrap break-words">
                  {description}
                </p>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-base-content/50">by {creator_name}</span>
                    <span className="badge badge-ghost badge-sm text-primary/70 border-primary/20 sm:hidden">
                      {category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={editToggle}
                      className="btn btn-ghost btn-xs hover:btn-primary"
                      title="Edit"
                    >
                      <PencilLine className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="btn btn-ghost btn-xs hover:btn-success"
                      title="Copy content"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={deleteToggle}
                      className="btn btn-ghost btn-xs hover:btn-error"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Modal */}
      {isToggleDelete && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={deleteToggle}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-sm p-6 flex flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-error" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-base-content">Delete Template</h2>
              <p className="text-sm text-base-content/70 mt-1 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-medium text-base-content">"{title}"</span>? This cannot be
                undone.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={deleteToggle}
                className="btn btn-outline flex-1"
                disabled={deleteTemplateIsPending}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTemplateMutate(id);
                  setIsToggleDelete(false);
                }}
                className="btn btn-error flex-1"
                disabled={deleteTemplateIsPending}
              >
                {deleteTemplateIsPending ? (
                  <>
                    <LoaderIcon className="animate-spin w-4 h-4" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {isToggleEdit && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={editToggle}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-lg flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <PencilLine className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-base-content">Edit Template</h2>
                  <p className="text-xs text-base-content/50">Update your template</p>
                </div>
              </div>
              <button
                className="p-2 hover:bg-base-200 rounded-lg transition-colors"
                onClick={() => setIsToggleEdit(false)}
                disabled={updateTemplateIsPending}
              >
                <X className="w-4 h-4 text-base-content/60" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:input-primary"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                </label>
                <select
                  name="category"
                  className="select select-bordered w-full focus:select-primary"
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
                  <option value={NEW_CATEGORY}>+ Create new category</option>
                </select>
              </div>

              <AnimatePresence>
                {formData.category === NEW_CATEGORY && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="form-control"
                  >
                    <label className="label">
                      <span className="label-text font-semibold">New Category Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter new category name"
                      className="input input-bordered w-full focus:input-primary"
                      name="newCategory"
                      value={formData.newCategory}
                      onChange={handleChange}
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Content</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-40 sm:h-56 focus:textarea-primary resize-none leading-relaxed"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsToggleEdit(false)}
                  disabled={updateTemplateIsPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary gap-2"
                  disabled={
                    updateTemplateIsPending ||
                    !formData.title.trim() ||
                    !formData.description.trim() ||
                    !formData.category ||
                    (formData.category === NEW_CATEGORY && !formData.newCategory.trim())
                  }
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
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default memo(Template);
