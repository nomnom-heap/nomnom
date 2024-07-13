// "use client";
import Chatbot from "./Chatbot";
export default function Page() {
  // console.log(process.env.OPENAI_API_KEY);
  return (
    <>
      <Chatbot />
      <h1>Test Chatbot</h1>
      <p>{process.env.OPENAI_API_KEY}</p>
    </>
  );
}
