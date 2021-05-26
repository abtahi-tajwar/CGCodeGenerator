class Line
{
    constructor(x = 0, y = 0, x1 = 0, y1 = 0, color = '#000000', weight=1)
    {
        this.x = x;
        this.y = y;
        this.weight = weight;
        this.x1 = x1;
        this.y1 = y1;
        this.color = color;
        this.openglCode = '';
    }
    getType()
    {
        return "line";
    }
    getJSON()
    {
        let val = {
            x: this.x,
            y: this.y,
            weight: this.weight,
            x1: this.x1,
            y1: this.y1,
            color: this.color
        }
        return val;
    }
    update(canvas, config)
    {
        const tc = canvas.getContext('2d')
        tc.clearRect(0, 0, canvas.width, canvas.height);        
        if("x1" in config)
        {            
            this.x1 = config.x1;
            this.draw(canvas);
        }
        if("y1" in config)
        {
            this.y1 = config.y1;
            this.draw(canvas);
        }
        if("color" in config)
        {
            this.color = config.color;
            this.draw(canvas);
        }
        if("weight" in config)
        {
            this.weight = weight;
            this.draw(canvas);
        }
    }
    draw(canvas)
    {
        const c = canvas.getContext("2d")
        c.strokeStyle = this.color;
        c.lineWidth = this.weight;
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x1, this.y1);
        c.stroke();
        c.closePath();
    }
    highlight(canvas)
    {
        const c = canvas.getContext("2d")
        c.clearRect(0, 0, canvas.width, canvas.height)
        c.lineWidth = this.weight + 3;
        c.strokeStyle = '#0062ff';
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x1, this.y1);
        c.stroke();
        c.closePath();
        c.strokeStyle = this.color;
        c.lineWidth = this.weight;
    }
    tooSmall()
    {
        if(pointDistance(this.x, this.y, this.x1, this.y1) < 0.5)
        {
            return true;
        } 
        return false;
    }
    isSelected(x, y)
    {
        const m = (this.y - this.y1)/(this.x - this.x1)
        if((y - this.y) === m*(x - this.x)) {
            return true;
        }
        return false;
    }
    openGLOutput()
    {
        const startPoint = normalize(Math.floor(this.x), Math.floor(canvas.height - this.y), canvas.width, canvas.height);
        const endPoint = normalize(Math.floor(this.x1), Math.floor(canvas.height - this.y1), canvas.width, canvas.height);
        const rgb = hexToRgb(this.color)
        this.openglCode += `
            glBegin(GL_LINES);
            glColor3ub(${rgb.r},${rgb.g},${rgb.b});
                glVertex2f(${startPoint.x}f, ${startPoint.y}f);
                glVertex2f(${endPoint.x}f, ${endPoint.y}f);
            glEnd();
        `
        return this.openglCode
    }
}