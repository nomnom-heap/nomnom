import Editor from "../_components/Editor";
import { MdFullscreen } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

import CreateActorForm from "../_components/CreateActorForm";
import {Card, CardHeader, CardBody, CardFooter, Image, Input, Button, ButtonGroup} from "@nextui-org/react";

export default function createRecipe(){
    return (
        <div className="container">
            <div className="d-flex justify-content-center">
            <Card >
                <div className="ml-auto">
                    <Button isIconOnly aria-label="Full screen">
                        <MdFullscreen/>
                    </Button>
                    <Button isIconOnly aria-label="Close Screen" color="danger">
                        <RxCross2/>
                    </Button>
                </div>

                <Image
                width={300}
                    src="../images/eggFriedRice.jpg"
                    className="d-flex object-cover rounded-xl justify-content-center mx-auto"/>

                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p><Input type="Dish Name" label="Dish Name" /></p>
                    <p><Input type="Preparation Time" label="Preparation Time" /></p>

                </CardHeader>
                <CardBody>
                    <p className="text-tiny uppercase font-bold">Daily Mix</p>
                    <small className="text-default-500">12 Tracks</small>
                    <p className="text-default-500">12 Tracks</p>
                    <h4 className="font-bold text-large">Frontend Radio</h4>
                    <div>Ingredients
                        <Editor holder="EditorJS"></Editor>
                    </div>
                    
                    <div>
                        <h2>Steps</h2>
                        <Editor holder="EditorJS"></Editor>
                    </div>
                    
                </CardBody>
                <CardFooter>
                    <div className="ml-auto">
                        <Button color="secondary" size="md" >
                        Publish
                        </Button>
                    </div>
                </CardFooter>
            </Card>
            </div>
        </div>
    );
}
