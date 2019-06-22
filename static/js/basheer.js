 //POPULATE THE YEAR ARR
year = [];
for (a = 1960; a < 2018; a++) {
  year.push(a)
}

//CREATE EMPTY ARRAY OUTSIDE OF SCOPE OF JSON FUNC
var dataChart = [];

d3.json("https://project2-world-indices.herokuapp.com/data").then(function(data) {

  //REFORMAT DATA TO USEFUL FORMAT
  dataChart = reformat(data);
  console.log(dataChart)

  //CREATE LIST OF COUNTRIES
  var CountryName_arr = countrynames(dataChart) 
  console.log(CountryName_arr)


  //BUILD GRAPH WITH AFGHANISTAN DATA
  buildgraphs(dataChart[0]);

  //POPULATE DROPDOWN LIST
  d3.select("#selectButton")
    .selectAll('myOptions')
   	.data(CountryName_arr)
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })

// When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    var found_country = find_dataset(selectedOption)
    console.log(dataChart[found_country])
    // run the buildgraphs function with this selected option
    buildgraphs(dataChart[found_country])
  })

 });  


///FUNCTION TO FIND DATASET BASED ON USER SELECTION///
function find_dataset(selectedOption) {
  for (f=0; f < dataChart.length; f++){
    if (dataChart[f].Country==selectedOption) {
      var found_loc = f;
      return found_loc
    }
    else {}
  }
}

///FUNCTION TO FORMAT JSON FILE DATA TO USEFUL FORMAT///
function reformat(data) {
  var reformated_data=[]
  for (b = 0; b < data.length; b++) {
    var country = data[b].CountryName;

    var gdp_all = [];
    var life_all =[];
    var pop_all=[];
    var migr_all=[];
    var country_years = [];

    for (c=0; c < year.length; c++){
      var gdp = data[b][year[c] + " GDP per capita"];
      var life = data[b][year[c] + " Life expectancy"];
      var pop = data[b][year[c] + " Population"];
      var migr = data[b][year[c] + " Net migration"];
      var single_yr= year[c];

      //only take complete data
      if (gdp == null || life == null || pop == null || migr == null) { }//do nothing if null values
      else {
        country_years.push(single_yr);
        gdp_all.push(gdp);
        life_all.push(life);
        pop_all.push(pop);
        migr_all.push(migr);
      }
    }

    country_data= {
      "Country": country,          
      "Year": country_years,
      "GDP": gdp_all,
      "Life": life_all,
      "Population": pop_all,
      "Migration":migr_all
    }

    reformated_data.push(country_data);
    
  }
  return reformated_data
}


 ////FUNCTION TO ACCUMULATE ALL COUNTRY NAMES///
function countrynames (data) {
  var all_country_names = []
  for (d=0; d < dataChart.length; d++){
    all_country_names.push(data[d].Country)
  }
  console.log(all_country_names)
  return all_country_names
}

///FUNCTION TO BUILD GRAPH
function buildgraphs(datum) {
  var trace1 = {
    x: datum.Year,
    y: datum.Life,
    fill: 'tozeroy',
    xaxis: 'x1',
    yaxis: 'y1',
    name: 'Life Expectancy (yrs)',
    type: 'scatter'
  };

  var trace2 = {
    x: datum.Year,
    y: datum.Population,
    fill: 'tozeroy',
    xaxis: 'x2',
    yaxis: 'y2',
    name: 'Population (Mil)',
    type: 'scatter'
  };

  var trace3 = {
    x: datum.Year,
    y: datum.Migration,
    fill: 'tozeroy',
    xaxis: 'x3',
    yaxis: 'y3',
    name: 'Net Migration',
    type: 'scatter'
  };

  var data = [trace1, trace2, trace3];

  var layout = {
    title: {
      text:datum.Country,
      font: {
        family: 'Serif',
        size: 32,
        color: 'gray'
      }
    },
    autosize: true,
    height: 600,
    grid: {
      rows: 3,
      columns: 1,
      pattern: 'independent',
      roworder: 'top to bottom'}
  };

  Plotly.newPlot('plot', data, layout);
}