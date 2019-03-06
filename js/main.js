const width = 1200;
const height = 800;
const radius = Math.min(width, height) / 2;

const svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

const color = d3.scaleOrdinal(d3.schemeSet2);

const pie = d3.pie()
    .value(d => d.count)
    .sort(null);


const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);
/*
var tooltip = d3.select('#chart') // select element in the DOM with id 'chart'
  .append('div') // append a div element to the element we've selected                                    
  .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

tooltip.append('div') // add divs to the tooltip defined above                            
  .attr('class', 'type'); // add class 'label' on the selection                         

tooltip.append('div') // add divs to the tooltip defined above                     
  .attr('class', 'count'); // add class 'count' on the selection                  
*/


function type(d) {
    d.SouthCarolina = Number(d.SouthCarolina);
    d.NorthCarolina = Number(d.NorthCarolina);
    d.Tennessee = Number(d.Tennessee);
    d.Georgia = Number(d.Georgia);
    d.AllStates = Number(d.AllStates);
    return d;
}


function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}
var div = d3.select("#ttip").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

d3.json("data/data.json", type).then(data => {
    d3.selectAll("input")
        .on("change", update);

    function update(val = this.value) {
        // Join new data
        const path = svg.selectAll("path")
            .data(pie(data[val]));

        // Update existing arcs
        path.transition().duration(200).attrTween("d", arcTween);

        // Enter new arcs
        path.enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "6px")
            .each(function(d) { this._current = d; })
	.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(function(a){
		if(d.data.type == "speeding")
			return "Percentage Of Drivers Involved In Fatal Collisions Who Were Speeding: " + d.data.count
		else if(d.data.type == "alcoholImpaired")
			return "Percentage Of Drivers Involved In Fatal Collisions Who Were Alcohol-Impaired: " + d.data.count
		else if(d.data.type == "notDistracted")
			return "Percentage Of Drivers Involved In Fatal Collisions Who Were Not Distracted: " + d.data.count
		else if(d.data.type == "firstTimeCollision")
			return "Percentage Of Drivers Involved In Fatal Collisions Who Had Not Been Involved In Any Previous Accidents: " + d.data.count
		else
			return "Total number of collisions per billion miles in " + d.data.type +  ": " + d.data.count;
		})
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);

/**
        .on('mouseover', function(d) {  // when mouse enters div
	      
	 tooltip.select('.type').html(d.data.type); // set current label           
	 tooltip.select('.count').html('$' + d.data.count); // set current count                     
	 tooltip.style('display', 'block'); // set display                     
	}) 

	.on('mouseout', function() { // when mouse leaves div
    	tooltip.style('display', 'none'); // hide tooltip for that element
	})

	.on('mousemove', function(d) { // when mouse moves	
	    tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
        	   .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
**/

});

    }
    update("SouthCarolina");

});
