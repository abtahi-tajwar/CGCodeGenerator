function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
//Extracting r,g,b values from hex code
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function pointDistance(x, y, x1, y1)
{
    const xDist = x - x1;
    const yDist = y - y1;
    return Math.sqrt(xDist*xDist + yDist*yDist);
}
function normalize(x, y, w, h)
{
    pos = {};
    pos.x = Math.round(((x - w / 2) / (w / 2)) * 1000)/1000;
    pos.y = -Math.round(((y - h / 2) / (h / 2)) * 1000)/1000;
    return pos;
}
function debugPoints(x, y) {
    const tempCanvas = document.getElementById("tempCanvas");
    const PalateColor = document.getElementById('color')
    const c = tempCanvas.getContext('2d')
    c.strokeStyle = '#ff0000';
    c.beginPath();
    c.arc(x, y, 5, 0, 2 * Math.PI);
    c.stroke();
    c.strokeStyle = PalateColor;
}
function getDeepestPoint(points)
{
    ////////
    let index = 0;
    let maxdistance = Infinity;
    let newPoints = [];
    let averageX = 0, averageY = 0;
    for(let i = 0; i < points.length; i += 2) {
        averageX += points[i];
        averageY += points[i+1];
    }
    averageX = averageX / Math.ceil(points.length / 2);
    averageY = averageY / Math.ceil(points.length / 2);

    for(let i = 0; i < points.length; i += 2) {
        const distX = (averageX - points[i]) * (averageX - points[i]);
        const distY = (averageY - points[i+1]) * (averageY - points[i+1]);
        //debugPoints(averageX, averageY);
        let distance = distX + distY;
        
        if(distance < maxdistance) {                
            maxdistance = distance
            index = i;
        }
    }
    for(let i = index; i < points.length; i += 2) { 
        newPoints.push(points[i]);
        newPoints.push(points[i+1]);
    }
    for(let i = 0; i < index - 1; i += 2) { 
        newPoints.push(points[i]);
        newPoints.push(points[i+1]);
    }
    
    return newPoints;
}

function getFurthesPoint(points)
{
    ////////
    let index = 0;
    let maxdistance = 0;
    let newPoints = [];
    let averageX = 0, averageY = 0;
    for(let i = 0; i < points.length; i += 2) {
        averageX += points[i];
        averageY += points[i+1];
    }
    averageX = averageX / Math.ceil(points.length / 2);
    averageY = averageY / Math.ceil(points.length / 2);

    for(let i = 0; i < points.length; i += 2) {
        const distX = (averageX - points[i]) * (averageX - this.points[i]);
        const distY = (averageY - points[i+1]) * (averageY - this.points[i+1]);
        //debugPoints(averageX, averageY);
        let distance = distX + distY;
        
        if(distance > maxdistance) {                
            maxdistance = distance
            index = i;
        }
    }
    for(let i = index; i < points.length; i += 2) { 
        newPoints.push(points[i]);
        newPoints.push(points[i+1]);
    }
    for(let i = 0; i < index - 1; i += 2) { 
        newPoints.push(points[i]);
        newPoints.push(points[i+1]);
    }
    
    return newPoints;
}
