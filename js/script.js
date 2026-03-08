let months = [];
let sales = [];

let lineChart;
let pieChart;

async function loadData(){

const file = document.getElementById("csvFile").files[0];

if(!file){
alert("Please choose a CSV file first");
return;
}

const text = await file.text();

/* FIXED CSV PARSER */
const rows = text.trim().split(/\r?\n/).map(r => r.split(","));

rows.shift(); // remove header

months = [];
sales = [];

rows.forEach(r=>{
months.push(r[0].trim());
sales.push(parseInt(r[1].trim()));
});

drawBars();
drawLineChart();
drawPieChart();

bubbleSort();

}

function drawBars(){

const container = document.getElementById("bars");
container.innerHTML = "";

const max = Math.max(...sales);

sales.forEach((v,i)=>{

const bar = document.createElement("div");

bar.className = "bar";
bar.style.height = (v/max)*250 + "px";
bar.innerText = v;

container.appendChild(bar);

});

}

function drawLineChart(){

const ctx = document.getElementById("salesChart").getContext("2d");

if(lineChart) lineChart.destroy();

lineChart = new Chart(ctx,{
type:"line",
data:{
labels:months,
datasets:[{
label:"Monthly Sales",
data:sales,
borderColor:"blue",
backgroundColor:"lightblue",
fill:false
}]
}
});

}

function drawPieChart(){

const ctx = document.getElementById("pieChart").getContext("2d");

if(pieChart) pieChart.destroy();

pieChart = new Chart(ctx,{
type:"pie",
data:{
labels:months,
datasets:[{
data:sales,
backgroundColor:[
"#3182CE","#63B3ED","#90CDF4","#A0AEC0",
"#48BB78","#68D391","#F6E05E","#ECC94B",
"#ED8936","#E53E3E","#D53F8C","#805AD5"
]
}]
}
});

}

async function bubbleSort(){

let n = sales.length;

for(let i=0;i<n;i++){

for(let j=0;j<n-i-1;j++){

document.getElementById("stepInfo").innerText =
`Comparing ${months[j]} and ${months[j+1]}`;

if(sales[j] > sales[j+1]){

document.getElementById("stepInfo").innerText =
`Swapping ${months[j]} and ${months[j+1]}`;

[sales[j],sales[j+1]] = [sales[j+1],sales[j]];
[months[j],months[j+1]] = [months[j+1],months[j]];

drawBars();
drawLineChart();
drawPieChart();

await new Promise(r=>setTimeout(r,600));

}

}

}

document.getElementById("stepInfo").innerText = "Sorting Complete";

}

function downloadReport(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.text("Sales Report",20,20);

sales.forEach((s,i)=>{
doc.text(`${months[i]} : ${s}`,20,40+i*10);
});

doc.save("sales-report.pdf");

}