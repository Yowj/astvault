
import { Plus } from "lucide-react";

const CreateButton = ({ 
  onClick, 
  size = "md", 
  mobile = false, 
  floating = false 
}) => {
  if (floating) {
    return (
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          className="btn btn-secondary btn-circle w-16 h-16 shadow-2xl hover:scale-110 transition-all duration-300 group"
          onClick={onClick}
          aria-label="Create new template"
        >
          <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    );
  }

  if (mobile) {
    return (
      <button
        className={`btn btn-secondary ${size} gap-2 flex-1`}
        onClick={onClick}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden xs:inline">Create</span>
        <span className="xs:hidden">+</span>
      </button>
    );
  }

  return (
    <button
      className="btn btn-secondary w-full gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
      onClick={onClick}
    >
      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
      Create New Template
    </button>
  );
};

export default CreateButton;