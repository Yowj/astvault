
// eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";
import Template from "./Template";
import LoadingSpinner from "../ui/LoadingSpinner";

const TemplatesContainer = ({
  templates,
  isLoading,
  searchTerm = "",
  selectedCategory = "",
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Loading templates..." />;
  }

  if (!templates) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-error">Failed to load templates. Please try again.</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-12"
      >
        <p className="text-gray-500">
          {searchTerm || selectedCategory
            ? "No templates found. Try searching for another keyword or category."
            : "No templates available yet."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden space-y-3">
      <AnimatePresence mode="popLayout">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="w-full min-w-0"
          >
            <Template
              id={template.id}
              title={template.title}
              description={template.description}
              category={template.category}
              creator_name={template.creator_name}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesContainer;