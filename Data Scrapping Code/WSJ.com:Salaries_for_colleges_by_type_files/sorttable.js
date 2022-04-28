addEvent(window, "load", sortables_init);


//function addEvent(elm, evType, fn, useCapture)

var mySelectedColumn = '';
var SORT_COLUMN_INDEX;
var theFirstClick = 'false';

function presortedSetup(whichCol, whichTable){
changeContent(mySortColumn, whichTable);
killArrows(mySortColumn);

}

function sortables_init() {

    // Find all tables with class sortable and make them sortable
    if (!document.getElementsByTagName) return;
    tbls = document.getElementsByTagName("table");
    for (ti=0;ti<tbls.length;ti++) {
        thisTbl = tbls[ti];
        if (((' '+thisTbl.className+' ').indexOf("sortable") != -1) && (thisTbl.id)) {
            //initTable(thisTbl.id);
            ts_makeSortable(thisTbl);
        }
    }
//initSort(3, "mySortableTable");

//
    	$theSortSpan = document.getElementById(mySortTable).rows[0].cells[0].childNodes[0];
		if (isPresorted != "true"){
			ts_resortTable($theSortSpan,mySortColumn);
		}

  		killArrows(mySortColumn);
 		changeContent(mySortColumn, mySortTable);
		
    
}

function addAnArrow(whichCol, whichTable){
	//$theArrpwSpan = document.getElementById(whichTable).rows[0].cells[whichCol].childNodes[0].childNodes[1].childNodes[0].nodeValue = "keegan";
}
// 
// 
// function initSort(whichCol, whichTable) {
//   alert('initSort called! whichCol: '+whichCol+' whichTable:'+whichTable);
//    $theSortSpan = document.getElementById(whichTable).rows[0].cells[0].childNodes[0];
// //  alert($theSortSpan);
// 
//   // <span class="sortarrow">&nbsp;&nbsp;&nbsp;</span></a>';
//    
//   ts_resortTable($theSortSpan, whichCol);
//   changeContent(whichCol, whichTable);
// //	killArraows();
// }
// 

function firstClick(){
	 theFirstClick = "true";
}


function ts_makeSortable(table) {
    if (table.rows && table.rows.length > 0) {
        var firstRow = table.rows[0];
    }
    if (!firstRow) return;
    
    // We have a first row: assume it's the header, and make its contents clickable links
    for (var i=0;i<firstRow.cells.length;i++) {
        var cell = firstRow.cells[i];
         var txt = ts_getInnerText(cell);
        if(cell.id != 'noSort'){
     //   cell.innerHTML = '<a href="#" id="head"'+i+' class="sortheader" '+ 
      //  'onclick="firstClick(); ts_resortTable(this, '+i+');changeContent('+i+',this.parentNode.parentNode.parentNode.parentNode.id);  return false;">' + 
       // txt+'<span class="sortarrow">&nbsp;&nbsp;&nbsp;</span></a>';
        
        cell.innerHTML = '<a href="javascript: void(0);" id="head"'+i+' class="sortheader" '+ 
        'onclick="firstClick(); ts_resortTable(this, '+i+');changeContent('+i+',this.parentNode.parentNode.parentNode.parentNode.id);  return false;">' + 
        txt+'<span class="sortarrow">&nbsp;&nbsp;&nbsp;</span></a>';
        
        } else {
         cell.innerHTML = txt+'<span class="sortarrow">&nbsp;&nbsp;&nbsp;</span>';
        }
        
    }
    

    
}

function changeContent(whichCol, whichTable){

var theLengthOftheTable= document.getElementById(whichTable).rows.length;

for (var y = 1; y< document.getElementById(whichTable).rows.length; y++){
	document.getElementById(whichTable).rows[y].cells[mySortColumn].bgColor="#ffffff";
}

for (var z = 1; z< document.getElementById(whichTable).rows.length; z++){
	document.getElementById(whichTable).rows[z].cells[whichCol].bgColor="#ffffcc";
}
addAnArrow(whichCol, whichTable);
mySortColumn = whichCol;
}


function ts_getInnerText(el) {
	if (typeof el == "string") return el;
	if (typeof el == "undefined") { return el };
	if (el.innerText) return el.innerText;	//Not needed but it is faster
	var str = "";
	
	var cs = el.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		switch (cs[i].nodeType) {
			case 1: //ELEMENT_NODE
				str += ts_getInnerText(cs[i]);
				break;
			case 3:	//TEXT_NODE
				str += cs[i].nodeValue;
				break;
		}
	}
	return str;
}

function ts_resortTable(lnk,clid) {
//alert('SORT_COLUMN_INDEX: '+SORT_COLUMN_INDEX)
//	alert("lnk: "+lnk+" clid: "+clid);
    // get the span
    var span;
    for (var ci=0;ci<lnk.childNodes.length;ci++) {
        if (lnk.childNodes[ci].tagName && lnk.childNodes[ci].tagName.toLowerCase() == 'span') span = lnk.childNodes[ci];
    }
  //  alert("span="+span);
    //
    var spantext = ts_getInnerText(span);
    var td = lnk.parentNode;
    var column = clid || td.cellIndex;
    var table = getParent(td,'TABLE');
    
    var colDataType = ts_getInnerText(table.rows[0].cells[column].id)
   // alert('colDataType: '+colDataType)
    // Work out a type for the column
    if (table.rows.length <= 1) return;
    var itm = ts_getInnerText(table.rows[1].cells[column]);
    sortfn = ts_sort_caseinsensitive;
   /* 
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/) || itm == "N/A") sortfn = ts_sort_date;
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d$/) || itm == "N/A") sortfn = ts_sort_date;
    if (itm.match(/^[£$]/)) sortfn = ts_sort_currency;
    if (itm.match(/^[\d\.]+$/)) sortfn = ts_sort_numeric;
*/
   
   if (colDataType == "date") sortfn = ts_sort_date;
    if (colDataType == "currency") sortfn = ts_sort_currency;
    if (colDataType == "numbers") sortfn = ts_sort_numeric;
    if (colDataType == "text") sortfn = ts_sort_caseinsensitive;
    
    SORT_COLUMN_INDEX = column;
    var firstRow = new Array();
    var newRows = new Array();
    for (i=0;i<table.rows[0].length;i++) { firstRow[i] = table.rows[0][i]; }
    for (j=1;j<table.rows.length;j++) { newRows[j-1] = table.rows[j]; }

    newRows.sort(sortfn);

//firstClick == "true"
	//check to see if this is an intial sort. If it is, sort it based on the initSortDirection var

//THIS IS WHERE IT DECIDES WHICH WAY TO SORT


if (theFirstClick == 'false'){
//alert("first click has NOT happened yet")
		if (initSortDirection == 'down' ) {
			ARROW = '&nbsp;&nbsp;&darr;';
			newRows.sort(sortfn);
			
			span.setAttribute('sortdir','down');
		} else if (initSortDirection == 'up' ){
			ARROW = '&nbsp;&nbsp;&uarr;';
			span.setAttribute('sortdir','up');
			newRows.reverse();
		}
} else if (theFirstClick == "true"){
//alert("first click HAS happened")
 if (span.getAttribute("sortdir") == 'down' ) {
        ARROW = '&nbsp;&nbsp;&uarr;';
        newRows.reverse();
        span.setAttribute('sortdir','up');
    } else {
        ARROW = '&nbsp;&nbsp;&darr;';
        span.setAttribute('sortdir','down');
    }  

}



 
 
 
 
//if (firstClick == "true"){
   
//}
//END - THIS IS WHERE IT DECIDES WHICH WAY TO SORT  



    //initSortDirection == 'down'
    
    // We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
    // don't do sortbottom rows
    for (i=0;i<newRows.length;i++) { if (!newRows[i].className || (newRows[i].className && (newRows[i].className.indexOf('sortbottom') == -1))) table.tBodies[0].appendChild(newRows[i]);}
    // do sortbottom rows only
    for (i=0;i<newRows.length;i++) { if (newRows[i].className && (newRows[i].className.indexOf('sortbottom') != -1)) table.tBodies[0].appendChild(newRows[i]);}
    
    // Delete any other arrows there may be showing
    var allspans = document.getElementsByTagName("span");
    for (var ci=0;ci<allspans.length;ci++) {
        if (allspans[ci].className == 'sortarrow') {
            if (getParent(allspans[ci],"table") == getParent(lnk,"table")) { // in the same table as us?
                allspans[ci].innerHTML = '&nbsp;&nbsp;&nbsp;';
            }
        }
    }
        
    span.innerHTML = ARROW;
    mySelectedColumn = clid;
  
}

function killArrows(whichCol){

var theDownArrow = '&nbsp;&nbsp;&darr;';
var theUpArrow = '&nbsp;&nbsp;&uarr;';
var theArrowChoiceArray = new Array();
theArrowChoiceArray['up']= theUpArrow;
theArrowChoiceArray['down']= theDownArrow;


//initSortDirection
//alert('mySelectedColumn: '+mySelectedColumn)
 var allspans = document.getElementsByTagName("span");
 var arrowSpans= new Array();
 
    for (var ci=0;ci<allspans.length;ci++) {
        if (allspans[ci].className == 'sortarrow') {
       	 arrowSpans.push(ci);
            if (ci != SORT_COLUMN_INDEX) { // in the same table as us?
				 allspans[ci].innerHTML = '&nbsp;&nbsp;&nbsp;';
        	  }
     	  }
    }
    
   //  alert('arrowSpans: '+arrowSpans[0]+' '+arrowSpans[1]+' '+arrowSpans[2]+' '+arrowSpans[3]+' '+arrowSpans[4])
    
    var numberOfArrowSpans = arrowSpans.length;
  //  alert ('numberOfArrowSpans: '+numberOfArrowSpans)
    var theTargetSpan = arrowSpans[whichCol];
    
    
    
   // allspans[theTargetSpan].innerHTML=ARROW;
   var theArrowIs = allspans[theTargetSpan].getAttribute("sortdir");
   //   alert('theArrowIs: '+theArrowIs);
   
   
    			 if(isPresorted != "true" && theFirstClick == "false"){
					
					 if (allspans[theTargetSpan].getAttribute("sortdir") == 'down' && mySelectedColumn != 0) {
					   ARROW = '&nbsp;&nbsp;&uarr;';
						 allspans[theTargetSpan].setAttribute('sortdir','up');
					   allspans[theTargetSpan].innerHTML=ARROW;
					 
					  } else {
					   if (theFirstClick == "true"){
					    ARROW = '&nbsp;&nbsp;&darr;';
						allspans[theTargetSpan].setAttribute('sortdir','down');
					   allspans[theTargetSpan].innerHTML=ARROW;
					   } else {
					   allspans[theTargetSpan].innerHTML = theArrowChoiceArray[initSortDirection];
					 //   ARROW = '&nbsp;&nbsp;&darr;';
						//allspans[theTargetSpan].setAttribute('sortdir','down');
					   // allspans[theTargetSpan].innerHTML=ARROW;
					  }
					  
    					}
					
				} 
   
   
   
   
   
   
    
    
    
   
   // allspans[ci].innerHTML = '&nbsp;&nbsp;&nbsp;';
    }



function getParent(el, pTagName) {
	if (el == null) return null;
	else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())	// Gecko bug, supposed to be uppercase
		return el;
	else
		return getParent(el.parentNode, pTagName);
}

function ts_sort_date(a,b) {
    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
 /*
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa.length == 10) {
        dt1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
    } else {
        yr = aa.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
    }
    if (bb.length == 10) {
        dt2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
    } else {
        yr = bb.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
    }
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
 */

// document.getElementById('errors').innerHTML= aa+"<br>";
if (ts_getInnerText(a.cells[SORT_COLUMN_INDEX]) == "N/A"){
 aa = "01/01/1900";
} else {
  aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
}

if (ts_getInnerText(b.cells[SORT_COLUMN_INDEX]) == "N/A"){
 bb = "01/01/1900";
} else {
 bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
}
  
   
    

     if (aa.length == 10) {
        dt1 = aa.substr(6,4)+aa.substr(0,2)+aa.substr(3,2);
     
    } else {
        yr = aa.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt1 = yr+aa.substr(0,2)+aa.substr(3,2);
    }
    
    if (bb.length == 10) {
        dt2 = bb.substr(6,4)+bb.substr(0,2)+bb.substr(3,2);
   }  else {
        yr = bb.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt2 = yr+bb.substr(0,2)+bb.substr(3,2);
    }
    
 
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    

    return 1;

  
  
}

function ts_sort_currency(a,b) { 
if (ts_getInnerText(a.cells[SORT_COLUMN_INDEX]) == "N/A"  || ts_getInnerText(a.cells[SORT_COLUMN_INDEX]) == "-" ){
 aa = -9999999;
} else {
   aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
}
if (ts_getInnerText(b.cells[SORT_COLUMN_INDEX]) == "N/A"  || ts_getInnerText(b.cells[SORT_COLUMN_INDEX]) == "-"){
 bb = -9999999;
 } else { 
   bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
}
    return parseFloat(aa) - parseFloat(bb);
}

function ts_sort_numeric(a,b) { 

if (ts_getInnerText(a.cells[SORT_COLUMN_INDEX]) == "N/A" || ts_getInnerText(a.cells[SORT_COLUMN_INDEX]) == "-" ){
 aa = -9999999;
} else {
$stripAsterisks_aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).replace(/\**\*/,'');
aa = parseFloat($stripAsterisks_aa);
  
}

if (ts_getInnerText(b.cells[SORT_COLUMN_INDEX]) == "N/A"  || ts_getInnerText(b.cells[SORT_COLUMN_INDEX]) == "-" ){
 bb = -9999999;
} else {

//.replace(/\**\*/,"")

$stripAsterisks_bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).replace(/ \**\*/,'');

 bb =  parseFloat($stripAsterisks_bb); 
}

 //   aa = parseFloat(ts_getInnerText(a.cells[SORT_COLUMN_INDEX]));
//    if (isNaN(aa)) aa = 0;
 //   bb = parseFloat(ts_getInnerText(b.cells[SORT_COLUMN_INDEX])); 
 //   if (isNaN(bb)) bb = 0;
// if(aa.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)

 
    return aa-bb;
}

function ts_sort_caseinsensitive(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).toLowerCase();
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).toLowerCase();
    
    if (ts_getInnerText(a.cells[SORT_COLUMN_INDEX]) == "N/A"|| ts_getInnerText(a.cells[SORT_COLUMN_INDEX]) == "-" ){
 aa = "zzzzzzzzzz";
} else {
  aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).toLowerCase();
}

if (ts_getInnerText(b.cells[SORT_COLUMN_INDEX]) == "N/A"|| ts_getInnerText(b.cells[SORT_COLUMN_INDEX]) == "-" ){
 bb = "zzzzzzzzzz";
} else {
 bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).toLowerCase();
}
    
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}

function ts_sort_default(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}


function addEvent(elm, evType, fn, useCapture)
// addEvent and removeEvent
// cross-browser event handling for IE5+,  NS6 and Mozilla
// By Scott Andrew
{
  if (elm.addEventListener){
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent){
    var r = elm.attachEvent("on"+evType, fn);
    return r;
  } else {
   // alert("Handler could not be removed");
  }
} 
