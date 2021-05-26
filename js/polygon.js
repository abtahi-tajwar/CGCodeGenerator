class Polygon
{
    constructor(x, y, color="#000000", weight = 1, points=[])
    {
        this.x = x;
        this.y = y;
        this.color = color;
        this.weight = weight;
        // if(points.length === 0) {
        //     this.points = [this.x, this.y]
        // } else {
        //     this.points = points;
        // }

        this.points = points;
        
        this.openglCode = "";
    }
    init(canvas, x, y)
    {
        const c = canvas.getContext('2d')
        //c.clearRect(0, 0, canvas.width, canvas.height)
        c.lineWidth = this.weight;
        c.strokeStyle = this.color;
        c.beginPath();
        c.moveTo(this.x, this.y)
        this.points.push(x);
        this.points.push(y);
    }
    getType()
    {
        return "polygon";
    }
    getJSON()
    {
        let val = {
            x: this.x,
            y: this.y,
            weight: this.weight,
            points: this.points,
            color: this.color
        }
        return val;
    }  
    addPoint(canvas, x, y)
    {
        const c = canvas.getContext('2d')
        this.points.push(x);
        this.points.push(y);
        c.lineTo(x, y);
        c.stroke();
    }
    end(canvas)
    {
        const c = canvas.getContext('2d')
        c.closePath();
    }
    update(canvas, config)
    {
        const tc = canvas.getContext('2d')
        tc.clearRect(0, 0, canvas.width, canvas.height);        
        if("tempX" in config)
        {            
            this.points[this.points.length-2] = config.x1;
            this.draw(canvas);
        }
        if("tempY" in config)
        {
            this.points[this.points.length-1] = config.y1;
            this.draw(canvas);
        }
    }
 
    draw(canvas)
    {
        const c = canvas.getContext('2d')
        c.lineWidth = this.weight;
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.beginPath();
        c.moveTo(this.points[0], this.points[1])
        for(let i = 2; i < this.points.length; i += 2)
        {
            c.lineTo(this.points[i], this.points[i+1])
        }        
        c.closePath();
        c.fill();
        //c.stroke();
    }
    highlight(canvas)
    {
        const c = canvas.getContext('2d')
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.lineWidth = this.weight + 3;
        c.strokeStyle = '#0062ff';
        c.beginPath();
        c.moveTo(this.points[0], this.points[1])
        for(let i = 2; i < this.points.length; i += 2)
        {
            c.lineTo(this.points[i], this.points[i+1])
        }        
        c.closePath();
        c.stroke();
        c.strokeStyle = this.color;
        c.lineWidth = this.weight;
    }
    openGLOutputv2()
    {       


        ////////
        let index = 0;
        let maxdistance = Infinity;
        let newPoints = [];
        let averageX = 0, averageY = 0;
        //this.points.shift()
        //this.points.shift()
        //console.log(points);
        console.log(this.points)
        for(let i = 0; i < this.points.length; i += 2) {
            averageX += this.points[i];
            averageY += this.points[i+1];
        }
        averageX = averageX / Math.ceil(this.points.length / 2);
        averageY = averageY / Math.ceil(this.points.length / 2);
        for(let i = 0; i < this.points.length; i += 2) {
            const distX = (averageX - this.points[i]) * (averageX - this.points[i]);
            const distY = (averageY - this.points[i+1]) * (averageY - this.points[i+1]);
            //debugPoints(averageX, averageY);
            let distance = distX + distY;
            
            if(distance < maxdistance) {                
                maxdistance = distance
                index = i;
            }
        }
        for(let i = index; i < this.points.length; i += 2) { 
            newPoints.push(this.points[i]);
            newPoints.push(this.points[i+1]);
        }
        for(let i = 0; i < index - 1; i += 2) { 
            newPoints.push(this.points[i]);
            newPoints.push(this.points[i+1]);
        }
        //debugPoints(newPoints[0], newPoints[1]);
        newPoints.push(newPoints[0], newPoints[1]);
        //newPoints.shift();
        const rgb = hexToRgb(this.color)
        this.openglCode += `
            glBegin(GL_POLYGON);
            glColor3ub(${rgb.r},${rgb.g},${rgb.b});
            `
        for(let i = 0;  i < this.points.length; i += 2)
        {
            console.log(newPoints[i], newPoints[i+1])
            const point = normalize(Math.floor(newPoints[i]), Math.floor(canvas.height - newPoints[i+1]), canvas.width, canvas.height)
            this.openglCode += `glVertex2f(${point.x.toFixed(2)}f, ${-point.y.toFixed(2)}f);
            `
        }
        this.openglCode += "glEnd();";
        return this.openglCode
    }
    openGLOutput()
    {
        const newPoints = getDeepestPoint(this.points);   
        const rgb = hexToRgb(this.color)
        this.openglCode += `
            glBegin(GL_TRIANGLE_FAN);
            glColor3ub(${rgb.r},${rgb.g},${rgb.b});
            `
        for(let i = 0;  i < newPoints.length; i += 2)
        {
            const point = normalize(newPoints[i], canvas.height - newPoints[i+1], canvas.width, canvas.height)
            this.openglCode += `glVertex2f(${point.x.toFixed(3)}f, ${-point.y.toFixed(3)}f);
            `
        }
        this.openglCode += "glEnd();";
        return this.openglCode
    }
    
}