import Editor from "../_components/Editor";
import { MdFullscreen } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";

import {Card, CardHeader, CardBody, CardFooter, Image, Input, Button, ButtonGroup} from "@nextui-org/react";

export default function createRecipe(){
    return (
        <div className="md:container flex items-center justify-center">
            <Card className="">
                <div className="ml-auto">
                    <Button isIconOnly aria-label="Full screen">
                        <MdFullscreen/>
                    </Button>
                    <Button isIconOnly aria-label="Close Screen" color="danger">
                        <RxCross2/>
                    </Button>
                </div>

                <div className="justify-center items-center">
                    <p><input type="file" className="my-3"/></p>
                    <Image
                        width={350}
                        src="./images/eggFriedRice.jpg"
                        className="d-flex object-cover rounded-xl justify-content-center mx-auto"/>
                </div>
                
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center">
                        <p><Input type="Dish Name" className="my-1" isRequired placeholder="Enter the dish name"/></p>
                        <p><Input type="Preparation Time" className="my-1" isRequired placeholder="Enter the preparation time"/></p>
                    </CardHeader>


                

                <CardBody>
                    <div className="font-bold text-large">
                        Ingredients
                        <div className="flex">
                        <Input type="Ingredient" placeholder="Enter an ingredient"/>
                        <Button isIconOnly aria-label="Add Ingredient">
                            <FaPlus/>
                        </Button>
                        </div>
                    </div>
                    
                    <div>
                        <p>Steps</p>
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
    );
}
