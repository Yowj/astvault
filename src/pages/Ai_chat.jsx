import { useState } from "react";
import { supabaseTemplatesAPI } from "../services";
import toast from "react-hot-toast";
import { LoaderIcon, MessageCircle, Send, Copy } from "lucide-react";

export default function AiChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

 

  const handleAskAi = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await supabaseTemplatesAPI.askAI(question);
      const cleanedResponse = cleanResponse(response?.aiResponse);
      setAnswer(cleanedResponse);
      toast.success("AI response received");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskAi();  
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
    if (answer) {
      navigator.clipboard.writeText(cleanResponse(answer));
      toast.success("Response copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-base-200 rounded-2xl shadow-lg mt-[5rem]">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="text-primary w-8 h-8" />
          <h1 className="text-3xl font-bold text-primary">AI Chat Assistant</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label">
              <span className="label-text text-secondary pb-2">Ask your question:</span>
            </label>
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question here..."
                className="textarea textarea-bordered w-full h-32 pr-12"
                disabled={loading}
              />
              <button
                onClick={handleAskAi}
                disabled={loading || !question.trim()}
                className="btn btn-primary btn-circle absolute bottom-2 right-2 btn-sm"
              >
                {loading ? (
                  <LoaderIcon className="animate-spin w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAskAi}
              disabled={loading || !question.trim()}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <>
                  <LoaderIcon className="animate-spin w-4 h-4 mr-2" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Ask AI
                </>
              )}
            </button>

            {(question || answer) && (
              <button
                onClick={() => {
                  setQuestion("");
                  setAnswer("");
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
                <span className="label-text text-accent">AI Response:</span>
              </label>
              {answer && (
                <button
                  onClick={handleCopyResponse}
                  className={`btn btn-primary btn-sm ${
                    answer
                      ? "bg-primary animate-pulse scale-110 transition-all duration-500"
                      : "opacity-0"
                  }`}
                  title="Copy response"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="textarea textarea-bordered w-full h-80 overflow-y-auto bg-base-100 whitespace-pre-wrap">
              {cleanResponse(answer) || (
                <span className="text-base-content/50 italic">AI response will appear here...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
