/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 16.666666666666668, "KoPercent": 83.33333333333333};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.16666666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get_Authors_by_ID"], "isController": false}, {"data": [0.0, 500, 1500, "Post_Authors"], "isController": false}, {"data": [1.0, 500, 1500, "Get_All_Author"], "isController": false}, {"data": [0.0, 500, 1500, "Update_Authors"], "isController": false}, {"data": [0.0, 500, 1500, "Delete_Author"], "isController": false}, {"data": [0.0, 500, 1500, "Get_AuthorsBook_by_BookID"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 180, 150, 83.33333333333333, 94.58888888888889, 0, 463, 0.0, 347.0, 356.79999999999995, 386.0499999999998, 3.0736655168880844, 38.85665512619105, 0.25613879307400705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get_Authors_by_ID", 30, 30, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.5174733501224688, 0.5786201034084245, 0.0], "isController": false}, {"data": ["Post_Authors", 30, 30, 100.0, 240.50000000000006, 230, 268, 239.0, 248.9, 265.8, 268.0, 0.5154462045977801, 1.4652967788907598, 0.15553991916085358], "isController": false}, {"data": ["Get_All_Author", 30, 0, 0.0, 327.03333333333336, 233, 463, 349.5, 363.9, 410.74999999999994, 463.0, 0.51440329218107, 35.25179639274691, 0.10197643389917696], "isController": false}, {"data": ["Update_Authors", 30, 30, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.517464424320828, 0.5786101228978008, 0.0], "isController": false}, {"data": ["Delete_Author", 30, 30, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.5174733501224688, 0.5786201034084245, 0.0], "isController": false}, {"data": ["Get_AuthorsBook_by_BookID", 30, 30, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.5174733501224688, 0.5816521738192983, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 79: http://qualityreleasewithterraform-appservice.azurewebsites.net/authors/books/${idBook}", 30, 20.0, 16.666666666666668], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 77: http://qualityreleasewithterraform-appservice.azurewebsites.net/api/Authors/${id}", 90, 60.0, 50.0], "isController": false}, {"data": ["404/Not Found", 30, 20.0, 16.666666666666668], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 180, 150, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 77: http://qualityreleasewithterraform-appservice.azurewebsites.net/api/Authors/${id}", 90, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 79: http://qualityreleasewithterraform-appservice.azurewebsites.net/authors/books/${idBook}", 30, "404/Not Found", 30, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get_Authors_by_ID", 30, 30, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 77: http://qualityreleasewithterraform-appservice.azurewebsites.net/api/Authors/${id}", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Post_Authors", 30, 30, "404/Not Found", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Update_Authors", 30, 30, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 77: http://qualityreleasewithterraform-appservice.azurewebsites.net/api/Authors/${id}", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete_Author", 30, 30, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 77: http://qualityreleasewithterraform-appservice.azurewebsites.net/api/Authors/${id}", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get_AuthorsBook_by_BookID", 30, 30, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 79: http://qualityreleasewithterraform-appservice.azurewebsites.net/authors/books/${idBook}", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
