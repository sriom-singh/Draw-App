const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

//Global variables with default value
let prevMouseX, prevMouseY,snapshot,
selectedTool = "brush",
isDrawing = false,
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = ()=>{
    //setting whole canvas background to white, so the download image will be white.
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle= selectedColor;
}

window.addEventListener("load", ()=>{
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight;
    setCanvasBackground()
});



const drawRect = (e) =>{
    // if fillcolor is not checked draw a rect with border else draw rect with background.
    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
     ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);

}
const drawCircle = (e) =>{
    ctx.beginPath();
    //getting redius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill():ctx.stroke(); // if fillcolor is not checked draw a circle with border else draw circle with background.
}
const drawLine = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY) // moving triangle to this 
    ctx.lineTo(e.offsetX,e.offsetY)
    ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY) // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY) // creating first line of the triangle.
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) // creating bottom line of triangle.
    ctx.closePath() // closing path of the triangle so the third line draw automatically.
    fillColor.checked ? ctx.fill():ctx.stroke(); // if fillcolor is not checked draw a circle with border else draw circle with background.
}




const startDraw = ((e) =>{
    isDrawing = true;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brush size as line width.
    ctx.strokeStyle =selectedColor;
    ctx.fillStyle =selectedColor;
    // copying canvas data and passing as snapsjot value.. this avoid dragging the image.
    snapshot= ctx.getImageData(0,0,canvas.width,canvas.height)
})
const drawing = (e) =>{
    if(!isDrawing) return ;//If Drawing is false return from here.
    ctx.putImageData(snapshot,0,0); //adding copied canvas data on to this canvas

    if(selectedTool === "brush" || selectedTool === "eraser"){

        // if selected tool is eraser then set strokeStyle to white
        // to paint the white color on to the existing canvas else the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);//creating line according to the pointer
        ctx.stroke(); // drawing/filling line with color;
    }else if(selectedTool === "rectangle"){
        drawRect(e)
    }else if(selectedTool === "circle"){
        drawCircle(e)
    }else if(selectedTool === "line"){
        drawLine(e)
    }else{
        drawTriangle(e)
    }
   
   
}




toolBtns.forEach(btn => {
    btn.addEventListener("click",() => {  // adding click event to all tool option
        document.querySelector(".options .active").classList.remove("active"); // removes active class from prvious active element.
        btn.classList.add("active");
        selectedTool = btn.id;
    })
});

sizeSlider.addEventListener('change',()=> brushWidth = sizeSlider.value)

colorBtns.forEach(btn => {
    btn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected"); // removes active class from prvious active element.
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})

colorPicker.addEventListener("change",()=>{
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click()
})

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height); // clearing all canvas
   setCanvasBackground();
})

saveImage.addEventListener("click",()=>{
    if (window.confirm("Do you really want to Download?")) {
        const link = document.createElement("a"); // creating <a> tag
    link.download= `${Date.now()}.jpg` ; // passing current data as link download value
    link.href = canvas.toDataURL(); // passing canvas Data as link href value
    link.click(); // clicking link to download
      }

})

canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",drawing)
canvas.addEventListener("mouseup",()=>isDrawing=false)