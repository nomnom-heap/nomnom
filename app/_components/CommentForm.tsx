import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button} from "@nextui-org/react";
import { useState } from "react";

interface CommentProps {
  username: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  likesCount: number;
  onLike: () => void;
}

export function CommentCard({
  username,
  avatarUrl,
  content,
  createdAt,
  likesCount,
  onLike,
}: CommentProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike();
  };

  return (
    <Card className="max-w-[340px] my-2">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src={avatarUrl} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{username}</h4>
            <h5 className="text-small tracking-tight text-default-400">{new Date(createdAt).toLocaleString()}</h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{content}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <Button onPress={handleLike}>
          {isLiked ? "Unlike" : "Like"} ({likesCount})
        </Button>
      </CardFooter>
    </Card>
  );
}