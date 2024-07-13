import { Textarea, Button } from "@nextui-org/react";

export default function InputComponent({
  setChatMessage,
  handleSubmit,
  chatMessage,
}) {
  return (
    <div className="flex items-end bg-white">
      <Textarea
        minRows={1}
        maxRows={3}
        // size="lg"
        isRequired
        label="Ask NOMNOM!"
        variant="underlined"
        placeholder="Enter your question"
        onValueChange={(message) => {
          setChatMessage(message);
        }}
      />
      <Button
        color="secondary"
        onPress={() => {
          handleSubmit(chatMessage);
        }}
      >
        Submit
      </Button>
    </div>
  );
}
