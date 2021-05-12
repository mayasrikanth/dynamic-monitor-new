/* NO Longer hardcoding data! I am now loading .csv data dynamnically from github directory.*/


/* DOCUMENTATION: VARIABLS SET BY INDEX.HTML

// Graph 1 (confidence + forecasts)
var conf_low = []; // lower value of confidence interval 
var area = []; // difference between upper and lower confidence bounds 
var data_all = []; //concatenated true + forecasted observations (15 steps into future)

var data_pred = []; // forecasted observations using ARIMA. 
var data_true = []; // true observed frequencies. 

END OF VARS SET BY INDEX.HTML */



// function to sort the arrays 
function sortarrays() {
  //1) combine the arrays:
  var list = [];
  for (var j = 0; j < tf_words.length; j++) 
      list.push({'word': tf_words[j], 'dist': tf_dist[j], 'count': tf_freq[j]});

  //2) sort:
  list.sort(function(a, b) {
      return ((a.dist < b.dist) ? -1 : ((a.dist == b.dist) ? 0 : 1));
      //Sort could be modified to, for example, sort on the age 
      // if the name is the same.
  });
  //3) separate them back out:
  for (var k = 0; k < list.length; k++) {
      tf_words[k] = list[k].word;
      tf_dist[k] = list[k].dist;
      tf_freq[k] = list[k].count;
  }
}




// The idea is that the data .csv should already have all neighbors sorted by 
// distance. We are also not appending cosine distance, only log of raw count. 
function loadTableDynamic(word_arr, cos_dist, freq_arr){
  console.log("Entered loadTableDynamic!!!");
  var mybody = document.getElementsByTagName("body")[0];
  var mytable = document.getElementById("cosine-table");
  var mytablebody = document.getElementById("cosine-table-body"); // old table body

  // new table body (populate with updated entries). 
  var new_tbody = document.createElement('tbody');
    

  // clearing old entries if there are any.  
  while(mytablebody.hasChildNodes())
  {
     mytablebody.removeChild(mytablebody.firstChild);
  }

  n = word_arr.length -1;
  console.log(word_arr);
  params = 2; 
  for(var row = 0; row < n; row++) {
           mycurrent_row=document.createElement("tr");
           //for(var col = 0; col < 2; col++) {

              // Appending closest neighbor
               mycurrent_cell = document.createElement("td");
               //currenttext = document.createTextNode("cell is: " + row + col);
               currenttext = document.createTextNode(word_arr[row]);
               mycurrent_cell.appendChild(currenttext);
               mycurrent_row.appendChild(mycurrent_cell);
               mycurrent_cell.style.className = "active-row";
               
              // Appending corpus counts
               mycurrent_cell = document.createElement("td");
               //currenttext = document.createTextNode("cell is: " + row + col);
               currenttext = document.createTextNode(freq_arr[row]);
               mycurrent_cell.appendChild(currenttext);
               mycurrent_row.appendChild(mycurrent_cell);

               // Appending cosine distance
               mycurrent_cell = document.createElement("td");
               //currenttext = document.createTextNode("cell is: " + row + col);
               currenttext = document.createTextNode(cos_dist[row]);
               mycurrent_cell.appendChild(currenttext);
               mycurrent_row.appendChild(mycurrent_cell);



              // mycurrent_cell.style.className = "active-row";
           mytablebody.appendChild(mycurrent_row);
       }
  mytable.appendChild(mytablebody);
  //mytable.replaceChild(new_tbody, mytablebody);

  
}


function cosineDistanceTable(){
  sortarrays();
  var mybody = document.getElementsByTagName("body")[0];
  var mytable = document.getElementById("cosine-table");
  var mytablebody = document.getElementById("cosine-table-body");
  console.log("MADE IT");

  n = tf_words.length;
  word_arr = tf_words;
  dist_arr = tf_dist;
  freq_arr = tf_freq;

  console.log(dist_arr);
  params = 2; 
  for(var row = 0; row < n; row++) {
           mycurrent_row=document.createElement("tr");
           //for(var col = 0; col < 2; col++) {

              // Appending closest neighbor
               mycurrent_cell = document.createElement("td");
               //currenttext = document.createTextNode("cell is: " + row + col);
               currenttext = document.createTextNode(word_arr[row]);
               mycurrent_cell.appendChild(currenttext);
               mycurrent_row.appendChild(mycurrent_cell);
               mycurrent_cell.style.className = "active-row";


              // Appending cosine distance
               mycurrent_cell = document.createElement("td");
               //currenttext = document.createTextNode("cell is: " + row + col);
               currenttext = document.createTextNode(dist_arr[row]);
               mycurrent_cell.appendChild(currenttext);
               mycurrent_row.appendChild(mycurrent_cell);
               mycurrent_cell.style.className = "active-row";

               
              // Appending corpus counts
               mycurrent_cell = document.createElement("td");
               //currenttext = document.createTextNode("cell is: " + row + col);
               currenttext = document.createTextNode(freq_arr[row]);
               mycurrent_cell.appendChild(currenttext);
               mycurrent_row.appendChild(mycurrent_cell);
              // mycurrent_cell.style.className = "active-row";
           mytablebody.appendChild(mycurrent_row);
       }
  mytable.appendChild(mytablebody);
}



var mychart;
var allchart;
var tsnechart; 
var flag = false; 



// Function to dynamically load keywords from list in github.... 
/*function loadkeywords(keywords_ls) {
    alert("HI");
    console.log("HELLO from LoadKeywords");
    var sidebar = document.getElementById("side-navbar");
    for(var i=0; i < keywords_ls.length; i++) {
      // Create list element
      //var li = document.createElement("LI");  
      // Create keyword button 
      var kw_button = document.createElement("a");
      kw_button.className = "waves-effect waves-light #d500f9 purple accent-3 btn-small";
      // button sample: <a class="waves-effect waves-light teal btn-small" onclick="selectKeyword('#insurrection');" >
     // #insurrection</a> 
      var onclick_string = "selectKeyword(";
      onclick_string = onclick_string.concat(keywords_ls[i]);
      onclick_string = onclick_string.concat(");");
      kw_button.OnClick = onclick_string;


      sidebar.appendChild(kw_button);
      // Append keyword to list element
      //li.appendChild(kw_button);

      // Append list element to navbar 
      //sidebar.appendChild(li);
    }

}*/


// function to load Graph 2 (middle graph) of forecasts/true observations over longer horizon. 
function loadGraph2(data_true, data_pred, hash_name) {

   // Plotting all raw counts with all arima projections. 
  var option = {
        title: {
            text: hash_name + " Counts", //'#ToxicFeminism',
            boundaryGap: [0, '100%']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['True', 'Pred'], 
            right: 10             // legend is placed in middle-right
      },
    
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      toolbox: {
          // add later
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          name: 'Weeks',
          data: [  0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,
                13,  14,  15,  16,  17,  18,  19,  20,  21,  22,  23,  24,  25,
                26,  27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,
                39,  40,  41,  42,  43,  44,  45,  46,  47,  48,  49,  50,  51,
                52,  53,  54,  55,  56,  57,  58,  59,  60,  61,  62,  63,  64,
                65,  66,  67,  68,  69,  70,  71,  72,  73,  74,  75,  76,  77,
                78,  79],
      },
      yAxis: {
          type: 'value',
          name: 'Log  Counts'
      },
      dataZoom: [
        {   // This dataZoom component controls x-axis by dafault
            type: 'slider', // this dataZoom component is dataZoom component of slider
            start: 0,      // the left is located at 10%
            end: 100         // the right is located at 60%
        }],
      series: [
          {
              name: 'Pred',
              type: 'line',
              //stack: '总量',
              color: 'magenta',
              data: data_pred

          },
          {
              name: 'True',
              type: 'line',
              //stack: '总量',
              data: data_true 
          }
        ]
    };
    // use configuration item and data specified to show chart
    myChart.setOption(option, animation=true);
    myChart.setOption({
      grid: { 
      left: '5%'
       }
    });

}


// load leftmost Graph 1 showning 50 most recent observations, where last 15 are future projections. 
function loadGraph1(forecasts, conf_low, conf_area, hash_name) {

    weeks1 = [ 0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,
        13,  14,  15,  16,  17,  18,  19,  20,  21,  22,  23,  24,  25,
        26,  27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,
        39,  40,  41,  42,  43,  44,  45,  46,  47,  48,  49,  50,  51]; 

    // Plotting raw counts over all time 
   var option1 = {
           title: {
            text: hash_name + " Forecasts", 
            boundaryGap: ['0', '100%']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            label: 'Weeks',
            data: [ 0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,
        13,  14,  15,  16,  17,  18,  19,  20,  21,  22,  23,  24,  25,
        26,  27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,
        39,  40,  41,  42,  43,  44,  45,  46,  47,  48,  49,  50,  51],

        },
        yAxis: {
            min: 0,
            type: 'value',
            name: 'Log Counts'
        },

      // SERIES with projections and confidence intervals. 
        series: [
        { // Lower Confidence Interval
              name: 'L',
              type: 'line',
              data: conf_low,
              lineStyle: {
                  opacity: 0
              }, 
              stack: 'confidence-band',
              symbol: 'none'
        }, 

        {
          name: 'U',
          type: 'line',
          data: conf_area,
          lineStyle: {
              opacity: 0
          },
          areaStyle: {
              color: '#ccc'
          },
          stack: 'confidence-band',
          symbol: 'none'
      },
        { // ACTUAL SERIES
             name: 'Log Counts',
            type: 'line',
            data: forecasts // this is the actual data + projections for a given series 
              
        }],
            
       "visualMap": [{
          //show: true,
          show: false,
          type: 'piecewise',
          dimension: 0,
          "pieces": [{
              "gte": 35,  
              "lte": 50, 
              "label": "Forecast",
              "position": "top",
              "color":"turquoise"
          },  
      
        {

              "gte": 0,
              "lte": 35,//80,
              "label":  "True",
              "color": "magenta"
          }],  
      }]
          
          
    };

   allchart.setOption(option1);//, animation=true);


}



// load rightmost Graph 3 showing tsne plot of nearest neighbors. 
function loadGraph3(target_data, neighbors_data, hash_name) {
    console.log("printing target_data AGAIN:");
    console.log(target_data);

    var neighbor_labels = [];
    // manually extracting target and neighbor labels. 
    for(var i =0; i < neighbors_data.length; i++) {
        neighbor_labels.push(neighbors_data[i][2]); 
    }
    console.log(neighbor_labels); 

    option2 = {
      title: {
          text: 'closest neighbors' 
      },
      xAxis: {
          splitLine: {
              lineStyle: {
                  type: 'dashed'
              }
          }
      },
      yAxis: {
          splitLine: {
              lineStyle: {
                  type: 'dashed'
              }
          },
          scale: true
      },
      series: [{
          name: 'Neighbors',
          data: neighbors_data,
          type: 'scatter',
          symbolSize: function (param) {
               return 5*param[3]; /// 5e2;
         },
   
          label: {
                  show: true,
                  formatter: function (param) {
                      return param.value[2];
                  },
                  position: 'top'
          
          },
          itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
              }, {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
              }])
          }
      }, 

      {
          name: 'Target',
          data: target_data,
          type: 'scatter',
          symbolSize: function (param) {
              return 5*param[3];
          },
          
          label: {
              show: true,
              formatter: function (param) {
                      return param.value[2];
                  },
              position: 'top'
          },

          itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(25, 100, 150, 0.5)',
              shadowOffsetY: 5,
              color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(129, 227, 238)'
              }, {
                  offset: 1,
                  color: 'rgb(25, 183, 207)'
              }])
          }
      }]
    };

    tsnechart.setOption(option2);

}





function loaddata1(){
  console.log("entered loaddata1");
  if(flag == false) {
    tsnechart = echarts.init(document.getElementById('tsne'));

    // let tsnechart = echarts.getInstanceByDom(document.getElementById ('tsne')); 
    //  if (tsnechart == null) {// If not, it is initialized.
    //       tsnechart = echarts.init(document.getElementById('tsne'));
    //   }
    // tsnechart = echarts.init(document.getElementById('tsne'));
    console.log(document.getElementById('tsne'));
     //allchart = echarts.init(document.getElementById('all1'));
     //daychart = echarts.init(document.getElementById('day'));
     //hourchart = echarts.init(document.getElementById('hour'));
     //console.log(document.getElementById('all1'));
     flag = true; 
  }
} 


// Initiatize echarts on button press if they are not defined. 
function loaddata2(){
  if(flag == false) {
     myChart = echarts.init(document.getElementById('pred1'));
     allchart = echarts.init(document.getElementById('all1'));
     console.log("ENTERED loaddata2!!!");
     console.log(document.getElementById('all1'));
     tsnechart = echarts.init(document.getElementById('tsne'));
     console.log(document.getElementById('tsne'));
     flag = true; 
  }
} 


    
