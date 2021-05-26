const refCanvas = document.getElementById("refCanvas");
const mainCanvas = document.getElementById("mainCanvas");
const tempCanvas = document.getElementById("tempCanvas");

const canvas = {
    width: mainCanvas.width,
    height: mainCanvas.height
}

//accessing tools
const PalateColor = document.getElementById('color')
let elemColor = '#000000'
let selectedTool = 'line';
PalateColor.addEventListener('change', () => {
    elemColor = PalateColor.value;
    console.log(elemColor);
})
document.querySelectorAll('input[type=checkbox]').forEach(item => {
    item.addEventListener('change', (e) => {
        selectedTool = e.target.id;
        console.log(selectedTool)
        document.querySelectorAll('input[type=checkbox]').forEach(item => {
            if(item.id !== selectedTool) {
                item.checked = false;
            }
        })
    })
})

//Board Properties
const refImage = document.getElementById("refImage")
refImage.style.width = canvas.width+"px"
const opacitySlider = document.getElementById("opacitySlider")
const opacityText = document.getElementById("opacityText")

//Accessing code generator tools
const generateButton = document.getElementById("generate")
const popup = document.getElementById("popup")
const closepopup = document.getElementById("closepopup")

let elements = [];
let selectedElement = null;
let currentElement = null;




// Initializing canvas class
artboard = new Artboard(refCanvas, mainCanvas, tempCanvas);

//artboard.DrawMainBoard(elements);
//artboard.UpdateTempElement(elements[0], { x1: 150 });

const mouse = {
    x: undefined,
    y: undefined
}
let shiftDown = false;
let mouseDown = false;
let drawn = false;
let lineNumber = 0;
let polyNumber = 0;
let polyDrawMode = false;
let ctrl = false;
let templine;

function loadSavedData() {
    if(savedData !== "") {
        const savedDataObject = JSON.parse(savedData);
        savedDataObject.forEach((data) => {
            if(data.type === 'line') {
                elements.push({name: "Line"+lineNumber++, elem: new Line(data.data.x, data.data.y, data.data.x1, data.data.y1, data.data.color, data.data.weight)})
            } else if(data.type == 'polygon') {
                console.log(data.data.points)
                elements.push({name: "Poly"+polyNumber++, elem: new Polygon(data.data.x, data.data.y, data.data.color, data.data.weight, data.data.points)});
            }
            artboard.DrawMainBoard(elements);
        } )
    }
}



document.addEventListener('mousemove', (e) => {
    pos = getMousePos(refCanvas, e)
    mouse.x = pos.x;
    mouse.y = pos.y;
    
})
document.addEventListener('keydown', (e) => {
    if(e.shiftKey) {
        shiftDown = true;
        console.log("ShiftDown", shiftDown)
    }
    if(e.ctrlKey) {
        ctrl = true;
    }
})
document.addEventListener('keyup', (e) => {
    if(e.which === 16) {
        shiftDown = false;
        console.log("ShiftDown", shiftDown)
    }
    if(e.which === 17) {
        ctrl = false;
    }
    if(e.which === 90) {
        if(ctrl) {
            polyDrawMode = false;
            elements.pop();
            artboard.DrawMainBoard(elements);
            artboard.ClearTemp();
            // var c = refCanvas.getContext("2d");
            // c.clearRect(0, 0, refCanvas.width, refCanvas.height);
        }
    }
})
tempCanvas.addEventListener('mousedown', () => {

    // Handle Basic shapes
    if(selectedTool === 'line') {
        elements.push({name: "Line"+lineNumber++, elem: new Line(mouse.x, mouse.y, mouse.x, mouse.y, elemColor)});
        currentElement = elements[elements.length - 1].elem
        artboard.UpdateTempElement(currentElement, { x: mouse.x, y: mouse.y, x1: mouse.x, y1: mouse.y });
        //console.log(elements[0].elem.isSelected(mouse.x, mouse.y))  
    }    
    mouseDown = true;

    //Hangle polygon
    if(selectedTool === 'poly')
    {
        //console.log(shiftDown)
        //Handles the starting of the polygon drawing        
        if(shiftDown && polyDrawMode) {
            artboard.ClearTemp();
            polyDrawMode = false;
            currentElement.end(mainCanvas);
            currentElement.draw(mainCanvas);
            document.getElementById('layers_panel').innerHTML += `
            <div class="layer_elem" id="layer${elements.length - 1}" onclick="selectElement(${elements.length - 1})">
                <p>${elements[elements.length - 1].name}</p>
            </div>
        ` 
        }
        //Check if user started to drawing polygon or not
        if(!shiftDown && !polyDrawMode) {
            templine = new Line(mouse.x, mouse.y, mouse.x, mouse.y, '#333333');
            polyDrawMode = true;
            elements.push({name: "Poly"+polyNumber++, elem: new Polygon(mouse.x, mouse.y, elemColor)});
            currentElement = elements[elements.length - 1].elem
            currentElement.init(mainCanvas, mouse.x, mouse.y)
            artboard.ClearTemp();
            
        } else {
            if(!shiftDown) {
                templine = new Line(mouse.x, mouse.y, mouse.x, mouse.y, '#333333');
                currentElement.addPoint(mainCanvas, mouse.x, mouse.y);
                artboard.ClearTemp();                
            }
            
            //currentElement.draw(tempCanvas)
        }    
    }
})
tempCanvas.addEventListener('mouseup', () => {
    mouseDown = false; 
    if(selectedTool !== 'poly') {
        currentElement = null;
    }  
    
    if(drawn) {        
        artboard.ClearTemp();        
        artboard.DrawMainBoard(elements);
        drawn = false;
        
        document.getElementById('layers_panel').innerHTML += `
            <div class="layer_elem" id="layer${elements.length - 1}" onclick="selectElement(${elements.length - 1})">
                <p>${elements[elements.length - 1].name}</p>
            </div>
        `        
    } else {
        if( selectedTool === 'line') {
            elements.pop();
            lineNumber--; 
        }
         
    }    
    
})
document.addEventListener('mousemove', (e) => {
    pos = getMousePos(refCanvas, e)
    mouse.x = pos.x;
    mouse.y = pos.y;
    if(mouseDown && currentElement !== null && selectedTool !== 'poly') {
        drawn = true;        
        artboard.UpdateTempElement(currentElement, { x1: mouse.x, y1: mouse.y });
    }
    else if(selectedTool === 'poly' && polyDrawMode) {
        console.log("Moving")
        templine.update(tempCanvas, {
            x1: mouse.x,
            y1: mouse.y
        })
    }
    
})
function selectElement(elemN)
{
    selectedElement = elements[elemN];
    console.log(selectedElement)
    selectedElement.elem.highlight(tempCanvas);
    elements.forEach((elem, i) => {
        document.querySelector("#layer"+i).style.backgroundColor = '#ffffff';
    })
    document.querySelector("#layer"+elemN).style.backgroundColor = '#F5F5F5';
}

//Manage opacity
opacitySlider.addEventListener('change', (e) => {
    opacityText.value = opacitySlider.value
    refImage.style.opacity = e.target.value / 100
    
})
opacityText.addEventListener('change', (e) => {
    opacitySlider.value = opacityText.value
    refImage.style.opacity = e.target.value / 100    
})


//Code generation
generateButton.addEventListener('click', () => {
    //console.log(generateCode(elements))
    popup.style.display = 'block'
    document.getElementById('codeViewer').value = generateCode(elements)
})
closepopup.addEventListener('click', function() {
    document.querySelector('.popup').style.display = 'none'
})
document.getElementById('download').addEventListener('click', () => {
    save(elements);
})

document.getElementById('loadDrawing')
    .addEventListener('change', function() {              
    var fr=new FileReader();
    fr.onload=function(){
        savedData = fr.result
        //location.reload();
        loadSavedData();
    }
        
    //console.log(fr.readAsText(this.files[0]))
    fr.readAsText(this.files[0]);
})