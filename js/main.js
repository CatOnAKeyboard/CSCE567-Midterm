const width = 540;
const height = 540;
const radius = Math.min(width, height) / 2;

const svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
    "#e78ac3","#a6d854","#ffd92f"]);

const pie = d3.pie()
    .value(d => d.count)
    .sort(null);


const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

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
            .each(function(d) { this._current = d; });
    }

    update("SouthCarolina");
});
