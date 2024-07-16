import React, { useState } from 'react';
import { Modal, ModalContent, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import Editor from './BlockNoteEditor'; 

const RecipeForm = ({ initialRecipe, onSave, onClose }) => {
  const [recipeName, setRecipeName] = useState(initialRecipe?.name || '');
  const [preparationSteps, setPreparationSteps] = useState(initialRecipe?.contents || []);

  const handleSave = () => {
    const newRecipe = {
      ...initialRecipe,
      name: recipeName,
      contents: preparationSteps,
    };
    onSave(newRecipe);
    onClose(); 
  };

  return (
    <Modal open onClose={onClose}>
      <ModalContent>
        <ModalBody>
          <Input
            label="Recipe Name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
          <div className="flex flex-col gap-2 w-auto mt-4">
            <p className="text-sm">Preparation Steps:</p>
            <Editor
              initialContent={preparationSteps}
              onChange={setPreparationSteps}
              editable
            />
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-center gap-2">
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button color="success" variant="flat" onPress={handleSave}>
            Save Recipe
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RecipeForm;
