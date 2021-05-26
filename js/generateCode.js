function generateCode(elements)
{
    finalStr = "";
    elements.forEach(element => {
        console.log(elements)
        finalStr += element.elem.openGLOutput();
    });
    console.log(finalStr);
    return finalStr;
}