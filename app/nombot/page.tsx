"use client";

import { Poppins } from "next/font/google";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState, useRef } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import InputComponent from "./InputComponent";
import MessageComponent from "./MessageComponent";
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
import { useClassicEffect } from "./useClassicEffect";

const poppins = Poppins({ weight: ["600"], subsets: ["latin"] });

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
      isOwnerHuman
    }
  }
`;

export default function Page() {
  const [chatMessage, setChatMessage] = useState("");
  const [sessionId, setSessionId] = useState("unset");
  const [messageData, setMessageData] = useState("");
  const [chatbotProcessing, setChatbotProcessing] = useState(false);
  const [chatbotResponse, setChatbotResponse] = useState("");
  // const hasEffectRan = useRef(false);
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

    // console.log(sessionId);
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
      async function rephraseAnswer() {
        const chatMessagePassed = chatMessageRef.current;
        console.log(chatMessagePassed);
        const response = await fetch("/api/rephraseAnswer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: chatMessagePassed,
            history: chatHistoryData.getChatHistory,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          return data.output;
        } else {
          throw new Error(data.error);
        }
      }

      const history = chatHistoryData.getChatHistory;

      rephraseAnswer()
        .then((output) => {
          console.log(output);
          console.log("Passing rephrased question to vector retriever");

          fetch("/api/vectorRetriever", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: output,
              chatHistory: history,
            }),
          })
            .then(async (response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }

              const reader = response.body.getReader();
              const decoder = new TextDecoder("utf-8");
              let result = "";

              const processStream = async () => {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  result += decoder.decode(value, { stream: true });
                  setChatbotResponse(
                    (previousResponse) =>
                      previousResponse + decoder.decode(value, { stream: true })
                  );
                  setChatbotProcessing(false);
                }
              };
              await processStream();
              return result;
            })
            .then((data) => {})
            .catch((error) => {
              console.error("Error in vector retriever", error);
            });
        })
        .catch((error) => {
          console.error("Error in rephraseAnswer:", error);
        });
    }
  }, [chatHistoryData]);
  //custom hook to avoid react strict mode for Effect
  useClassicEffect(() => {
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

    return () => {
      createSession();
    };
  }, []); // Usage of this custom hook due to how React calls effects with empty dependencies twice in strict mode

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
      <div className="bg-white max-sm:static overflow-x-hidden overflow-auto border-0 pt-0 pb-[1rem] px-0 items-center m-0 md:h-96 lg:h-[30rem]">
        <Card className="items-center md:mx-80 md:my-10" shadow="none">
          <CardHeader className="justify-center">
            <div className="flex flex-col">
              <h4
                className={`${poppins.className} text-4xl font-bold pt-10 px-10 pb-5 text-center`}
              >
                Chat with Nombot 😋
              </h4>
              <p className="text-center">
                Nombot is a friendly chatbot that can help you find the perfect
                recipe!
              </p>
            </div>
          </CardHeader>

          <CardBody>
            <div className="flex space-x-2 max-sm:space-y-2 max-sm:flex-col max-sm:items-center md:flex-nowrap md:justify-center">
              {/* <div className="flex flex-nowrap space-x-2 justify-center"> */}
              <Button
                className="bg-slate-500 text-white"
                size="sm"
                onPress={() =>
                  setChatMessage("Any ideas what I can make with leftovers?")
                }
              >
                Any ideas what I can make with leftovers?
              </Button>
              <Button
                className="bg-slate-500 text-white"
                size="sm"
                onPress={() => setChatMessage("Any breakfast ideas?")}
              >
                Any breakfast ideas?
              </Button>
              <Button
                className="bg-slate-500 text-white"
                size="sm"
                onPress={() => setChatMessage("Any vitamin-rich recipes?")}
              >
                Any vitamin-rich recipes?
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

      <div className="inset-x-0 px-2 pt-2 md:px-40 md:pb-16 md:pt-5 md:absolute md:bottom-6 h-20 ">
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
