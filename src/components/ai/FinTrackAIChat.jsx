import { useState } from "react";
import axios from "axios";
import { Send, Trash2, Mic } from "lucide-react";
import { Sparkles } from "lucide-react";
export default function FinTrackAIChat({
  totalIncome,
  totalExpense,
  savings,
  topCategory,
  topCategoryAmount,
}) {

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [listening, setListening] = useState(false);

  function clearChat() {
    setQuestion("");
    setResponse("");
    setDisplayedResponse("");
  }

  function cleanAIResponse(text) {

    let cleanResponse = text || "";

    cleanResponse = cleanResponse
      .replace(/^ello\b/i, "Hello")
      .replace(/^ello!/i, "Hello!")
      .replace(/^i'm\b/i, "I'm")
      .replace(/^ow\b/i, "How")
      .replace("undefined", "")
      .trim();

    if (
      cleanResponse.length > 0 &&
      cleanResponse[0] === cleanResponse[0].toLowerCase()
    ) {
      cleanResponse =
        cleanResponse.charAt(0).toUpperCase() +
        cleanResponse.slice(1);
    }

    return cleanResponse;
  }

  function typeResponse(text) {

    if (!text) return;

    setDisplayedResponse("");

    let index = 0;

    const interval = setInterval(() => {

      if (index < text.length) {

        const currentChar =
          text.charAt(index);

        setDisplayedResponse((prev) =>
          prev + currentChar
        );

        index++;

      } else {

        clearInterval(interval);
      }

    }, 15);
  }

  async function processAI(questionText) {

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/ai/chat",
        {
          question: questionText,
          income: totalIncome,
expenses: totalExpense,
savings: savings,
          topCategory: topCategory,
topCategoryAmount: topCategoryAmount,
        }
      );

      const cleanResponse =
        cleanAIResponse(res.data);

      setResponse(cleanResponse);

      typeResponse(cleanResponse);

    } catch (err) {

      setResponse("AI service unavailable.");

      setDisplayedResponse(
        "AI service unavailable."
      );

    } finally {

      setLoading(false);
    }
  }

  function startListening() {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Speech Recognition not supported in this browser"
      );

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.start();

    recognition.onstart = () => {
      console.log("Voice recognition started");
    };

    recognition.onresult = async (event) => {

      const transcript =
        event.results[0][0].transcript;

      setQuestion(transcript);

      await processAI(transcript);
    };

    recognition.onerror = (event) => {

      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);
    };

    recognition.onend = () => {

      console.log("Voice recognition ended");

      setListening(false);
    };
  }

  async function askAI() {

    if (!question.trim()) return;

    await processAI(question);

    setQuestion("");
  }

  return (

    <div
      className="
        relative overflow-hidden rounded-3xl
        border border-cyan-400/10
        bg-white/5
        backdrop-blur-2xl
        p-6 shadow-2xl
      "
    >

      {/* Glow Effects */}
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />

      <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl animate-pulse" />

      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

         <div
  className="
    relative flex h-14 w-14 items-center justify-center
    rounded-2xl
    border border-cyan-400/20
    bg-gradient-to-br
    from-cyan-500/20
    to-violet-500/20
    backdrop-blur-xl
    shadow-lg shadow-cyan-500/20
  "
>
  <div className="absolute inset-0 rounded-2xl bg-white/5" />

  <Sparkles
    size={28}
    className="relative text-cyan-300"
  />
</div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                FinTrack AI
              </h2>

              <p className="text-sm text-white/60">
                Your smart financial assistant
              </p>

            </div>

          </div>

          {response && (

            <button
              onClick={clearChat}
              className="
                flex items-center gap-2
                rounded-2xl border border-white/10
                bg-white/5 px-4 py-3
                text-sm text-white/70
                transition-all hover:bg-white/10
                hover:text-white
              "
            >
              <Trash2 size={16} />
              Clear
            </button>

          )}

        </div>

        {/* Input */}
        <div className="mt-6 flex gap-3">

          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask about savings, expenses, investments..."
            className="
              flex-1 rounded-2xl
              border border-white/10
              bg-black/20 px-5 py-4
              text-white placeholder:text-white/40
              outline-none transition-all
              focus:border-cyan-400
              focus:ring-2 focus:ring-cyan-400/20
            "
          />

          {/* Mic Button */}
          <button
            onClick={startListening}
            className={`
              rounded-2xl border px-4 py-4
              transition-all duration-300

              ${
                listening
                  ? "border-red-400 bg-red-500/20 text-red-300 animate-pulse"
                  : "border-white/10 bg-white/5 text-cyan-300 hover:bg-white/10"
              }
            `}
          >
            <Mic size={20} />
          </button>

          {/* Ask AI */}
          <button
            onClick={askAI}
            disabled={loading}
            className="
              flex items-center gap-2
              rounded-2xl bg-gradient-to-r
              from-cyan-500 to-blue-500
              px-6 py-4 font-semibold text-white
              shadow-lg transition-all
              hover:scale-105
              hover:shadow-cyan-500/20
              active:scale-95
              disabled:opacity-60
            "
          >
            <Send size={18} />

            {loading ? "Thinking..." : "Ask AI"}

          </button>

        </div>

        {/* AI Response */}
        {response && (

          <div
            className="
              mt-6 rounded-3xl
              border border-white/10
              bg-black/20 p-6
              text-[15px] leading-8 text-white/90
              whitespace-pre-line
              shadow-inner
              max-h-[500px]
              overflow-y-auto
            "
          >

            <div className="mb-4 flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />

              <p className="text-sm font-medium text-cyan-300">
                FinTrack AI Response
              </p>

            </div>

            <div className="space-y-3">
              {displayedResponse}
            </div>

          </div>

        )}

      </div>

    </div>
  );
}