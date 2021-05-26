class Artboard
{
    constructor(refCanvas, mainCanvas, tempCanvas)
    {
        this.refCanvas = refCanvas;
        this.mainCanvas = mainCanvas;
        this.tempCanvas = tempCanvas;
        this.ref = refCanvas.getContext("2d");
        this.main = mainCanvas.getContext("2d");
        this.temp = tempCanvas.getContext("2d");
        this.temp.globalAlpha = 0.5;
    }
    UpdateTempElement(element, config)
    {
        element.update(this.tempCanvas, config);
    }
    ClearTemp()
    {
        this.temp.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
    }
    DrawMainBoard(elements)
    {
        console.log(elements)
        this.main.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        elements.forEach(elem => {
            elem.elem.draw(this.mainCanvas);
        })
    }
}