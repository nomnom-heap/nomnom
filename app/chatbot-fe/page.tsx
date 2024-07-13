"use client";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import InputComponent from "./InputComponent";
import MessageComponent from "./MessageComponent";
import { RephraseQuestionInput } from "./RephraseQuestion";
import initRephraseChain from "./RephraseQuestion";
// console.log(process.env.OPENAI_API_KEY);
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
  mutation CreateChatMessage($content: String!, $sessionId: ID!) {
    createChatMessage(content: $content, sessionId: $sessionId) {
      id
      content
      createdAt
    }
  }
`;

const GET_MESSAGES_BY_SESSION = gql`
  query GetMessagesBySession($sessionId: ID!) {
    messagesBySession(sessionId: $sessionId) {
      id
      content
      createdAt
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
  const [chatMessage, setChatMessage] = useState("test");
  const [sessionId, setSessionId] = useState("unset");
  const [messageData, setMessageData] = useState("");
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
    console.log(sessionId);
    await createMessage({
      variables: {
        content: chatMessage,
        sessionId: sessionId,
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
          // setRephrasedAnswer(output); // Update state with the rephrased answer
        })
        .catch((error) => {
          console.error("Error in rephraseAnswer:", error);
        });
    }
  }, [chatHistoryData]);

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
      <div className="bg-white h-96 space-y-10 overflow-x-hidden overflow-auto md:py-20">
        {messageData
          ? messageData.map((message) => (
              <MessageComponent key={message.id} content={message.content} />
            ))
          : ""}
      </div>

      <div className="md:px-40 md:py-20 h-20">
        <InputComponent
          setChatMessage={setChatMessage}
          handleSubmit={handleSubmitMessage}
          chatMessage={chatMessage}
        />
      </div>
    </div>
  );
}

export function ChatHistory() {}
