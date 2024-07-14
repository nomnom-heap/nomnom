"use client";

import { Poppins } from "next/font/google";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState, useRef } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import InputComponent from "./InputComponent";
import MessageComponent from "./MessageComponent";
import { RephraseQuestionInput } from "./RephraseQuestion";
import initRephraseChain from "./RephraseQuestion";
import VectorRetriever from "./VectorRetriever";
import {
  Image,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
} from "@nextui-org/react";
// console.log(process.env.OPENAI_API_KEY);
const poppins = Poppins({ weight: ["600"], subsets: ["latin"] });
const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const CREATE_CHAT_SESSION_MUTATION = gql`
  mutation createChatSession($userId: ID!) {
    createChatSessions(
      input: { owner: { connect: { where: { node: { id: $userId } } } } }
    ) {
      chatSessions {
        id
      }
    }
  }
`;

// const CREATE_MESSAGE_MUTATION = gql`
//   mutation createMessage($content: String!, $sessionId: ID!) {
//     createChatMessages(
//       input: { session: { connect: { where: { node: { id: $sessionId } } } } }
//     ) {
//       chatMessages {
//         content
//       }
//     }
//   }
// `;

const CREATE_CHAT_MESSAGE_MUTATION = gql`
  mutation CreateChatMessage(
    $content: String!
    $sessionId: ID!
    $isOwnerHuman: Boolean!
  ) {
    createChatMessage(
      content: $content
      sessionId: $sessionId
      isOwnerHuman: $isOwnerHuman
    ) {
      id
      content
      createdAt
      isOwnerHuman
    }
  }
`;

const GET_MESSAGES_BY_SESSION = gql`
  query GetMessagesBySession($sessionId: ID!) {
    messagesBySession(sessionId: $sessionId) {
      id
      content
      createdAt
      isOwnerHuman
    }
  }
`;

const GET_CHAT_HISTORY_BY_SESSION = gql`
  query GetChatHistory($sessionId: ID!) {
    getChatHistory(sessionId: $sessionId) {
      id
      content
      createdAt
    }
  }
`;

export default function Page() {
  const [chatMessage, setChatMessage] = useState("");
  const [sessionId, setSessionId] = useState("unset");
  const [messageData, setMessageData] = useState("");
  const [chatbotProcessing, setChatbotProcessing] = useState(false);
  const [chatbotResponse, setChatbotResponse] = useState("");
  const chatMessageRef = useRef("");
  // const [chatHistory, setChatHistory] = useState("");

  const [
    createChatSession,
    {
      data: ChatSessionData,
      loading: ChatSessionLoading,
      error: ChatSessionError,
    },
  ] = useMutation(CREATE_CHAT_SESSION_MUTATION);

  const [
    createMessage,
    { data: MessageData, loading: MessageLoading, error: MessageError },
  ] = useMutation(CREATE_CHAT_MESSAGE_MUTATION);

  const [
    getMessagesBySession,
    {
      data: getMessagesData,
      loading: getMessagesLoading,
      error: getMessagesError,
    },
  ] = useLazyQuery(GET_MESSAGES_BY_SESSION, { fetchPolicy: "network-only" });

  const [
    getChatHistoryBySession,
    {
      data: chatHistoryData,
      loading: chatHistoryLoading,
      error: chatHistoryError,
    },
  ] = useLazyQuery(GET_CHAT_HISTORY_BY_SESSION, {
    fetchPolicy: "network-only",
  });

  async function handleSubmitMessage(chatMessage) {
    // console.log(chatMessage);
    chatMessageRef.current = chatMessage;
    setChatMessage("");
    if (chatbotResponse) {
      await createMessage({
        variables: {
          sessionId: sessionId,
          content: chatbotResponse,
          isOwnerHuman: false,
        },
      });
    }

    console.log(sessionId);
    setChatbotProcessing(true);
    setChatbotResponse("");

    await createMessage({
      variables: {
        content: chatMessage,
        sessionId: sessionId,
        isOwnerHuman: true,
      },
    });

    await getMessagesBySession({
      variables: {
        sessionId: sessionId,
      },
    });

    await getChatHistoryBySession({
      variables: {
        sessionId: sessionId,
      },
    });
    // console.log(chatMessage);
  }

  useEffect(() => {
    if (chatHistoryData) {
      // setChatHistory(chatHistoryData.getChatHistory);
      async function rephraseAnswer() {
        const chatMessagePassed = chatMessageRef.current;
        console.log(chatMessagePassed);
        const rephraseAnswerChain = initRephraseChain(llm);

        const output = await rephraseAnswerChain.invoke({
          input: chatMessage,
          history: chatHistoryData.getChatHistory,
        });

        return output;
      }

      console.log(JSON.stringify(chatHistoryData));

      rephraseAnswer()
        .then((output) => {
          console.log(output);
          console.log("Passing rephrased question to vector retriever");
          // console.log(
          //   "API Key for VectorRetriever:",
          //   process.env.NEXT_PUBLIC_OPENAI_API_KEY
          // );

          VectorRetriever(output, process.env.NEXT_PUBLIC_OPENAI_API_KEY)
            .then((finalAnswerStream) => {
              async function handleStream() {
                for await (const chunk of finalAnswerStream) {
                  setChatbotResponse(
                    (previousResponse) => previousResponse + chunk
                  );
                }
                setChatbotProcessing(false);
              }
              handleStream();
              // console.log(chatbotResponse);
            })
            .catch((error) => {
              console.error("error in vector retriever", error);
            });
          // setRephrasedAnswer(output); // Update state with the rephrased answer
        })
        .catch((error) => {
          console.error("Error in rephraseAnswer:", error);
        });
    }
  }, [chatHistoryData]);

  // useEffect(() => {
  //   console.log(chatbotResponse);
  // }, [chatbotResponse]);

  useEffect(() => {
    const createSession = async () => {
      try {
        const session = await fetchAuthSession();
        const userId = session?.tokens?.accessToken.payload.sub;
        console.log("test");
        await createChatSession({
          variables: {
            userId: userId,
          },
        });
      } catch (error) {
        console.error(error.message);
        console.error("Error creating chat session:", error);
      }
    };

    createSession();
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  useEffect(() => {
    if (ChatSessionData) {
      setSessionId(ChatSessionData.createChatSessions.chatSessions[0].id);
    }
  }, [ChatSessionData]);

  useEffect(() => {
    if (getMessagesData) {
      // console.log(JSON.stringify(getMessagesData));
      setMessageData(getMessagesData.messagesBySession);
    }
  }, [getMessagesData]);

  return (
    <div className="overflow-hidden">
      <div className="bg-white h-96 overflow-x-hidden overflow-auto md:py-0 items-center">
        <Card className="items-center md:mx-80 md:my-10" shadow="none">
          <CardHeader className="justify-center">
            <div className="flex flex-col">
              <h4
                className={`${poppins.className} text-4xl font-bold pt-10 px-10 pb-5`}
              >
                Chat with Nombot 😋
              </h4>
              <p>
                Nombot is a friendly chatbot that can help you find the perfect
                recipe!
              </p>
            </div>
          </CardHeader>

          <CardBody>
            <div className="flex flex-nowrap space-x-2 justify-center">
              <Button
                className="bg-slate-500 text-white"
                size="sm"
                onPress={() =>
                  setChatMessage("Any healthy recipes to recommend?")
                }
              >
                Any healthy recipes to recommend?
              </Button>
              <Button
                className="bg-slate-500 text-white"
                size="sm"
                onPress={() =>
                  setChatMessage("Any food I can cook for a family?")
                }
              >
                Any food I can cook for a family?
              </Button>
              <Button
                className="bg-slate-500 text-white"
                size="sm"
                onPress={() => setChatMessage("Any protein-rich recipes?")}
              >
                Any protein-rich recipes?
              </Button>
            </div>
          </CardBody>
        </Card>

        {messageData
          ? messageData.map((message) => (
              <MessageComponent
                key={message.id}
                content={message.content}
                identity={message.isOwnerHuman}
              />
            ))
          : ""}

        {chatbotResponse ? (
          <MessageComponent
            key={"ChatbotResponse"}
            content={chatbotResponse}
            identity={false}
          />
        ) : (
          ""
        )}
      </div>

      <div className="md:px-40 md:py-20 h-20 bottom-0">
        <InputComponent
          setChatMessage={setChatMessage}
          handleSubmit={handleSubmitMessage}
          chatMessage={chatMessage}
          chatbotProcessing={chatbotProcessing}
        />
      </div>
    </div>
  );
}
