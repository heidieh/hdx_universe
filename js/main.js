var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

//var attractForce = d3.forceManyBody().strength(20).distanceMax(40).distanceMin(10);
var repelForce = d3.forceManyBody().strength(-10).distanceMax(50).distanceMin(50);

//var simulation = d3.forceSimulation(nodeData).alphaDecay(0.03).force("attractForce",attractForce).force("repelForce",repelForce);


var simulation = d3.forceSimulation()
    //.force("attractForce", attractForce)
    .force("repelForce", repelForce)
    .force("charge", d3.forceManyBody().strength(-2))  //strength - distance to sibling nodes
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(50))  //distance - length of edge
    .force("center", d3.forceCenter(width/2, height/2))    //transpose to center of svg
    //.force("x", d3.forceX(width/2))         //create an x-positioning force
    //.force("y", d3.forceY(height/2))        //create a y-positioning force
    .on("tick", ticked);    

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("data/data.json", function(error, graph) {
  if (error) console.log(error); //throw error;
  console.log(graph);

  simulation.nodes(graph.nodes);
  simulation.force("link").links(graph.links);

  link = link
    .data(graph.links)
    .enter().append("line")
      .attr("class", "link");

  node = node
    .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 6)
      .style("fill", function(d) { 
        if (d.type=='Organisation') {return 'blue'}
        else if (d.type=='Dataset') {return 'orange'}
      });

  node.append("title")
      .text(function(d) { return d.name; });
});

function ticked() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}