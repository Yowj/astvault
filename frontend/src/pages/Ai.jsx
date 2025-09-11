import { useState } from "react";
import { supabaseTemplatesAPI } from "../services";
import toast from "react-hot-toast";
import { LoaderIcon, MessageCircle, Send, Copy } from "lucide-react";

const Ai = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const enhanceGrammar = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text to enhance");
      return;
    }

    setIsLoading(true);
    setOutput("");

    try {
      const response = await supabaseTemplatesAPI.grammarEnhance(input);
      const cleanedResponse = cleanResponse(response?.aiResponse);
      setOutput(cleanedResponse);
      toast.success("Grammar enhanced successfully");
    } catch (error) {
      toast.error(error.message || "Grammar enhancement failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enhanceGrammar();
    }
  };

  const cleanResponse = (text) => {
    if (!text) return text;
    return text
      .replace(/\*+/g, "") // Remove all asterisks (* and **)
      .replace(/#/g, "") // Remove hashtags
      .replace(/`/g, ""); // Remove backticks
  };

  const handleCopyResponse = () => {
    if (output) {
      navigator.clipboard.writeText(cleanResponse(output));
      toast.success("Enhanced text copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-base-200 rounded-2xl shadow-lg mt-[5rem]">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="text-primary w-8 h-8" />
          <h1 className="text-3xl font-bold text-primary">Grammar Enhancer</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label">
              <span className="label-text text-secondary pb-2">Enter your original text:</span>
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your text here to enhance grammar..."
                className="textarea textarea-bordered w-full h-32 pr-12"
                disabled={isLoading}
              />
              <button
                onClick={enhanceGrammar}
                disabled={isLoading || !input.trim()}
                className="btn btn-primary btn-circle absolute bottom-2 right-2 btn-sm"
              >
                {isLoading ? (
                  <LoaderIcon className="animate-spin w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={enhanceGrammar}
              disabled={isLoading || !input.trim()}
              className="btn btn-primary flex-1"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="animate-spin w-4 h-4 mr-2" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enhance Grammar
                </>
              )}
            </button>

            {(input || output) && (
              <button
                onClick={() => {
                  setInput("");
                  setOutput("");
                }}
                className="btn btn-outline btn-secondary"
              >
                Clear All
              </button>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label">
                <span className="label-text text-accent">Enhanced Output:</span>
              </label>
              {output && (
                <button
                  onClick={handleCopyResponse}
                  className={`btn btn-primary btn-sm ${
                    output
                      ? "bg-primary animate-pulse scale-110 transition-all duration-500"
                      : "opacity-0"
                  }`}
                  title="Copy enhanced text"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="textarea textarea-bordered w-full h-80 overflow-y-auto bg-base-100 whitespace-pre-wrap">
              {cleanResponse(output) || (
                <span className="text-base-content/50 italic">Your enhanced text will appear here...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ai;