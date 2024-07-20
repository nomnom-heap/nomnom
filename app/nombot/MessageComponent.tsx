import {
  Card,
  CardBody,
  Image,
  Button,
  Slider,
  Avatar,
  CardHeader,
} from "@nextui-org/react";
import { useAuth } from "../AuthProvider";
import { gql, useQuery } from "@apollo/client";

const GET_DISPLAY_NAME_QUERY = gql`
  query MyQuery($userId: ID!) {
    users(where: { id: $userId }) {
      display_name
    }
  }
`;
// @ts-ignore
export default function MessageComponent({ content, identity }) {
  const { userId } = useAuth();
  const { data, loading, error } = useQuery(GET_DISPLAY_NAME_QUERY, {
    variables: { userId: userId },
  });

  return (
    <>
      {identity ? (
        <div className="bg-white">
          <Card className="shadow-none border-none bg-white p-5 rounded-none md:px-40">
            <CardHeader className="flex gap-4">
              <Avatar isBordered color="default" src="" showFallback />
              <h4>{data ? data.users[0].display_name : "User"}</h4>
            </CardHeader>
            <CardBody className="justify-between">
              <div className="flex gap-5">
                <div className="text-black">{content}</div>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="bg-slate-500">
          <Card className="shadow-none border-none bg-slate-500 p-5 rounded-none md:px-40">
            <CardHeader className="flex gap-4">
              <Avatar
                isBordered
                color="default"
                src="https://static-00.iconduck.com/assets.00/face-savouring-delicious-food-emoji-512x512-q6dd9m3y.png"
              />
              <h4 className="text-white">NomBot</h4>
            </CardHeader>
            <CardBody className="justify-between">
              <div
                className="text-white px-5 py-2"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
