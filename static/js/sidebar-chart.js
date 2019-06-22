(async (win) => {
    const constants = win.chart.constants;
    const utils = win.chart.utils;

    const sidebar = {};

    let sidebarChart;

    // create the sidebar chart initially
    sidebar.drawChart = (svg) => {
        sidebarChart = svg.append('g')
            .attr('class', 'sidebar-chart')
            .attr('transform', `translate(0, ${constants.sidebarY})`)
    };

    // create the sidebar chart axis
    sidebar.createAxis = (yScale) => {
        const axis = d3.axisLeft(yScale);

        sidebarChart.select('.y-axis').remove();

        sidebarChart.append('g')
            .attr('class', 'axis y-axis')
            .attr('transform', 'translate(0,0)')
            .call(axis);
    };

    // update the sidebar chart on data change
    sidebar.updateChart = ({ data, colorScale, xScale, yScale }) => {
        const sidebarData = sidebarChart.selectAll('.bar')
            .data(data, d => d.country_code + d.value);

        sidebarData.exit().remove();

        const sidebarGroup = sidebarData.enter().append('g')
            .attr('class', 'bar')
            .attr('transform', d => {
                const yvalue = yScale(d.country_code) + yScale.bandwidth() / 4;
                return `translate(0, ${yvalue})`
            });

        sidebarGroup.append('rect')
            .attr('height', yScale.bandwidth() / 2)
            .attr('width', d => xScale(d.value))
            .style('fill', d => colorScale(d.value));

        sidebarGroup.append('text')
            .attr('x', d => xScale(d.value) + 5)
            .attr('y', yScale.bandwidth() / 2)
            .style('fill', d => colorScale(d.value))
            .text(d => utils.valueFormat(d.value / 1000000)); 

        sidebar.createAxis(yScale);
    };    

    win.chart.sidebar = sidebar;
})(window);