
/* toggles a row in the JJReport */
function toggleRow(caller,tableID) {
    var tables = [document.getElementById(tableID)];
    var oCaller = caller;
    
    // get the callers row id class name (typically rid_XX_XX...)
    var callerClasses = oCaller.className;
    var callerRowIDClass;
    if(callerClasses != null){
        callerClasses = callerClasses.split(" ");
        for( j=0; j < callerClasses.length; j++){
            if(callerClasses[j].indexOf("rid_") === 0){
                callerRowIDClass =callerClasses[j];
                break;
            }
        }
    }

    // determine if the level clicked is open or closed
    var isOpen = true;
    if (oCaller.getAttribute("isOpen") == "false") {
        isOpen = false;
    }
    
    oCaller.setAttribute("isOpen",(isOpen ? "false" : "true"));
    
    // count the number of underscores in the row id. This determines the level depth.
    var numUnderscores = callerRowIDClass.split("_").length;
    
    var foundChild = false;
    for( var i=0; i < tables.length; i++ ) {
          if (tables[i].className.search(/\benableHierarchyToggling\b/) != -1) 
          {
                var els =tables[i].getElementsByTagName("tr");
                for( var j=0; j < els.length; j++ ) {
                        var elClasses = els[j].className;
                        if(elClasses != null){
                            elClasses = elClasses.split(" ");
                            for( k=0; k < elClasses.length; k++){
                                if(elClasses[k].indexOf(callerRowIDClass) === 0 && elClasses[k] != callerRowIDClass){
                                    if ( isOpen ) {
		                                els[j].style.display = 'none';
                                        els[j].setAttribute("isOpen", "false" );
	                                }
	                                else {
	                                    // only show one level deep
	                                    if ((elClasses[k].split("_").length-1) == numUnderscores) {
		                                    els[j].style.display = '';		                               	                                
		                                    els[j].setAttribute("isOpen", "false" );
        	                                foundChild = true;
                                        }
	                                }
                                    break;
                                }
                            }
                        }
                }
          }
    }
    
    // if row does not have a child look for next level. This is to handle the fact that ACD does not have divisions (Regions will then display the zones).
    if ( !foundChild ) {
        for( var i=0; i < tables.length; i++ ) {
              if (tables[i].className.search(/\benableHierarchyToggling\b/) != -1) 
              {
                    var els =tables[i].getElementsByTagName("tr");
                    for( var j=0; j < els.length; j++ ) {
                            var elClasses = els[j].className;
                            if(elClasses != null){
                                elClasses = elClasses.split(" ");
                                for( k=0; k < elClasses.length; k++){
                                    if(elClasses[k].indexOf(callerRowIDClass) === 0 && elClasses[k] != callerRowIDClass){
                                        if ( isOpen ) {
		                                    els[j].style.display = 'none';
                                            els[j].setAttribute("isOpen", "false" );
	                                    }
	                                    else {
	                                        // only show one level deep
	                                        if ((elClasses[k].split("_").length-2) == numUnderscores) {
		                                        els[j].style.display = '';		                               	                                
		                                        els[j].setAttribute("isOpen", "false" );
                                                foundChild = true;
                                            }
	                                    }
	                                   
                                        break;
                                    }
                                }
                            }
                    }
              }
        }        
    }
    
//    if (isOpen) 
//    {
//        oCaller.innerHTML = "Show Terminated Customers"
//    }
//    else
//    {
//        oCaller.innerHTML = "Hide Terminated Customers"
//    }
 }
 
function expandLevel(levelNum,tableID) {
    // note: using array here is a hack so that I don't need to modify a bunch of code.
    var tables = [document.getElementById(tableID)];
   
    
    for( var i=0; i < tables.length; i++ ) {
          if (tables[i].className.search(/\benableHierarchyToggling\b/) != -1) 
          {
                var els =tables[i].getElementsByTagName("tr");
                for( var j=0; j < els.length; j++ ) {
                        var elClasses = els[j].className;
                        if(elClasses != null){
                            elClasses = elClasses.split(" ");
                            for( k=0; k < elClasses.length; k++){
                                if(elClasses[k].indexOf("level_") === 0 ){
                                    elLevelNum = elClasses[k].substr(6,elClasses[k].length);
                                    if ( elLevelNum > levelNum ) {
		                                els[j].style.display = 'none';
                                        els[j].setAttribute("isOpen", "false" );
	                                }
	                                else {
	                                    els[j].style.display = '';		  
	                                    if( elLevelNum == levelNum ) {
	                                        els[j].setAttribute("isOpen", "false" );	                                    
	                                    }                
	                                    else {
	                                        els[j].setAttribute("isOpen", "true" );	                                    
	                                    }             	                                
	                                }
                                    break;
                                }
                            }
                        }
                }
          }
    }
    
    
//    if (isOpen) 
//    {
//        oCaller.innerHTML = "Show Terminated Customers"
//    }
//    else
//    {
//        oCaller.innerHTML = "Hide Terminated Customers"
//    }
 } 