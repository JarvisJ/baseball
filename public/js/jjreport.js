function JJReport(nationData, levelDefs,cssClass,metricList,reportName) {
    this.nationData = nationData;
    this.defs = levelDefs;
    this.cssClass = cssClass;
    this.metricList = metricList;
    this.reportName = reportName;
    this.populateDefs(1);
    this.click = this.toggleRow;
    this.$renderedReport = undefined;
}

// JJReport Prototype functions. Max start level is optional
JJReport.prototype.getDataTableRow = function(def, level,maxStartLevel) {
    var retVal = "";
    var that = this;
    var styleStr = "";
    var isOpenStr = "isOpen=\"T\"";
    
    if(maxStartLevel && level > maxStartLevel) {
       // def.visible = false;
        styleStr = " style=\" display :none;\" ";
        isOpenStr = "isOpen=\"F\"";
    }
    if(maxStartLevel && level == maxStartLevel) {
        //def.visible = false;
        isOpenStr = "isOpen=\"F\"";
    }
    def.childRecords.forEach(function(childDef) {
        retVal += that.getDataTableRow(childDef,level+1,maxStartLevel);
    });
    if(def.visible) {
        var mover = this.rowMouseOver? this.rowMouseOver + "('" + def.clink +"', " + level + ",this);" : "";
        var mout = this.rowMouseOut? this.rowMouseOut + "('" + def.clink +"', " + level + ",this);" : "";
        return retVal + "<tr id=\"l_" + level + def.clink + "\" class=\"level_" + level + " par_" + def.parent + "  " + def.clink + " rid_" + def.clink + " \" "+styleStr +"onClick=\"" + this.reportName + ".click('" + def.clink +"', " + level + ",this);\" onMouseOver=\"mOverHLightBtn(this); " + mover + " \" onMouseOut=\"mOutHLightBtn(this); " + mout + " \" "+ isOpenStr +" >" + def.header + this.getMetricColumns(def.value) + "</tr>";
    }
    else {
        return retVal;
    }
}

JJReport.prototype.getMetricColumns = function(record) {
    var retVal = "";
    this.metricList.forEach(function(metric) {
        retVal+= metric.format(record[metric.fieldName]) ;    
    });
    
    return retVal;
};

JJReport.prototype.toggleRow = function(clink,level,element) {
    var def = this.defs["level_" +level][clink];
    var that = this;

    if( element.getAttribute("isOpen") === "T" ) {    
        def.childRecords.forEach(function(childDef) {
            that.hideDef(childDef,level+1);
        });  
        element.setAttribute("isOpen","F"  );
    } 
    else {
        that.openRow(def.clink,level+1);    
        def.childRecords.forEach(function(childDef) {
            childDef.visible=true;
        });  
        element.setAttribute("isOpen","T"  );
    }
};

JJReport.prototype.openRow = function(parentLink,level) {

    var that = this;
    var $rowsToShow = $(".level_" + level + ".par_" + parentLink);
    $rowsToShow.show();
  //  $rowsToHide.attr("isOpen","T");  
};

JJReport.prototype.hideDef = function(def,level) {
    def.visible=false;
    var that = this;
    var $rowsToHide = $(".level_" + level + "." + def.clink);
    $rowsToHide.hide();
    $rowsToHide.attr("isOpen","F");
    
    def.childRecords.forEach(function(childDef) {
        that.hideDef(childDef,level+1);
    });    
};

JJReport.prototype.render = function(topColumnHeaders,maxStartLevel) {
    var retVal = "<table id=\"theTable\" class=\" " + this.cssClass + " sortable enableHierarchyToggling enableTermToggling\" border=\"1\" cellspacing=\"0\" cellpadding=\"2\" name='inputTbl' style='border: thin solid #F2F2F2;' >";
    
    var numCols = topColumnHeaders.length+metricList.length;
    retVal += "<tr style='vertical-align:bottom;' >"
    retVal += "<td colspan=" + numCols + " ><span onClick='expandLevel(1);' onMouseOver='mOverHLightSpan(this)' onMouseOut='mOutHLightSpan(this)'>(-) Collapse All</span>&nbsp;"
    retVal += "<span onClick='expandLevel(2);' onMouseOver='mOverHLightSpan(this)' onMouseOut='mOutHLightSpan(this)'>(+) Expand All</span>&nbsp;"
    retVal += "</td>"
    retVal += "</tr>";    
    
    retVal += "<tr  class='sortheader' headerCols='3'  style='vertical-align:bottom;' >"
    topColumnHeaders.forEach(function(header) {
     retVal += "<th style='text-align: center;' class='tbltxt_head'><a href='#' title='Sort this column'>" + header +"</a></td>";
    });   
    this.metricList.forEach(function(metric) {
     retVal += "<th style='text-align: center;' class='tbltxt_head'><a href='#' title='Sort this column'>" + metric.header +"</a></td>";
    });   
    retVal += "</tr>";
 
    retVal += this.getDataTableRow(this.defs["level_0"].topNode,0,maxStartLevel);

    this.$renderedReport = $( retVal +   "</table>")
    return this.$renderedReport;
};

JJReport.prototype.populateDefs = function( levelInt ) {
    if(!this.nationData["level_" + levelInt]) {
        return;
    }

       
   // defs["level_" +levelInt] = {};
    var hasParentLevel = true;
    var that = this;
    if(!this.defs["level_" + (levelInt-1)]) {
        this.defs["level_0"] = {};
        this.defs["level_0"].topNode = {};
        this.defs["level_0"].topNode.childRecords = [];
        this.defs["level_0"].topNode.value = "";
        this.defs["level_0"].topNode.header = [];
        this.defs["level_0"].topNode.clink = "";     
        this.defs["level_0"].topNode.visible = false;
        hasParentLevel = false;
    }

    this.nationData["level_" + levelInt].forEach(function(record) {
        var childLink = that.getChildLink( record, that.defs["level_" + levelInt].child);
        var header = that.getRecordHeader( record,  that.defs["level_" + levelInt].headerFormat);

        that.defs["level_" +levelInt][childLink] = {};
        that.defs["level_" +levelInt][childLink].clink = childLink;
        that.defs["level_" +levelInt][childLink].value =  record;
        that.defs["level_" +levelInt][childLink].childRecords = [];
        that.defs["level_" +levelInt][childLink].header = header;
        that.defs["level_" +levelInt][childLink].visible = true;
               
        if(!hasParentLevel) {
            that.defs["level_0"].topNode.childRecords.push(that.defs["level_" +levelInt][childLink]); 
                      
        }
        else {
            var parentLink = that.getChildLink( record, that.defs["level_" + (levelInt-1)].child);
            that.defs["level_" +levelInt][childLink].parent =  parentLink;
            that.defs["level_" + (levelInt-1)][parentLink].childRecords.push(that.defs["level_" +levelInt][childLink]);   
        }
    });     

    this.populateDefs( levelInt+1 );
};

JJReport.prototype.getChildLink = function( record, childFields) {
  var retStr = "";
  childFields.forEach(function(field) {
     retStr += "-" + record[field];
  });
  return retStr.replace(" ","-");
};

JJReport.prototype.getRecordHeader = function( record, headerFormat) {
  var retStr = "";
  var cnt = headerFormat.length;
  var colSpan = 4-cnt;
  var i = 1;
  headerFormat.forEach(function(header) {
     var headStr = header.format;
     var j = 0;
     header.fields.forEach(function(field) {
        headStr= headStr.replace("{" + j + "}",record[field]);
        j++;
     });
     var styleStr = "";
     if(header.style) {
        styleStr = "style=\"" + header.style + "\" "
     }
     
     retStr += "<td " + styleStr + " " + (cnt==i ? "colspan=" +colSpan : "") + " >" + headStr + "</td>";
     i++;
  });
  return retStr;
};

function ReportMetric(fieldName,header,format,pColorGrad5) {
    this.fieldName = fieldName;
    this.header = header;
    this.quintileField = undefined;
    this.minVal = undefined;
    this.maxVal = undefined;
    this.fivePctVal = undefined;
    this.ninetyFivePctVal = undefined;
    this.colorCode = false;
    this.colorGrad5 = pColorGrad5;
    
    this.twentyPctVal = undefined;
    this.fortyPctVal = undefined;    
    this.sixtyPctVal = undefined;        
    this.eightyPctVal = undefined;           
    
    this.lowValGreen = false;
    
    this.medianVal = undefined;   
 
    this.format =format==undefined? this.currencyFormat : format;
}

ReportMetric.prototype.currencyFormat = function (num) {
    num = isNaN(num) || num === '' || num === null ? 0.00 : num;
    var numStr = num.toString().trim();
    
    numAry = numStr.split(".");
    leftDec = "";
    for( i = numAry[0].length; i > 0; i=i-3) {
      leftDec =  numAry[0].slice(i-3<0?0:i-3,i) + (i == numAry[0].length?"":",") + leftDec;
    }
    
    var colorStr = this.colorCode ? " background-color : " + this.computeColor(num) + ";" : "";
    
    return "<td style=\" text-align : right; " + colorStr + " \"  >" + "$" + leftDec + "</td>";
}

ReportMetric.unitFormat = function (num) {
    num = isNaN(num) || num === '' || num === null ? 0.00 : num;
    var numStr = Math.floor(num.toString().trim()).toString().trim();
    
    numAry = numStr.split(".");
    leftDec = "";
    for( i = numAry[0].length; i > 0; i=i-3) {
      leftDec =  numAry[0].slice(i-3<0?0:i-3,i) + (i == numAry[0].length?"":",") + leftDec;
    }
  
    var colorStr = this.colorCode ? " background-color : " + this.computeColor(num) + ";" : "";
    
    return "<td style=\" text-align : right; " + colorStr + " \"  >" +  leftDec + "</td>";
}

ReportMetric.numberFormat = function (num) {
    num = isNaN(num) || num === '' || num === null ? 0.00 : num;
    var numStr =  num.toString().trim();
        
    numAry = numStr.split(".");
    leftDec = "";
    for( i = numAry[0].length; i > 0; i=i-3) {
      leftDec =  numAry[0].slice(i-3<0?0:i-3,i) + (i == numAry[0].length?"":",") + leftDec;
    }
    
    var colorStr = this.colorCode ? " background-color : " + this.computeColor(num) + ";" : "";
        
    rightDec = numAry[1] == undefined || numAry[1].length < 2 ? "" : "." + numAry[1];
    return "<td style=\" text-align : right; " + colorStr + " \"  >" +  leftDec + rightDec.substring(0,4) + "</td>";
}

ReportMetric.percentFormat = function (num) {
    num = isNaN(num) || num === '' || num === null ? 0.00 : num*100;
    var numStr =  num.toString().trim();
        
    numAry = numStr.split(".");
    leftDec = "";
    for( i = numAry[0].length; i > 0; i=i-3) {
      leftDec =  numAry[0].slice(i-3<0?0:i-3,i) + (i == numAry[0].length?"":",") + leftDec;
    }

    var colorStr = this.colorCode ? " background-color : " + this.computeColor(num/100) + ";" : "";    

    rightDec = numAry[1] == undefined || numAry[1].length < 2 ? "" : "." + numAry[1];
    return "<td style=\" text-align : right; " + colorStr + " \"  >" +  leftDec + rightDec.substr(0,2) + "%</td>";
}

ReportMetric.prototype.computeColor = function (pValue) {
       var metricVal = pValue;
       
       if(metricVal != undefined) {
               
            var slot = this.lowValGreen? 4 : 0; // Math.max(Math.floor((district[this.fieldName]-this.fivePctVal)/((this.ninetyFivePctVal-this.fivePctVal)/100)),0);
        
            if(metricVal > this.eightyPctVal) {
                slot=this.lowValGreen? 0 : 4;
            }
            else if(metricVal > this.sixtyPctVal) {
                slot=this.lowValGreen? 1 : 3;
            }
            else if(metricVal > this.fortyPctVal) {
                slot=this.lowValGreen? 2 : 2;
            } 
            else if(metricVal > this.twentyPctVal) {
                slot=this.lowValGreen? 3 : 1;
            }          
          //  colorGradRYG
         return this.colorGrad5[slot];        
       }
       
       return "white";
    
}

ReportMetric.prototype.computeStats = function (dataset) {
    var recNum = 0;
    var totalVal = 0;
    var maxVal = 0
    
    var valArray = [];

    var that = this;
    dataset.forEach(function(record) {
        if (record[that.fieldName] != undefined && !isNaN(record[that.fieldName])) {
            valArray.push(+(record[that.fieldName].toString().trim()));
        }
    });
    
    valArray.sort(function(a,b) { return a - b; });
    
    this.minVal = valArray[0];
    this.maxVal = valArray[valArray.length-1];
    this.fivePctVal = valArray[Math.floor(valArray.length*.05)];
    this.ninetyFivePctVal = valArray[Math.floor(valArray.length*.95)];
    this.medianVal = valArray[Math.floor(valArray.length*.5)];   
    
    this.twentyPctVal = valArray[Math.floor(valArray.length*.2)];
    this.fortyPctVal = valArray[Math.floor(valArray.length*.4)];
    this.sixtyPctVal = valArray[Math.floor(valArray.length*.6)];      
    this.eightyPctVal = valArray[Math.floor(valArray.length*.8)];      
    
}
