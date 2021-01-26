
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = 900;
    var svgHeight = 500;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    //Append SVG element
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    
    //Append group element
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Read CSV
    d3.csv("assets/data/data.csv").then(function(Data) {

    //Parse data
        Data.forEach(function(data){
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

    //Create scale  (depart from min. data)
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(Data, d => d.poverty), d3.max(Data, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(Data, d => d.healthcare), d3.max(Data, d => d.healthcare)])
            .range([height, 0]);

    //Create axes
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);  

    //Append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

    //Append circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(Data)
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
            .data(Data)
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
        
    // Step 1: Initialize Tooltip    
        let tooltip = d3.tip()
        .attr("class","d3-tip")
        .offset([80, -60])
        .html(function(d){
            return(`${d.state}<br>Population In Povery (%): ${d.poverty}<br> Healthcare (%):${d.healthcare}`)
        });

    // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(tooltip); 

    
    // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
            tooltip.show(d, this);
        })
        
    // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d,index) {
            tooltip.hide(d);
        });

     // Create axes labels  
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 1.30))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
       // .attr("transform", `translate(${width /2.5}, ${height + margin.top + 180})`)
        .attr("class", "aText")
        .text("In Poverty (%)");

});

/* }).catch(function(error){
    console.log(error);
}) */
