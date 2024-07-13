import {
  Card,
  CardBody,
  Image,
  Button,
  Slider,
  Avatar,
  CardHeader,
} from "@nextui-org/react";

export default function MessageComponent({ content, identity }) {
  return (
    <>
      {identity ? (
        <div className="bg-white">
          <Card className="shadow-none border-none bg-white p-5 rounded-none md:px-40">
            <CardHeader className="flex gap-3">
              <Avatar isBordered color="default" src="./DefaultAvatar.jpg" />
              <h4>Username</h4>
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
            <CardHeader className="flex gap-3">
              <Avatar
                isBordered
                color="default"
                src="https://static-00.iconduck.com/assets.00/face-savouring-delicious-food-emoji-512x512-q6dd9m3y.png"
              />
              <h4 className="text-white">NOMNOM</h4>
            </CardHeader>
            <CardBody className="justify-between">
              <div className="flex gap-5">
                <div className="text-white">{content}</div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </>
    // <div className="bg-slate-500">
    //   <Card className="shadow-none border-none bg-slate-500 p-5 rounded-none md:px-40">
    //     <CardHeader className="flex gap-3">
    //       {identity ? (
    //         <h4>User</h4>
    //       ) : (
    //         <>
    //           <Avatar
    //             isBordered
    //             color="default"
    //             src="https://static-00.iconduck.com/assets.00/face-savouring-delicious-food-emoji-512x512-q6dd9m3y.png"
    //           />
    //           <h4>NOMNOM</h4>
    //         </>
    //       )}
    //     </CardHeader>
    //     <CardBody className="justify-between">
    //       <div className="flex gap-5">
    //         {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
    //         <div className="text-white">{content}</div>
    //       </div>
    //     </CardBody>
    //   </Card>
    // </div>
  );
}
