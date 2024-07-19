"use client";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button,Input } from '@nextui-org/react';
import { FaPlus } from "react-icons/fa";
import { IoRemoveOutline } from "react-icons/io5";


export function AddIngredient() {
  // State to store the list of inputs
  const [ingredients, setIngredients] = useState<Ingredient[]>([{id:1}]);

  // Function to handle adding a new input
  const AddIngredientHandler = () => {
    setIngredients([...ingredients, {id: ingredients.length+1}]); // Add a new empty string to the inputs array
  };

  const RemoveIngredientHandler = (idx:number) =>{
    if(ingredients.length!=1){
      setIngredients(ingredients=>ingredients.filter((_,key)=>key!==idx));
    }
 };

  // Function to handle change in input value
  // const handleInputChange = (index, event) => {
  //   const values = [...inputs];
  //   values[index] = event.target.value;
  //   setInputs(values);
  // };

  return (
    <div>
      {ingredients.map((ingredient, index)=>(
        <div key={ingredient.id} className="flex mb-2 max-w-lg justify-content-center mx-auto">
          <Input type="Ingredient" placeholder="Enter an ingredient"/>
          <Input type="Quantity" placeholder="Enter the quantity"/>
          <Button isIconOnly aria-label="Add Ingredient" onClick={AddIngredientHandler}>
            <FaPlus/>
          </Button>
          <Button isIconOnly aria-label="Remove Ingredient" onClick={()=>RemoveIngredientHandler(index)}>
            <IoRemoveOutline/>
          </Button>
        </div>
    ))}
    </div>
    

  );
}

type Ingredient={
  id:number,
quantity?: string,
ingredientName?: string}
