// 1. CHART SETUP
// Pending: test different chart sizes & margins

var svgWidth = 800;
var svgHeight = 600;

var margin = {
    top: 30,
    right: 20,
    bottom: 120,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// 2. SVG SETUP

// Create SVG WRAPPER
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// UPDATE X-SCALE FUNCTION (upon click on axis label)
function xScale(censusData, chosenXAxis) {

    // Create scale
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8, d3.max(censusData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);

    return xLinearScale;
}


// UPDATE Y-SCALE FUNCTION (upon click on axis label)
function yScale(censusData, chosenYAxis) {

    // Create scale
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8, d3.max(censusData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);   // Invert Y axis

    return yLinearScale;
}


// UPDATE X-AXIS FUNCTION (upon click on axis label)
function renderXAxes(newXScale, xAxis) {

    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}


// UPDATE Y-AXIS FUNCTION (upon click on axis label)
function renderYAxes(newYScale, yAxis) {

    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}


// UPDATE CIRCLES-GROUP FUNCTION (transition to new circles)
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}


// UPDATE CIRCLES-GROUP FUNCTION (transition to new circles)
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}






// UPDATE CIRCLES-GROUP FUNCTION (update to new tooltip)
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

//     // Pending: improve to inline IF
//     var xlabel;

//     if (chosenXAxis === "poverty") {
//         xlabel = "In Poverty:";
//     }
//     else if (chosenXAxis === "age") {
//         xlabel = "Age: ";
//     } else {
//         xlabel = "Household Income:";
//     }

//     var ylabel;

//     if (chosenYAxis === "healthcare") {
//         ylabel = "Lacks Healthcare:";
//     }
//     else if (chosenYAxis === "smokes") {
//         ylabel = "Smokes:";
//     } else {
//         ylabel = "Obese:";
//     }

//     var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function (d) {
//             return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}%`);
//         });

//     circlesGroup.call(toolTip);


//     circlesGroup.on("mouseover", function (data) {
//         toolTip.show(data);
//     })
//         // onmouseout event
//         .on("mouseout", function (data, index) {
//             toolTip.hide(data);
//         });

//     return circlesGroup;
// }



// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (censusData, err) {
    if (err) throw err;

    // Parse data (types)
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);


    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        // .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .classed("stateCircle", true);
    // .attr("fill", "pink")
    // .attr("opacity", ".5");

    // Create group for three x-axis labels
    var labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");


    // Create group for three y-axis labels
    var labelsYGroup = chartGroup.append("g")
        .attr("transform", `translate(${-20}, ${height / 2})`);

    var obesityLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -60)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");

    var smokesLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -40)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    var healthcareLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -20)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");


    // updateToolTip function above csv import
    // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


    // x axis labels event listener
    labelsXGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                console.log(chosenXAxis);   // DEBUG

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);


                // updates circles with new x values
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {

                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else if (chosenXAxis === "age") {

                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else {

                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);

                }
            }
        });

    // Y axis labels event listener
    labelsYGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenYAxis with value
                chosenYAxis = value;

                console.log(chosenYAxis);   // DEBUG

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(censusData, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "obesity") {

                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else if (chosenYAxis === "smokes") {

                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else {

                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);

                }
            }
        });













}).catch(function (error) {
    console.log(error);
});
