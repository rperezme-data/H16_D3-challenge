// 1. CHART SETUP
// Pending: test different chart sizes

var svgWidth = 640; //960
var svgHeight = 480;

var margin = {
    top: 20,
    right: 20,
    left: 20,
    bottom: 20
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// 2. SVG WRAPPER

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// 3. LOAD DATA

// d3.csv("assets/data/data.csv").then((censusData) => {

//     console.log("Census data: ", censusData);


// });
