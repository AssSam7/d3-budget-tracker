const dims = {
  height: 300,
  width: 300,
  radius: 150,
};

const cent = {
  x: dims.width / 2 + 5,
  y: dims.height / 2 + 5,
};

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 150)
  .attr("height", dims.height + 150);

const graph = svg
  .append("g")
  .attr("transform", `translate(${cent.x}, ${cent.y})`);

const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.cost);

const arcPath = d3.arc().outerRadius(dims.radius).innerRadius(70);

// Ordinal Scale for colors
const color = d3.scaleOrdinal(d3["schemeSet2"]);

// Legends and Groups
const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${dims.width + 40}, 10)`);

const legend = d3.legendColor().shape("circle").scale(color).shapePadding(15);

// Update function
const update = (data) => {
  // Update and call legends
  legendGroup.call(legend);
  legendGroup.selectAll("text").attr("fill", "white");

  // Passing our names to ordinal scale domain
  color.domain(data.map((d) => d.name));

  // Join enhanced (pie) data to path elements
  const paths = graph.selectAll("path").data(pie(data));

  // Exit selection
  paths.exit().transition().duration(750).attrTween("d", arcTweenExit).remove();

  // Current DOM updates
  paths
    .attr("d", arcPath)
    .transition()
    .duration(750)
    .attrTween("d", arcTweenUpdate);

  // Adding elements from exit selection
  paths
    .enter()
    .append("path")
    .each(function (d) {
      this._current = d;
    })
    .attr("class", "arc")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", (d) => color(d.data.name))
    .transition()
    .duration(750)
    .attrTween("d", arcTweenEnter);

  // Add events
  graph
    .selectAll("path")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
};

// Global data
let data = [];

db.collection("budget-planner").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});

// Arc Enter Tween
const arcTweenEnter = (d) => {
  let i = d3.interpolate(d.endAngle, d.startAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// Arc Exit Tween
const arcTweenExit = (d) => {
  let i = d3.interpolate(d.startAngle, d.endAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// Arc Update Tween
function arcTweenUpdate(d) {
  // Interpolate between the two objects
  let i = d3.interpolate(this._current, d);

  // Update the current to the new values
  this._current = i(1);

  return function (t) {
    return arcPath(i(t));
  };
}

// Events handlers
const handleMouseOver = (d, i, n) => {
  d3.select(n[i])
    .transition("changeSliceColor")
    .duration(300)
    .attr("fill", "#fff");
};

const handleMouseOut = (d, i, n) => {
  d3.select(n[i])
    .transition("revertSliceColor")
    .duration(300)
    .attr("fill", color(d.data.name));
};
