//FIXME cleanup sign handling
//FIXME cleanup html from this code
function rNode() {
    this.kids = null;
    this.display = false;
    this.rowObj = null;
    this.rowId = '';
    this.open = false;
    this.level = 0;
}

var rows = new Array();
var topNode = new rNode();
var allCollapsed = true;
var hlBtnMap = new Object()
var deepestLevel = -1;
var txt = '';


function addRow(arr) {
    rows.push(arr);
}

function addNode(node,arr,id,level) {
    if(arr.length == 0) {
        //this actual row has been added, show it
        //node.display = true;
        return;
    }
    var nodeId = arr.shift();
    
    if(node.kids == null) {
        node.kids = new Object();
    }
    if(node.kids[nodeId] == undefined) {
        node.kids[nodeId] = new rNode();
    }
    id += '_' + nodeId;
    node.kids[nodeId].rowId = id
    node.kids[nodeId].rowObj = document.getElementById(id);
    node.kids[nodeId].level = level + 1;
    if((level+1) > deepestLevel) {
        deepestLevel = level + 1;
    }
    addNode(node.kids[nodeId],arr,id,level + 1);
}

function showRowId(obj) {
    if(obj != null) {
        //txt += obj.level + ' : ' + obj.rowId + '<br>';
        txt += obj.rowId + '<br>';
    }
}

function setDisplay(obj,disp) {
    if(obj != null) {
        var rObj = obj.rowObj;
        if(rObj != null) {
            rObj.style.display = disp; 
        }
    }
}

function showDisp(obj) {
    setDisplay(obj,'');
    obj.display = true;
}

function hideDisp(obj) {
    setDisplay(obj,'none');
    obj.display = false;
}

function surfTree(node,func) {
    func(node);
    if(node.kids == null) {
        return;
    }
    for(var o in node.kids) {
        surfTree(node.kids[o],func); 
    }
}

function surfTreeOF(node,objFunc) {
    objFunc.func(node,objFunc);
    if(node.kids == null) {
        return;
    }
    for(var o in node.kids) {
        surfTreeOF(node.kids[o],objFunc);
    }
}

function expand() {
    expandToLevel(2);
}

function expandSublines() {
    expandToLevel(20);
}

function showAboveLevel(obj,objFunc) {
    if(obj.level > objFunc.level) {
        setDisplay(obj,'none');
        obj.display = false;
    } else {
        setDisplay(obj,'');
        obj.display = true;
    }
    //do buttons' signs
    if(obj.level > (objFunc.level-1) && obj.kids != null) {
        //plus
        obj.display = true; 
        var btnId = obj.rowId.replace('r_','btn_');
        var bObj = document.getElementById(btnId);
        if(bObj != null && bObj.innerText.length > 0) {
            bObj.innerText = '+';
        }
    } else {
        //minus
        obj.display = false; 
        var btnId = obj.rowId.replace('r_','btn_');
        var bObj = document.getElementById(btnId);
        if(bObj != null && bObj.innerText.length > 0) {
            bObj.innerText = '-';
        }
    }
}

function expandToLevel(level) {
    var funcObj = new Object();
    funcObj.func = showAboveLevel
    funcObj.level = level;
    for(var i in topNode.kids) {
        surfTreeOF(topNode.kids[i],funcObj);
    }
}

function collapse() {
    for(var i in topNode.kids) {
        topNode.kids[i].display = true;
        //set sign
        var btnId = topNode.kids[i].rowId.replace('r_','btn_');
        var bObj = document.getElementById(btnId);
        if(bObj != null) {
            bObj.innerText = '+';
        }
        for(var j in topNode.kids[i].kids) {
            surfTree(topNode.kids[i].kids[j],hideDisp);
        }
    }
}

function clearSigns(obj,objFunc) {
    if(obj.kids == null) {
        var btnId = obj.rowId.replace('r_','btn_');
        var bObj = document.getElementById(btnId);
        if(bObj != null) {
            bObj.innerText = '';
        }
    }
}

function processRows() {
    //add all nodes
    for(var i = 0; i < rows.length; i++) {
        addNode(topNode,rows[i],'r',-1);
    }
    //if a section has no kids, don't give it a +/- sign
    var objFunc = new Object();
    objFunc.func = clearSigns;
    surfTreeOF(topNode,objFunc);
}

function toggleSection(arr) {
    curNode = topNode;
    for(var i = 0; i < arr.length; i++) {
        curNode = curNode.kids[arr[i]];
    }
    curNode.display = !curNode.display;

    var btnId = 'btn_' + arr[0];
    for(var i = 1; i < arr.length; i++) {
        btnId += '_' + arr[i];
    }
    try {
        var iTxt = document.getElementById(btnId).innerText;
        if(iTxt.length > 0) {
            if(curNode.display) {
                document.getElementById(btnId).innerText = '+';
            } else {
                document.getElementById(btnId).innerText = '-';
            }
        }
    } catch(error) {

    }

    var funcObj = new Object();
    funcObj.func = curNode.display?hideDisp:showAboveLevel;
    funcObj.level = curNode.level+1;

    //get length
    var cnt = 0;
    for(var i in curNode.kids) {
        cnt++;
    }
    if(cnt == 0) { return; }

    //basically, don't show the subtotal for a section
    //if it is the only one ... skip to the members below
    //unless it is the very bottom section
    if(cnt == 1 && deepestLevel > curNode.kids[0].level && deepestLevel-1 > curNode.kids[0].level) { //FIXME this will fix a subline being expanded //&& curNode.level != 1) {
       curNode = curNode.kids[0];
       funcObj.level++;
    } 
    for(var i in curNode.kids) {
        surfTreeOF(curNode.kids[i],funcObj);
    }
}

//DISPLAY 

function mOverHLightBtn(obj) {
    hlBtnMap[obj.id] = obj.style.backgroundColor;
    obj.style.backgroundColor = '#FFFFB5'
    obj.style.cursor = 'pointer';
}

function mOutHLightBtn(obj) {
    obj.style.backgroundColor = hlBtnMap[obj.id] 
 //   obj.parentNode.style.borderColor = ''
}

function mOverHLightSpan(obj) {
    obj.style.color = 'red'
    obj.style.cursor = 'pointer';
}

function mOutHLightSpan(obj) {
    obj.style.color = 'black'
}

function gatherHTML(obj,objFunc) {
    if(obj == null) {
        return;
    }
    var rObj = obj.rowObj;
    if(rObj == null) {
        return;
    }

    if(rObj.style.display == '') {
        objFunc.html += '<tr>' + rObj.innerHTML + '</tr>';
    }
}

function getAllHTML(numberOfHeaderRows) {
    var funcObj = new Object();
    funcObj.func = gatherHTML;
    funcObj.html = '';
    surfTreeOF(topNode,funcObj);
    
    var rTxt = funcObj.html;

    //get the table header
    var hTxt = ''
    for(var i = 1; i < numberOfHeaderRows+1; i++) {
        hTxt += '<tr>' + document.getElementById('inputTbl').rows[i].innerHTML + '</tr>';
    }

    var allRows = document.getElementById('inputTbl').rows
    var lastRow = '<tr>' + allRows[allRows.length-1].innerHTML + '</tr>';

    var pageTxt = '<table border=1 >' + hTxt + rTxt + lastRow + '</table>'

    var outObj = document.getElementById('outputTbl');
    outObj.value = pageTxt
   // alert(pageTxt)

    if ($('#excelDLTbl').length == 0) {
        $('#download').val("true");
        $('#Form1').submit();
    }
    else {
        $('#excelDLTbl')[0].submit();
    }

//    if (document.forms("excelDLTbl") == null) {
//        document.forms("Form1").download.value = "true";
//        document.forms("Form1").submit();
//    }
//    else {
//        document.forms("excelDLTbl").submit();
//    }
}

function getAllHTMLNew(selMonth) {
    //get the table header
    var hTxt = ''
    var elem = document.getElementsByTagName("table");
    var arr = new Array();
     for(i = 0,iarr = 0; i < elem.length; i++) {
          att = elem[i].getAttribute("name");
          if(att == "inputTbl") {
               arr[iarr] = elem[i];
               iarr++;
          }
     }
    
    for(var j = 0; j < arr.length; j++) {    
        for(var i = 1; i < arr[j].rows.length; i++) {
            if ( arr[j].rows[i].style.display != 'none') 
            {
                //hTxt += '<tr bgcolor="' + arr[j].rows[i].currentStyle.backgroundColor + '" >' + arr[j].rows[i].innerHTML + '</tr>';
                hTxt += '<tr bgcolor="' + $(arr[j].rows[i]).css('backgroundColor') + '" >' + arr[j].rows[i].innerHTML + '</tr>';
            }
        }
    }
    
    var pageTxt = '<table border=1 >' + hTxt + '</table>'

    var outObj = document.getElementById('outputTbl');
    outObj.value = pageTxt
   // alert(pageTxt)

    if ( $('#excelDLTbl').length == 0) {
        $('#download').val("true");
        if(selMonth) {
            $('#MonthSelect').val(selMonth);
        }        
        $('#Form1').submit();

    }
    else {
        $('#excelDLTbl')[0].submit();
    }
       
//    if( document.forms("excelDLTbl") == null) {
//        document.forms("Form1").download.value = "true";
//        document.forms("Form1").submit();
//    }
//    else {
//        document.forms("excelDLTbl").submit();
//    }
}

function getAllHTMLStatic() {
    
    var allRows = document.getElementById('inputTbl').rows
    var allRows2 = document.getElementById('ndiCFI2009Table_aspCFI2009Grid').rows
    var allRows3 = document.getElementById('ndiCFI2009Table_aspDealerSummaryTable').rows
    var allTxt = '';
    var allTxt2 = '';
    var allTxt3 = '';
    
    for (var i = 0; i < allRows.length; i++) {
        allTxt += '<tr>' + allRows[i].innerHTML + '</tr>';
    }
    for (var i = 0; i < allRows2.length; i++) {
        allTxt2 += '<tr>' + allRows2[i].innerHTML + '</tr>';
    }
    for (var i = 0; i < allRows3.length; i++) {
        allTxt3 += '<tr>' + allRows3[i].innerHTML + '</tr>';
    }

    var pageTxt = '<table border=1 >' + allTxt2 + '</table>';
    var pageTxt2 = '<br><table border=1 >' + allTxt + '</table>';
    var pageTxt3 = '<table border=1 >' + allTxt3 + '</table><br>';

    var pageOut = '<table border=1 ><tr><td>' + allTxt3 + '</td></tr></table>';
    pageOut += '</div><div><table border=1 ><tr><td colspan=12>';
    pageOut += '<table border=1 ><tr><td>' + allTxt2 + '</td></tr>';
    pageOut += '</div><div><table border=1 ><tr><td colspan=12>';
    pageOut += '<tr><td>' + allTxt + '</td></tr></table>';
    
    var outObj = document.getElementById('outputTbl');
    outObj.value = pageOut
   // alert(pageTxt)
    //document.excelDLTbl.submit();

    if ($('#excelDLTbl').length > 0) {
        $('#excelDLTbl')[0].submit();
    }
}

var totalCnt = 0;
var curBegin = 0;
var curEnd = 0;
var CUST_LIST_ROWS = 25;
var HIDE_LBL = 'Hide All';
var SHOW_LBL = 'Show All';

function openCloseCustomerList(cnt) {
    totalCnt = cnt;
    
    if(cnt > CUST_LIST_ROWS) {
        document.getElementById('custListShowAllFooter').innerText = SHOW_LBL;
		//show first CUST_LIST_ROWS
        curBegin = 0;
        curEnd = CUST_LIST_ROWS;
    }
    for(var i = 0; i < totalCnt; i++) {
        if(i > CUST_LIST_ROWS) {
            document.getElementById('custListRow' + i).style.display = 'none';
        } else {
            document.getElementById('custListRow' + i).style.display = '';
        }
    }
    var obj = document.getElementById('customerListBody');
    obj.style.display = obj.style.display == 'none'? '' : 'none';
    var bobj = document.getElementById('customerListBodyBtn');
    bobj.innerText = bobj.innerText == '+'? '-' : '+';  
    if(cnt > CUST_LIST_ROWS) {
		var topNextObj = document.getElementById('custListNextTop');
        if(bobj.innerText == '+') {
            topNextObj.innerText = '';    
        } else {
            topNextObj.innerText = 'Next';
        }
		document.getElementById('custListNextFooter').innerText = 'Next';
		document.getElementById('custListPrevFooter').innerText = '';
		document.getElementById('custListPrevTop').innerText = '';

	    //set status
		document.getElementById('custListStatus').innerText = curBegin + '-' + curEnd;
		document.getElementById('custListStatusFooter').innerText = curBegin + '-' + curEnd;
	}
}

function showCustNext() {
    //hide all
    for(var i = curBegin; i < curEnd; i++) {
        document.getElementById('custListRow' + i).style.display = 'none';
    }

    //show selected rows
    var rowsToGo = totalCnt-curEnd;
    var pObj = document.getElementById('custListPrevFooter');
    pObj.innerText = 'Previous';
    var ptObj = document.getElementById('custListPrevTop');
    ptObj.innerText = 'Previous';
    var nObj = document.getElementById('custListNextFooter');
    var ntObj = document.getElementById('custListNextTop');
    if(rowsToGo > CUST_LIST_ROWS) {
        curBegin += CUST_LIST_ROWS; 
        curEnd += CUST_LIST_ROWS;
        nObj.innerText = 'Next';
        ntObj.innerText = 'Next';
    } 
    if(rowsToGo <= CUST_LIST_ROWS) {
        curBegin += CUST_LIST_ROWS; 
        curEnd = totalCnt;
        nObj.innerText = '';
        ntObj.innerText = '';
    }

    for(var i = curBegin; i < curEnd; i++) {
        document.getElementById('custListRow' + i).style.display = '';
    }
    //set status
    document.getElementById('custListStatus').innerText = curBegin + '-' + curEnd;
    document.getElementById('custListStatusFooter').innerText = curBegin + '-' + curEnd;
    
}

function showCustPrev() {
    //hide all
    for(var i = curBegin; i < curEnd; i++) {
        document.getElementById('custListRow' + i).style.display = 'none';
    }

    //show selected rows
    var rowsToGo = curBegin;
    var nObj = document.getElementById('custListNextFooter');
    nObj.innerText = 'Next';
    var ntObj = document.getElementById('custListNextTop');
    ntObj.innerText = 'Next';
    var pObj = document.getElementById('custListPrevFooter');
    var ptObj = document.getElementById('custListPrevTop');
    if(rowsToGo > CUST_LIST_ROWS) {
        curBegin -= CUST_LIST_ROWS; 
        curEnd = curBegin + CUST_LIST_ROWS;
        pObj.innerText = 'Previous';
        ptObj.innerText = 'Previous';
    } 
    if(rowsToGo <= CUST_LIST_ROWS) {
        curBegin = 0; 
        curEnd = CUST_LIST_ROWS; 
        pObj.innerText = '';
        ptObj.innerText = '';
    }

    for(var i = curBegin; i < curEnd; i++) {
        document.getElementById('custListRow' + i).style.display = '';
    }
    //set status
    document.getElementById('custListStatus').innerText = curBegin + '-' + curEnd;
    document.getElementById('custListStatusFooter').innerText = curBegin + '-' + curEnd;
}

function showCustAll() {

    var sObj = document.getElementById('custListShowAllFooter');
    var curTxt = sObj.innerText;
    if(curTxt == SHOW_LBL) {
        sObj.innerText = HIDE_LBL;
        var pObj = document.getElementById('custListPrevFooter');
        pObj.innerText = '';
        var ptObj = document.getElementById('custListPrevTop');
        ptObj.innerText = '';
        var nObj = document.getElementById('custListNextFooter');
        nObj.innerText = '';
        var ntObj = document.getElementById('custListNextTop');
        ntObj.innerText = '';
        for(var i = 0; i < totalCnt; i++) {
            document.getElementById('custListRow' + i).style.display = '';
        }
        //set status
        curBegin = 0; 
        curEnd = totalCnt
        document.getElementById('custListStatus').innerText = curBegin + '-' + curEnd;
        document.getElementById('custListStatusFooter').innerText = curBegin + '-' + curEnd;
    } else {
        sObj.innerText = SHOW_LBL;
        openCloseCustomerList(totalCnt);
    }
    
}
