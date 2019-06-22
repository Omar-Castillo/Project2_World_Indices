// url to data json
var url = "https://project2-world-indices.herokuapp.com/data";

// Set up drawing area
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#chartVien")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function to draw chart
function drawChart(data) {
  // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([0, 105000])
      .range([0, width]);
  
    var yLinearScale = d3.scaleLinear()
      .domain([0, 90])
      .range([height, 0]);
  
    var circleScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Population), d3.max(data, d => d.Population)])
      .range([5, 15]);
  
    // Create axis functions
  
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    chartGroup.append("g")
      .call(leftAxis);
  
    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xLinearScale(d.GDP))
      .attr("cy", d => yLinearScale(d.Life))
      .attr("r", d => circleScale(d.Population))
      .attr("fill", function (d) {
        if (d.Country === "United States") return "blue";
        if (d.Country === "Japan") return "green";
        if (d.Country === "Singapore") return "green";
        if (d.Country === "Vietnam") return "red";
        if (d.Country === "China") return "red";
        if (d.Country === "Russian Federation") return "red";
        if (d.Country === "World") return "yellow";
        if (d.Country === "India") return "red";
        return "grey";
      })
      .attr("opacity", function (d) {
        if (d.Country === "United States") return "1";
        if (d.Country === "Japan") return "1";
        if (d.Country === "Singapore") return "1";
        if (d.Country === "Vietnam") return "1";
        if (d.Country === "China") return "1";
        if (d.Country === "Russian Federation") return "1";
        if (d.Country === "India") return "1";
        return "0.5";
      });
  
    //Initialize tool tip
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.Country}<br>GDP per capita: $${Math.round(d.GDP / 1000)}k<br>Life Expectancy: ${Math.round(d.Life)}`);
      });
  
    //Create tooltip in the chart
  
    chartGroup.call(toolTip);
  
    //Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function (data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });
  
    //Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Life Expectancy");
  
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("GDP per capita");
  }

// Function create chart
function createChart() {
  d3.json(url, function (data) {
    var year = document.getElementById("year").innerHTML;
    var dataChart = [];
    for (i = 0; i <= (data.length - 1); i += 1) {
      var country = data[i].CountryName;
      console.log(country);
      var gdp = data[i][year + " GDP per capita"];
      var life = data[i][year + " Life expectancy"];
      var population = data[i][year + " Population"];
      if (life == null || gdp == null || population == null) { continue; }
      dataChart.push(
        {
          "Year": year,
          "Country": country,
          "GDP": gdp,
          "Life": life,
          "Population": population,
        }
      );
    }
    drawChart(dataChart);
  });
}

// Function clear chart
function reset() {
  location.reload();
}

// Test hide div
function button1960() {
  document.getElementById("year").innerHTML = "1960";
  createChart();
  document.getElementById("note").innerHTML = "Average life expectancy was 53. While income gap is narrow, life expectancy gap is wide. Difference between longest living country and shortest living country was 44 years of life.";
}

function button1980() {
  document.getElementById("year").innerHTML = "1980";
  createChart();
  document.getElementById("note").innerHTML = "Average life expectancy was 63.";
}

function button1990() {
  document.getElementById("year").innerHTML = "1990";
  createChart();
  document.getElementById("note").innerHTML = "Average life expectancy was 65.";
}

function button2000() {
  document.getElementById("year").innerHTML = "2000";
  createChart();
  document.getElementById("note").innerHTML = "Average life expectancy was 68.";
}

function button2010() {
  document.getElementById("year").innerHTML = "2010";
  createChart();
  document.getElementById("note").innerHTML = "Average life expectancy was 71.";
}

function button2017() {
  document.getElementById("year").innerHTML = "2017";
  createChart();
  document.getElementById("note").innerHTML = "Average life expectancy was 73. Income gap became largest in history and this trend will continue in near future.  Life expectancy gap is much narrower comparing to 1960. Difference between longest living country and shortest living country was 32 years of life.";
}


