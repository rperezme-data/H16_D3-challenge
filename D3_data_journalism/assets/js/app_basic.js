// 1. CHART SETUP
// Pending: test different chart sizes & margins

var svgWidth = 800; //960
var svgHeight = 480;

var margin = {
    top: 50,
    right: 20,
    left: 20,
    bottom: 50
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

d3.csv("assets/data/data.csv").then((censusData) => {

    // Parse data (types)
    censusData.forEach((data) => {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    })

    // 4. SCALES SETUP

    var xPovertyLinSc = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.poverty) - 1, d3.max(censusData, d => d.poverty) + 1])
        .range([0, width]);

    var yHealthcareLinSc = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.healthcare) - 1, d3.max(censusData, d => d.healthcare) + 1])
        .range([height, 0]);   // Invert Y axis

    // 5. AXES SETUP

    var bottomAxis = d3.axisBottom(xPovertyLinSc);
    var leftAxis = d3.axisLeft(yHealthcareLinSc);

    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(leftAxis);

    // 6. DRAW CIRCLES

    var circlesGroup = chartGroup.append("g")

    circles.Group.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xPovertyLinSc(d.poverty))
        .attr("cy", (d) => yHealthcareLinSc(d.healthcare))
        .attr("r", 11)
        .classed("stateCircle", true);
    // .attr("fill", "lightblue")

    // 7. ADD TEXT

    var textGroup = chartGroup.append("g")

    textGroup.selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", (d) => xPovertyLinSc(d.poverty))
        .attr("y", (d) => yHealthcareLinSc(d.healthcare))
        .attr("dx", "-0.7em")
        .attr("dy", "0.4em")
        .attr("font-size", 12)
        .attr("font-weight", "bold")
        // .classed("stateText", true)
        .text((d) => d.abbr);


    // --DEBUG--

    console.log("Census data: ", censusData);
    console.log("Poverty: ", censusData.map(d => d.poverty));
    console.log("Healthcare: ", censusData.map(d => d.healthcare));
    console.log("State Abbreviation: ", censusData.map(d => d.abbr));


}).catch(function (error) {
    console.log(error);
});


    // PENDING:
        // + Axes titles
        // + Tooltips
        // + Circles mouseover/mouseout
        // + Tooltips

//   // Create group for two x-axis labels
//   var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

//   var hairLengthLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "hair_length") // value to grab for event listener
//     .classed("active", true)
//     .text("Hair Metal Ban Hair Length (inches)");

//   var albumsLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "num_albums") // value to grab for event listener
//     .classed("inactive", true)
//     .text("# of Albums Released");