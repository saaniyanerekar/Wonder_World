import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState(1);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("loading...");

    const prompt = `You are a helpful assistant for kids aged 6-15 years. Answer the following ${subject} question in an easy, imaginative, and interactive way also use emojis to make the conversation more joyful:\n\nQuestion: ${question}\n\nAnswer:`;

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDuOf6eXyu_pqTCMa5aH3YcXBe6RrVSxy0",
        method: "post",
        data: {
          contents: [
            { parts: [{ text: prompt }] },
          ],
        },
      });

      const rawAnswer = response.data.candidates[0].content.parts[0].text;
      const processedAnswer = postProcessAnswer(rawAnswer);
      setAnswer(processedAnswer);
    } catch (error) {
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setGeneratingAnswer(false);
    }
  }

  function postProcessAnswer(answer) {
    return answer.replace(/\*\*/g, '');
  }

  function handleNextStep() {
    setStep(step + 1);
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 h-screen p-3 flex flex-col justify-center items-center">
      <h1 className="title">Wonder Worlds</h1>
      {step === 1 && (
        <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-lg bg-white py-6 px-4 transition-all duration-500 transform hover:scale-105">
          <h2 className="subtitle">Welcome, young explorer! 🌟</h2>
          <p>What subject are you curious about today?</p>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className="input-field"
          />
          <button
            onClick={handleNextStep}
            className="button mt-4"
          >
            NEXT
          </button>
        </div>
      )}
      {step === 2 && (
        <form
          onSubmit={generateAnswer}
          className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-lg bg-white py-6 px-4 transition-all duration-500 transform hover:scale-105"
        >
          <textarea
            required
            className="input-field my-4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What's your question?"
          ></textarea>
          <button
            type="submit"
            className={`button ${generatingAnswer ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={generatingAnswer}
          >
            {generatingAnswer ? "Generating..." : "Generate Answer"}
          </button>
        </form>
      )}
      {answer && (
        <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg bg-white my-4 shadow-lg transition-all duration-500 transform hover:scale-105">
          <ReactMarkdown className="answer-container p-4">{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default App;
