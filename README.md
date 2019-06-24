# Project 3 | World Indices

![World](https://media.giphy.com/media/UOdoMz3baCENO/giphy.gif)

# Final Heroku app

https://project2-world-indices.herokuapp.com/

## Team Members

Mubbasheer Ahmed

Omar Castillo

Mariam Hassan

Vien Vo


## Project Description
We want to build an interactive website to present data on GDP, Life Expectancy, Net Migration, and Population.  This website will highlight connection among indices such as the more income a nation has, the higher life expectancy will be.  It will have numerous charts using map, time trend analysis, bar chart, regression and etc.

### Tools

![Animated_Chart](https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif)

ChartJS:  for animated charts.  This is a new library that we did not study in class.

MySQL:  all data points are related by Country Code.  It makes senses to use relational database.

HTML5, CSS, and JS:  for interactive charts.

### Data Source

World Bank

https://databank.worldbank.org/

### Step-by-step

1.	Download data from World Bank.
2.	Load data to MySQL.
3.	Create Flask route.
4.	Create skeleton of HTML with CSS.
5.	Create story line – what do you want to talk about?
6.	Create core charts to illustrate your story.
7.	Beautify the site.


### Data Explanation

Net migration: Net migration is the net total of migrants during the period, that is, the total number of immigrants less the annual number of emigrants, including both citizens and noncitizens. Data are five-year estimates.

Population: Total population is based on the de facto definition of population, which counts all residents regardless of legal status or citizenship. The values shown are midyear estimates.

Life expectancy at birth: Life expectancy at birth indicates the number of years a newborn infant would live if prevailing patterns of mortality at the time of its birth were to stay the same throughout its life.

GDP per capita: GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.
