import { Textarea, Button, Spinner } from "@nextui-org/react";

export default function InputComponent({
  setChatMessage,
  handleSubmit,
  chatMessage,
  chatbotProcessing,
}) {
  return (
    <div className="flex items-end bg-white space-x-3">
      <Textarea
        value={chatMessage}
        minRows={1}
        maxRows={2}
        // size="lg"
        isRequired
        label="Ask Nombot!"
        variant="underlined"
        placeholder="Enter your question"
        onValueChange={(message) => {
          setChatMessage(message);
        }}
      />

      {chatbotProcessing ? (
        <Spinner size="md" />
      ) : (
        <Button
          color="secondary"
          onPress={() => {
            handleSubmit(chatMessage);
          }}
          type="button"
        >
          Submit
        </Button>
      )}
    </div>
  );
}
