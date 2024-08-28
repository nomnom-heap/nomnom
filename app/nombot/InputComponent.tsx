import { Textarea, Button, Spinner } from "@nextui-org/react";

export default function InputComponent({
  // @ts-ignore
  setChatMessage,
  // @ts-ignore
  handleSubmit,
  // @ts-ignore
  chatMessage,
  // @ts-ignore
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
          color="primary"
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
