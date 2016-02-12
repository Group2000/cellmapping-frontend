//donut.js
angular.module('celllogger')
.directive('donutChart',function(){
	function link(scope, element, attr){
		 
		var color = d3.scale.category20();
		
		var data = scope.data;
		var total;
		var width = 200;
		var height = 400;
		var pieheight=220;
		var min = Math.min(width, height);
		var svg = d3.select(element[0]).append('svg');
		var pie = d3.layout.pie()
			.value(function(d) { return d.total; })
			.sort(null);
		var arc = d3.svg.arc()
			.outerRadius(min / 2 * 0.9)
			.innerRadius(min / 2 * 0.5)


		svg.attr({width: width, height: height});
		var g = svg.append('g')
		// center the donut chart
			.attr('transform', 'translate(' + width / 2 + ',' + pieheight /2 + ')');


		var textTop = svg.append("text")
		    .attr("dy", ".350em")
		    .style("text-anchor", "middle")
		    .attr("class", "textTop")
		    .text('')
		    .attr("y", 10)
		    .attr("x",min/2);
		var textCenter = svg.append("text")
		    .attr("dy", ".350em")
		    .style("text-anchor", "middle")
		    .attr("class", "textBottom")
		    .text('')
		    .attr("y", (height/4 + 10))
		    .attr("x",(width/2));
		

		var arcs=g.selectAll('path');


   		var legend = svg.selectAll('g')
        .data(data)
        .enter()
      	.append('g')
        	.attr('class', 'legend');


		scope.$watch('data', function(data){
			var values=data.values
			if(!values){ return; }
			total = d3.sum(values, function(d) {
    			return d.total;
			});
			textCenter.text("TOTAL " + total);
			textTop.text(data.title);

			color=setColors(data.colors);

			arcs = arcs.data(pie(values));
			//if(legend){
				
			legend.remove();
			svg.selectAll('rect').remove();
			legend = svg.selectAll('g')
        	.data(data)
        	.enter()
      		.append('g')
        		.attr('class', 'legend');
        	//}
			legend=legend.data(values);
			arcs.exit().remove();

			//add paths
			arcs.enter().append('path')
				.style('stroke', 'white')
				.style('stroke-width',2)
				.attr('fill', function(d, i){ return color(i) })
				.attr("class", "slice")
					.on("mouseover", function(d,i) {
			                d3.select(this).transition().duration(200)
			                	.style({'stroke-opacity':1,'stroke':'#FFF','stroke-width':6})
			                 textCenter.text(d.data._id + ": " +d.value);

			            })
			            .on("mouseout", function(d) {
			            	d3.select(this).transition().duration(200)
			                	.style({'stroke-opacity':1,'stroke':'#FFF','stroke-width':2})
			                textCenter.text("TOTAL " + total);
			            });
			//add paths
			arcs.attr('d', arc);

			legend.enter().append('rect')
		        .attr('x', 0)
		        .attr('y', function(d, i){ return (height/2 +10 + i *  20);})
		        .attr('width', 10)
		        .attr('height', 10)
		        .style('fill', function(d,i) { 
		          return color(i);
		        });

		    legend.enter().append('text')
		        .attr('x', 20)
		        .attr('y', function(d, i){ return (height/2 +10 + i *  20) + 9;})
		        .text(function(d){ 
		        	return (d._id + ": " +d.total); 
		        });



        }, true);

	}
	return {
		link: link,
		restrict: 'E',
		scope: { data: '=' }
	}
})

function setColors(value){
	var color=d3.scale.category20();
	switch(value) {
		case "10":
			color=d3.scale.category10();
			break;
		case "20":
			color=d3.scale.category20();
			break;
		case "20b":
			color=d3.scale.category20b();
			break;
		case "20c":
			color=d3.scale.category20c();
			break;
		case "blues":
			color=d3.scale.linear()
			.domain([0,6,1])
			.range(['royalblue','lightblue']);
			break;
		case "reds":
			color=d3.scale.linear()
			.domain([0,2,1])
			.range(['darkred','indianred']);
			break;
		case "greens":
			color=d3.scale.linear()
			.domain([0,6,1])
			.range(['darkgreen','palegreen']);
			break;


	};
	return color
}