import {
  Card,
  CardBody,
  Image,
  Button,
  Slider,
  Avatar,
} from "@nextui-org/react";

export default function MessageComponent({ content }) {
  return (
    <div className="bg-slate-500">
      <Card className="shadow-none border-none bg-slate-500 p-5 rounded-none md:px-40">
        <CardBody className="justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              color="default"
              src="https://static-00.iconduck.com/assets.00/face-savouring-delicious-food-emoji-512x512-q6dd9m3y.png"
            />
            <div className="items-end">
              <h4 className="text-white text-lg">{content}</h4>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
