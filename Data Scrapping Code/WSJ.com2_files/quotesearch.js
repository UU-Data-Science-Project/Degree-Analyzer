// Function for Header Search Boxes and Advanced Search Page Quote Search (Right Hand Column)

function checkSymbol(){
	checkSymbolGeneric('US_search','fund_search')
}

function checkCRSymbol(PassedForm1,PassedForm2){
            
  eval("var form1=window.document."+PassedForm1+";")
  eval("var form2=window.document."+PassedForm2+";")
  
  var sym = form1['symbol_or_name'].value;
  var outString;
  var frontIndex = 0
  var backIndex = sym.length - 1;        

  while (sym.charAt( frontIndex ) == " " || sym.charAt( frontIndex ) == "\t" || sym.charAt( frontIndex ) == "\n" || sym.charAt( frontIndex ) == "\r")  
  {
    frontIndex++;
  }

  while (sym.charAt( backIndex ) == " " || sym.charAt( backIndex ) == "\t" || sym.charAt( backIndex ) == "\n" || sym.charAt( backIndex ) == "\r" )  
  {
    backIndex--;
  }

  sym = sym.substring( frontIndex, (backIndex + 1) );
    
  // Catches user entry of all whitespace - All whitespace searches will cause company research page to display incorrectly
  
  if (backIndex < 0){
    alert ("Please enter a name or symbol.");
    return false;
  }
    
  // Catches user entry of all Mutual Fund Symbols
  if ( (form1.elements["sym_name_switch"][0].value=='symbol') && (form1.elements["sym_name_switch"][0].checked) &&  (sym.length == 5) && (sym.charAt(4) == 'x' || sym.charAt(4) == 'X') && !(sym.charAt(3) == 'x' || sym.charAt(3) == 'X') && (sym.indexOf(" ") <0) && (sym.indexOf(".") <0)){
      form2.sym.value = sym;
      form2.submit();
return false;
  }
      
} 

function checkSymbolGeneric(PassedForm1,PassedForm2){

	eval("var form1=window.document."+PassedForm1+";")
	eval("var form2=window.document."+PassedForm2+";")
	
	var sym = form1['transform-value-quote-search'].value;
	var outString;
	var frontIndex = 0
	var backIndex = sym.length - 1;        

	while (sym.charAt( frontIndex ) == " " || sym.charAt( frontIndex ) == "\t" || sym.charAt( frontIndex ) == "\n" || sym.charAt( frontIndex ) == "\r")  
	{
		frontIndex++;
	}

	while (sym.charAt( backIndex ) == " " || sym.charAt( backIndex ) == "\t" || sym.charAt( backIndex ) == "\n" || sym.charAt( backIndex ) == "\r" )  
	{
		backIndex--;
	}

	sym = sym.substring( frontIndex, (backIndex + 1) );
    

	// Catches user entry of all whitespace - All whitespace searches will cause company research page to display incorrectly
	
	if (backIndex < 0){
		alert ("Please enter a name or symbol.");
		return false;
	}
		
	// Catches user entry of all Mutual Fund Symbols
	if ( ( (form1.elements["transform-name-quote-search"][0] && form1.elements["transform-name-quote-search"][0].checked)
			|| ( form1.elements["transform-name-quote-search"].value && form1.elements["transform-name-quote-search"].value=='nvp-set-p-sym') )
			&& (sym.length == 5) && (sym.charAt(4) == 'x' || sym.charAt(4) == 'X') && !(sym.charAt(3) == 'x' || sym.charAt(3) == 'X') && (sym.indexOf(" ") <0) && (sym.indexOf(".") <0)){
			form2.sym.value = sym;
			if(/^\/page/.test(form2.action)) {; form2.action = "/fund" + form2.action; }
			form2.submit();
	}

	// Changes station based on radio button selected
	else if ( (form1.elements["transform-name-quote-search"][0] && form1.elements["transform-name-quote-search"][0].checked )
			|| ( form1.elements["transform-name-quote-search"].value &&	form1.elements["transform-name-quote-search"].value=='nvp-set-p-sym' ) ) {
		form1.elements["route"].value="BOH";
		form1.submit();
	} else {
		form1.elements["route"].value="BOEH";
		form1.submit();
	}
		
}	



// Function for lib_Fund_Search_Box Module

function checkSymbol_moduleForm(){
	
	var form1=window.document.second_US_search;
	var form2=window.document.second_fund_search;
	
	var sym = form1['transform-value-quote-search'].value;
	var outString;
	var frontIndex = 0
	var backIndex = sym.length - 1;        

	while (sym.charAt( frontIndex ) == " " || sym.charAt( frontIndex ) == "\t" || sym.charAt( frontIndex ) == "\n" || sym.charAt( frontIndex ) == "\r")  
	{
	frontIndex++;
	}
	
	while (sym.charAt( backIndex ) == " " || sym.charAt( backIndex ) == "\t" || sym.charAt( backIndex ) == "\n" || sym.charAt( backIndex ) == "\r" )  
	{
	backIndex--;
	}
	
	sym = sym.substring( frontIndex, (backIndex + 1) );
    

	// Catches user entry of all whitespace - All whitespace searches will cause company research page to display incorrectly
	
	if (backIndex < 0){
		alert ("Please enter a name or symbol.");
		return false;
	}
		
	// Catches user entry of all Mutual Fund Symbols
	
	if ( (form1.elements["transform-name-quote-search"][0]&&form1.elements["transform-name-quote-search"][0].checked) && (sym.length == 5) && (sym.charAt(4) == 'x' || sym.charAt(4) == 'X') && (sym.indexOf(" ") <0) && (sym.indexOf(".") <0)){
		form2.sym.value = sym;
		form2.submit();
	}
		
			
	// Changes station based on radio button selected
	
	else if  (form1.elements["transform-name-quote-search"][0]){
		if ( form1.elements["transform-name-quote-search"][0].checked) {
			form1.elements["route"].value="BOH";
			form1.submit();
		}	else {
			form1.elements["route"].value="BOEH";
			form1.submit();
		}
	}
}	



// Function for Public Searches 'qsearch'

function q(){
	
	var qform=window.document.qsearch;
	var sym = qform['transform-value-quote-search'].value;
	var outString;
	var frontIndex = 0
	var backIndex = sym.length - 1;        

	while (sym.charAt( frontIndex ) == " " || sym.charAt( frontIndex ) == "\t" || sym.charAt( frontIndex ) == "\n" || sym.charAt( frontIndex ) == "\r")  
	{
	frontIndex++;
	}
	
	while (sym.charAt( backIndex ) == " " || sym.charAt( backIndex ) == "\t" || sym.charAt( backIndex ) == "\n" || sym.charAt( backIndex ) == "\r" )  
	{
	backIndex--;
	}
	
	sym = sym.substring( frontIndex, (backIndex + 1) );


	// Catches user entry of all whitespace - All whitespace searches will cause company research page to display incorrectly
	
		if (backIndex < 0){
		alert ("Please enter a name or symbol.");
		return false;
		}
		
			
	// Changes station based on radio button selected
	
	// If name radio button is checked
		else if(qform.elements[10].checked==true) {
		
			qform.elements["route"].value="BEH";
			qform.elements["transform-name-quote-search"].value="nvp-no-set-p-name";
			qform.submit();
			
			}	
	
	
		else {
			qform.elements["route"].value="BOH";
			qform.elements["transform-name-quote-search"].value="nvp-set-p-sym";
			qform.submit();
			
		}
		
}	


// Broad Search

function trim_it(){
	
	var form1=window.document.BroadSearch;
	
	var sym = form1['transform-value-quote-search'].value;
	var outString;
	var frontIndex = 0
	var backIndex = sym.length - 1;        

	while (sym.charAt( frontIndex ) == " " || sym.charAt( frontIndex ) == "\t" || sym.charAt( frontIndex ) == "\n" || sym.charAt( frontIndex ) == "\r")  
	{
	frontIndex++;
	}
	
	while (sym.charAt( backIndex ) == " " || sym.charAt( backIndex ) == "\t" || sym.charAt( backIndex ) == "\n" || sym.charAt( backIndex ) == "\r" )  
	{
	backIndex--;
	}
	
	sym = sym.substring( frontIndex, (backIndex + 1) );
    

	// Catches user entry of all whitespace - All whitespace searches will cause company research page to display incorrectly
	
		if (backIndex < 0){
		alert ("Please enter a name or symbol.");
		return false;
		}
		
	
		else {
	
			form1.submit();
			
		}
		
}	