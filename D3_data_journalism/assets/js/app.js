// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
let svgWidth = 960
let svgHeight = 500
let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
}

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;


// Step 2: Create an SVG Wrapper
// let svg = d3.select("body").append("svg")
// div id scatter from Html
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);
// let donutData = await d3.csv("donuts.csv")

// Step 3: Import data from donuts.csv
d3.csv("./assets/data/data.csv")
.then(ScatterData=>{

// Step 4: Parse the data
// Choose You need to create a scatter plot between two of the data variables such as Healthcare vs. Poverty 
    console.log(ScatterData);
    //let parseTime = d3.timeParse("%d-%b")
    
       ScatterData.forEach(d=>{
        //d.date = parseTime(d.date)
       d.poverty = +d.poverty
       d.healthcare = +d.healthcare
});

// Step 5: Create the scales
    let xLinearScale = d3.scaleLinear()
        .domain([0,d3.max(ScatterData, d=>d.poverty)])
        .range([0, width]);

// Step 6: Set up y-axis domain
    let yLinearScale = d3.scaleLinear()
        .domain([0,d3.max(ScatterData, d=>d.healthcare)])
        .range([height,0]);


// Step 7: Create the axes
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);


// Step 8: Append the axes
chartGroup.append("g")
    .call(bottomAxis)
    .attr("transform",`translate(0, ${height})`)

chartGroup.append("g")
    //.attr("stroke","green")
    .call(leftAxis)


// Step 9: Set up line generators
/*
let line1 = d3.line()
    .y(d=> yLinearScale1(d.morning))
let line2 = d3.line()
    .y(d=> yLinearScale2(d.evening))
*/

 let circlesGroup = chartGroup.selectAll("circle")
.data(ScatterData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", 10)
.attr("fill", "lightgray")
.attr("opacity", ".5")
.attr("stroke", "white")    

chartGroup.append("text")
.style("text-anchor", "middle")
.style("font-family", "sans-serif")
.style("font-size", "8px")
.selectAll("tspan")
.data(ScatterData)
.enter()
.append("tspan")
.attr("x", function(data) {
    return xLinearScale(data.poverty);
})
.attr("y", function(data) {
    return yLinearScale(data.healthcare -.02);
})
.text(function(data) {
    return data.abbr
})

/***check */
// Initalize Tooltip
let toolTip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("position", "absolute")
.style("background", "lightsteelblue")
.style("pointer-events", "none")
     

// tooltip in the chart
//chartGroup.call(toolTip);   
circlesGroup.call(toolTip);

// Add an onmouseover event to display a tooltip   
circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
})

// Add an on mouseout    
.on("mouseout", function(data, index) {
    toolTip.hide(data);
});

return circlesGroup;

// Create axes labels 
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left - 5)
.attr("x", 0 - (height / 1.30))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Lacks Healthcare (%)");

chartGroup.append("text")
.attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("In Poverty (%)");


/*** check*/
})
.catch(e=>{
console.log(e)
})
