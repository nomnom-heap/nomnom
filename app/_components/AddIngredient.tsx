import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function AddIngredient() {
  // State to store the list of inputs
  const [ingredients, setIngredients] = useState([]);

  // Function to handle adding a new input
  const addInput = () => {
    setInputs([...inputs, '']); // Add a new empty string to the inputs array
  };

  // Function to handle change in input value
  const handleInputChange = (index, event) => {
    const values = [...inputs];
    values[index] = event.target.value;
    setInputs(values);
  };

  return (
    <div>
      <h1>Dynamic Input Fields</h1>
      <button onClick={addInput}>Add Input</button>
      {inputs.map((input, index) => (
        <div key={index}>
          <input
            type="text"
            value={input}
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
