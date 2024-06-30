"use client";
import { useState } from "react";
import Editor from "./Editor";
import { MdFullscreen,MdFullscreenExit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { AddIngredient } from "./AddIngredient";

import {Card, CardHeader, CardBody, CardFooter, Image, Input, Button, ButtonGroup} from "@nextui-org/react";

export default function ViewRecipe(){
    const [recipeSize,setRecipeSize]=useState("")
    const [windowIcon,setWindowIcon]=useState(<MdFullscreen/>)

    const setRecipeSizeHandler= () =>{
        if(recipeSize==""){
            setRecipeSize("size-full")
            setWindowIcon(<MdFullscreenExit/>)
        }else{
            setRecipeSize("")
            setWindowIcon(<MdFullscreen/>)
        }
    }
    return (
        <div className="sm:container flex items-center justify-center">
            <Card className={recipeSize}>
                <div className="ml-auto">
                    <Button isIconOnly aria-label="Full screen" onClick={setRecipeSizeHandler}>
                        {windowIcon}
                    </Button>
                    <Button isIconOnly aria-label="Close Screen" color="danger">
                        <RxCross2/>
                    </Button>
                </div>

                
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center">
                    <Image
                        width={350}
                        src="./images/eggFriedRice.jpg"
                        className="d-flex object-cover rounded-xl justify-content-center mx-auto"/>
                        <p>Egg Fried Rice</p>
                        <p>1 hr</p>
                        </CardHeader>


                

                <CardBody>
                    <div className="font-bold text-large">
                        Ingredients
                        <ul className='font-normal text-small list-disc'>
                            <li>2 Eggs</li>
                            <li>Leftover Rice</li>
                            <li>Spring Onion</li>
                        </ul>
                    </div>

                    <div>
                        <p className="font-bold text-large">Steps</p>
                        {/* <Editor holder="EditorJS"></Editor> */}
                        <ol className="list-decimal">
                            <li>slice up shallots and garlic</li>

                        </ol>

                    </div>
                </CardBody>

                <CardFooter>
                    <div className="ml-auto">
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
