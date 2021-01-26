// Set up our chart
// ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 50,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// =================================
svg = d3.select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from the data.csv file
d3.csv("assets/data/data.csv").then(function(ScatterData) {

// Format the data
    ScatterData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
  });

// Create scaling functions   
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(ScatterData, d => d.poverty), d3.max(ScatterData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(ScatterData, d => d.healthcare), d3.max(ScatterData, d => d.healthcare)])
        .range([height, 0]);

// Create axis functions
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);  

// Add axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(ScatterData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .attr("fill", "gray")
        .attr("opacity", ".5")
        .attr("stroke", "white");    

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
        });
        
    // Initalize Tooltip
    

    let tip = d3.tip()
       .attr("class", "d3-tip")
       .offset([80, -60])
       .html(function(d) {
        return (`${d.poverty}<br>${d.healthcare}<br>`);
    }); 


// tooltip in the chart
    chartGroup.call(tip); 

    
// Add an onmouseover event to display a tooltip   
    circlesGroup.on("mouseover", function(data) {
        tip.show(data, this);
    })

    // Add an on mouseout    
    .on("mouseout", function(data, index) {
        tip.hide(data);
    });

      
});