// @TODO: YOUR CODE HERE!
// Width and height 
var svgWidth = 900;
var svgHeight = 600;

// Margins 
var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

// Width and height based on svg margins 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// svg wrapper, append SVG group to hold chart, and shift by left and top margins
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// chartGroup to hold data, transform and translate to fit in the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
var importfile = "assets/data/data.csv"

d3.csv(importfile).then(importSuccess, importError);

// Append data and SVG objects
function importError(error) {
  throw err;
}

// loop through and pass argument
function importSuccess(healthData) {

  healthData.map(function (data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  // Scale functions 
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(healthData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(healthData, d => d.obesity)])
    .range([height, 0]);

  // Axis functions

  var bottomAxis = d3.axisBottom(xLinearScale)
    // Number of ticks for bottom axis  
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);


// Append axis to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  
  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles 
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "13")
    .attr("fill", "#ecb235b6")
    .attr("opacity", ".95")


  // Append text to circles 

  var circlesGroup = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "11px")
    .style("text-anchor", "middle")
    .style('fill', 'darkblue')
    .text(d => (d.abbr));

  // Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
    });

  // Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obese (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}

