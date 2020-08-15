//visualization of ordered matrix
var margin = {
    top: 30,
    left: 30,
    bottom: 30,
    right: 30
}

var labelText = [
['1a', '1b', '2a', '2b', '3a', '3b','4a', '4b','5a','5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b','10a', '10b', '11a', '11b', '12a', '12b', '13a', '13b', '14a', '14b', '15a', '15b',
'16','17','18', '19', '20', '21', '22', '23','24', '25', '26', '27', '28', '29','30', '31', '32', '33', '34', '35','36', '37', '38', '39', '40'],

['node and flow symbol - 1D', 'node and flow symbol - 2D', 'node and flow symbol - 3D', 'display space - 1D', 'display space - 2D', 'display space - 3D',
'space related', 'time related', 'theme related', 'hybrid' , 'node OD-disjoint', 'node OD-joint', 'node O-paired', 'node D-paired',
'flow linking', 'flow atached', 'flow intersected', 'directed', 'undirected'],

['node and flow symbol', 'display space', 'spatial semantics of display', 'representation of nodes', 'representation of flows', 'direction of flow']
]

function initVis() {


    $('#myTabs a').click(function(e) {
        console.log(e)
        e.preventDefault()
        $(this).tab('show')
    })

    var matrixArr = [1, 2, 3];


    matrixArr.forEach(function(d) {

        var id_canvas = "#matrix" + d;
        var methods = ["ward", "single", "average", "complete"];

        methods.forEach(function(method) {
            initVis_method(method, id_canvas, d)
        })

    })

}

function initVis_method(methodName, id_canvas, index) {
    //console.log(index)


    var divID = methodName + index;

    $(id_canvas).append("<div id='" + divID + "'></div>");

    var pathstr_index = "./data/dis_index" + index + "_" + methodName + ".csv";
    var pathstr_matrix = "./data/dis_matrix" + index + "_" + methodName + ".csv";

    var width = $(id_canvas).width();

    d3.text(pathstr_matrix)
        .then(function(data) {

            var matrix = d3.csvParseRows(data).map(function(row) {
                return row.map(function(d) {
                    return parseFloat(d)
                })
            })

            var maxValue = d3.max(matrix.map(function(row) {
                return d3.max(row.filter(function(cell){
                    return cell!==0
                }))
            }))

            var minValue = d3.min(matrix.map(function(row) {
                return d3.min(row.filter(function(cell){
                    return cell !==0
                }))
            }))

            console.log(minValue, maxValue, ' - ', id_canvas, methodName)

            matrix = matrix.map(function(d,i){
                return d.map(function(item, j){
                    return i==j? 1: item
                })
            })

            var scale = d3.scaleLinear()
                .domain([minValue, maxValue])
                .range( [0,1]);

            var cellWidth = 13;
            var matrixWidth = matrix.length * cellWidth;

            var height = matrixWidth + margin.top + margin.bottom;

            var matrixSvg = d3.select("#" + divID)
                .append("svg")
                .attr("width", width)
                .attr("height", height)

            var rows = matrixSvg.selectAll(".rows")
                .data(matrix).enter().append("g")
                .attr("class", "rows")
                .attr("transform", function(d, i) {
                    return "translate(" + (width / 2 - matrixWidth / 2) + "," + (i * cellWidth + margin.top) + ")";
                });

            rows.each(function(d, i) {
                d3.select(this).selectAll('rect')
                    .data(d)
                    .enter()
                    .append('rect')
                    .attr('fill', function(d, i) {

                        //console.log(scale(d))
                        //return d3.interpolateRdBu(scale(d))
                        //console.log(d)
                        //return d3.interpolateReds(d)
                        return d3.interpolateRdBu(d)
                        //return colorScale(d)
                    })
                    .attr('width', 0.9 * cellWidth)
                    .attr('height', 0.9 * cellWidth)
                    .attr('x', function(k, j) {
                        return j * cellWidth
                    })
            });

            d3.text(pathstr_index)
                .then(function(data) {

                    var indexArr = d3.csvParseRows(data).map(function(row) {
                        return parseFloat(row[0])
                    })

                    var labelX = matrixSvg.append('g')
                        .attr("transform", "translate(" + (width / 2 - matrixWidth / 2) + "," + (cellWidth + matrixWidth + margin.top) + ")")
                        .selectAll('text').data(indexArr)
                        .enter()
                        .append('text')
                        .attr("class", "labelX")
                        .style("text-anchor", "middle")
                        //.attr("transform", "rotate(90)")
                        .text(function(d) {
                            //console.log(d)
                            return d + 1 
                        })
                        .attr("x", function(d, i) {
                            return i * cellWidth + 0.5 * cellWidth
                        })

                    //.attr('y', function(d, i) { return -i * cellWidth })

                    var labelsY = matrixSvg.append('g')
                        .attr("transform", "translate(" + (width / 2 + matrixWidth / 2) + "," + (cellWidth + margin.top) + ")")
                        .selectAll('text').data(indexArr)
                        .enter().append('text')
                        .attr("class", "labelY")
                        .attr("Vertical", true)
                        .text(function(d) {
                            return d + 1 + "  - " + labelText[index-1][d]
                        })
                        .attr('x', cellWidth)
                        .attr('y', function(d, i) {
                            return i * cellWidth - 0.4 * cellWidth
                        });


                })

        });

}