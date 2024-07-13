"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { runAgent } from "./action";

export default function Page() {
  //   const [input, setInput] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<StreamEvent[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { streamData } = await runAgent(inputValue);
    for await (const item of readStreamableValue(streamData)) {
      setData((prev) => [...prev, item]);
    }
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  
  return (
    <div>
      <label htmlFor="myInput">Enter something:</label>
      <input
        onSubmit={handleSubmit}
        type="text"
        id="myInput"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type here..."
      />
      <p>ans: {data}</p>
    </div>
  );
}
