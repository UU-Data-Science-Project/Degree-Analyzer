if((typeof window.nSP)=='undefined'||nSP==null){
	var baseDomain = 'http://'+document.domain;
}else{
	var baseDomain = nSP;	
}

InfoCompleteConfig=function(I,C,B){
	this.count=8;
	this.delay=0.05;
	this.SCkey=
		'88DF4730C6A6550285F22ED26514254A16E53C6A8725A61E0F'+
		'11CFE5384904E7E6E29DBAC369DCB18FCDF8715405601FA73B'+
		'9FE9CBB5D7B0DBBC636B2F74DE9D6724596AEA605596E1CFE1'+
		'55A5F14A962956795C2DF7D2680FE0712A193D9C0692EB8865';
	this.allowcountries='';
	this.allowexchanges='';
	this.allowsymboltypes='';
	this.inputId=I||'';
	this.containerId=C||'';
	this.buttonId=B||'';
	this.sections=[];
	this.initSymbol=function(F){
		this.sections[this.sections.length]={
			type:'symbol',
			dataSource:{
				server:'/api/djSymbolComplete/GetSymbolsJSON.ashx',
				schema:["Results","Symbol","Name","CountryCode","Exchange"],
				responseType:YAHOO.widget.DS_XHR.TYPE_JSON,
				scriptQueryAppend:	'count=' + this.count + '&license=' + this.SCkey +
													'&allowcountries=' + this.allowcountries +
													'&allowexchanges=' + this.allowexchanges +
													'&allowtypes=' + this.allowsymboltypes + '&deprecateexchange=PINKSH,NNOTC,NASDBB'
			},
			formatFunc:F,
			subHeader:null
		};
		return this;
	};
	this.initKeyword=function(F){
		this.sections[this.sections.length]={
			type:'keyword',
			dataSource:	{
				server:'/api/djKeywordcomplete/GetKeywordsJSON.ashx',
				schema:["Results","Word","Rank"],
				responseType:YAHOO.widget.DS_XHR.TYPE_JSON,
				scriptQueryAppend:'count=' + this.count + '&license=' + this.SCkey
			},
			formatFunc:F,
			subHeader:'<div class="subHeading">Choose a topic to search news:</div>'
		};
		return this;
	};
};

function initInfoComplete(C,O)
{  
	var infoCompleteObj=O||window.InfoComplete;
    if (!infoCompleteObj){return;}
	var config = C||new InfoCompleteConfig(searchBoxID,resultContainerID,searchGoButtonID)
							.initSymbol(formatSymbolCompleteResult)
							.initKeyword(formatKeywordCompleteResult);
    infoCompleteObj.Setup(config);
    if ((typeof(infoCompleteObj.autoComplete) == 'undefined') || (infoCompleteObj.autoComplete == null))
    {
        //Autocompete feature is not available; go with regular quote/search
        var inputBox = YAHOO.util.Dom.get(config.inputId);
        var goButton = YAHOO.util.Dom.get(config.buttonId);
        inputBox.setAttribute('onchange', '');
        YAHOO.util.Event.addListener(goButton, 'click', submitSymbolOrSearch);
        var listenEvent = 'keypress';
        if (YAHOO.util.Event.isIE)
        {
		    listenEvent = 'keydown';
	    }	
	    YAHOO.util.Event.addListener(inputBox, listenEvent, 
		    function (e) {				
			    if (e.keyCode == 13)
			    { 
				    submitSymbolOrSearch(e); 
			    }
			    else
			    {
				    window.gotSymbolReply = false;
			    } 
		    });
    }
    else
    {
    
        if (window.JSON && window.JSON.deserialize)
        {
            window.JSON.parse = window.JSON.deserialize;
        }
        var inputBox = YAHOO.util.Dom.get(config.inputId);
        var goButton = YAHOO.util.Dom.get(config.buttonId);
        infoCompleteObj.autoComplete.setHeader('');
        infoCompleteObj.autoComplete.setFooter('');
        //infoCompleteObj.autoComplete.setSubHeader('Choose a symbol match to get quote:', 0);
        //infoCompleteObj.autoComplete.setSubHeader('<div class=\"subHeading\">Choose a topic to search news:</div>', 1); 
				for(var i=0,maxi=config.sections.length;i<maxi;i++){
					if(typeof config.sections[i].subHeader!='undefined'&&config.sections[i].subHeader!=null){
						infoCompleteObj.autoComplete.setSubHeader(config.sections[i].subHeader, i);
					}
				}
        infoCompleteObj.autoComplete.dataReturnEvent.subscribe(updateSearchTerm, this);
        inputBox.setAttribute('onchange', '');
        infoCompleteObj.autoComplete.itemSelectEvent.subscribe(submitSymbolOrSearch, infoCompleteObj);
        YAHOO.util.Event.addListener(goButton, 'click',  function(e){submitSymbolOrSearch(e,null,infoCompleteObj);});
        var listenEvent = 'keypress';
        if (YAHOO.util.Event.isIE)
        {
		    listenEvent = 'keydown';
	    }	
	    YAHOO.util.Event.addListener(inputBox, listenEvent, 
		    function (e) {				
			    if (e.keyCode == 13)
			    { 
				    submitSymbolOrSearch(e,null,infoCompleteObj); 
			    }
			    else
			    {
				    window.gotSymbolReply = false;
			    } 
		    });		
     }
}

function updateSearchTerm()
{
	window.gotSymbolReply = true;
    var searchTerm = YAHOO.util.Dom.get('symbolCompleteSearchTerm');
    if (searchTerm)
        searchTerm.innerHTML = YAHOO.util.Dom.get(searchBoxID).value;
}

var submittedSymbolOrSearch = false;
function submitSymbolOrSearch(e, args, icObj)
{    
	var inputId=icObj.autoComplete._oTextbox.id;
    if ((typeof(icObj.autoComplete) == 'undefined') || (icObj.autoComplete == null))
    {
    //autocomplete feature is off; go with regular quote/search
        YAHOO.util.Event.stopEvent(e);
	    if(submittedSymbolOrSearch) return;    
        var searchBox = YAHOO.util.Dom.get(inputId);
        checkUnUsed(searchBox);
        if (validateQuoteSearchBox(searchBox))
        {
    	    submittedSymbolOrSearch = true;
    	    var isOverride = isSearchOverride(searchBox.value);
            if (isOverride)
            {
                doKeyWordSearch(searchBox.value);            
            }  
            else if (isIndex(searchBox.value))
            {
                doRedirectMDC(searchBox.value);
            }      
            else if ((!window.gotSymbolReply && searchBox.value.length <= 5 && !isOverride) ||
                isQuoteInput(searchBox.value, icObj))
            {
                if ((searchBox.value.length == 5) && !isMutualFund(searchBox.value))
                {
                    doKeyWordSearch(searchBox.value);
                }
                else
                {
                    doViewQuote(searchBox.value);       
                }
            }
            else
            {
                doKeyWordSearch(searchBox.value);
            }
        }
    }
    else
    {        
	    YAHOO.util.Event.stopEvent(e);
	    if(submittedSymbolOrSearch) return;    
        var searchBox = YAHOO.util.Dom.get(inputId);
        checkUnUsed(searchBox);
        var select = false;
        if (icObj.autoComplete._bItemSelected || (e && e == 'itemSelect'))
            select = true;
        var index = -1;
        if (args && args[1])
            index = args[1]._nDataSourceIndex;
        if (validateQuoteSearchBox(searchBox))
        {
    	    submittedSymbolOrSearch = true;
    	    var isOverride = isSearchOverride(searchBox.value);
            if (index == icObj.symbol)
           {
    	        doViewQuote(searchBox.value);
            }
            else if (index == icObj.keyword || isOverride)
            {
                doKeyWordSearch(args ? args[2][0].toLowerCase(): searchBox.value);            
            }  
            else if (isIndex(searchBox.value))
            {
                doRedirectMDC(searchBox.value);
            }      
            else if ((!window.gotSymbolReply && searchBox.value.length <= 5 && !isOverride) ||
                (select && index == icObj.symbol) || isQuoteInput(searchBox.value, icObj))
            {
                if ((searchBox.value.length == 5) && !isMutualFund(searchBox.value))
                {
                    doKeyWordSearch(searchBox.value);
                }
                else
                {
                    doViewQuote(searchBox.value);       
                }
            }
            else
            {
                doKeyWordSearch(searchBox.value);
            }
        }
    }
}
function isMutualFund(term)
{
    term = term.replace(/^\s+|\s+$/g,"").toUpperCase(); //Trim 
    var match = term.match(/[X|Y]$/); //see if the last(5th) character is either X or Y for mutual fund
    return match != null && match.length > 0 && match[0].length > 0; 
}
function isIndex(term)
{
    term = term.replace(/^\s+|\s+$/g,"").toUpperCase(); //Trim 
    var match = term.match(/^DJI$|^INDU$|^DJTA$|^TRAN$|^DJUA$|^UTIL$|^GSPC$|^SPX$|^OEX$|^MID$|^COMP$|^IXCO$|^COMPQ$|^NDX$|^NBI$|^IXCO$|^INDS$|^INSR$|^IXTC$|^RUT$|^RUI$|^NYSI$|^PSE$|^AMSI$|^XAX$|^MSH$|^SOXX$|^SOX$|^XAU$|^OSXX$|^FTSE$|^DAX$|^CAC 40$|^JSX$|^VIX$/);
    return match != null && match.length > 0 && match[0].length > 0;  
}

function isSearchOverrideold(term)
{
   //return false;
    term = term.replace(/^\s+|\s+$/g,"").toUpperCase(); //Trim  
    term = term.replace(/,+/gi,"");   //Eliminate commas
     
   // var match = term.match(/^ABC$|^BAY$|^EGAN$|^AIR$|^ACME$|^GOLD$|^COST$|^KEY$|^GAS$|^CHINA$|^BEER$|^DRUG$|^OIL$|^DOG$|^CPI$|^GDP$|^DNA$|^ETF$|^JAZZ$|^ETFS$|^AUTO$|^FED$/);
    var match = term.match(/^PUTIN$|^OBAMA$|^CHINA$|^FBI$|^CIA$|^FDA$/);
    return match != null && match.length > 0 && match[0].length > 0;    
}

function isSearchOverride(term)
{
    var match = false;
    term = term.replace(/^\s+|\s+$/g,"").toUpperCase(); //Trim  
    term = term.replace(/,+/gi,"");   //Eliminate commas     
    if((typeof window.keywordException)!='undefined' && keywordException != null && keywordException.length > 0)
    {
        var len=keywordException.length;
        for(var i=0; i<len; i++) {
	        var word = keywordException[i];
	        word = word.replace(/^\s+|\s+$/g,"").toUpperCase(); //Trim 
	        if(word == term)
	        {
	        match = true;
	        }
        }
    }
    return match;
}


function doExchangeCountryMap(exchange)
{
    var hashExchange = new Object();   
    hashExchange["US"] = "";  
    hashExchange["SAO PAULO"] = "Brazil";
    hashExchange["TOR"] = "Canada";   
    hashExchange["CSEC"] = "Venezuela"; 
    hashExchange["ASX"] = "Australia";
    hashExchange["SHSE"] = "China Shanghai";
    hashExchange["SSE"] = "China Shenzhen";
    hashExchange["HKSE"] = "Hong Kong";
    hashExchange["TSE"] = "Japan";
    hashExchange["KLSE"] = "Malaysia";
    hashExchange["NZSE"] = "New Zealand";
    hashExchange["SES"] = "Singapore";
    hashExchange["TWSE"] = "Taiwan";
    hashExchange["BRUX"] = "Belgium";
    hashExchange["COPN"] = "Denmark";
    hashExchange["TALLINN"] = "Estonia";
    hashExchange["HELS"] = "Finland";
    hashExchange["PARB"] = "France";
    hashExchange["FRNK"] = "German Floor";
    hashExchange["XETRA"] = "German Xetra";
    hashExchange["REYKJAVIK"] = "Iceland";
    hashExchange["DUBLIN"] = "Ireland";
    hashExchange["MILAN"] = "Italy";
    hashExchange["RIGA"] = "Latvia";
    hashExchange["LITHUANIA"] = "Lithuania";
    hashExchange["AMS"] = "Netherlands";
    hashExchange["OSLO"] = "Norway";
    hashExchange["SIBE"] = "Spain";
    hashExchange["STKM"] = "Sweden";
    hashExchange["ZSE"] = "Switzerland";
    hashExchange["LONDON"] = "U.K.";
    hashExchange["VTX"] = "virt-x";
    hashExchange["PINKSH"] = "Pink Sheets";
    hashExchange["NNOTC"] = "Other OTC";
    hashExchange["NASDBB"] = "OTC BB";
        
    var country = hashExchange[exchange];
    return country;
}
function doExchangeTypeMap(exchange)
{
    var hashExchange = new Object();   
    hashExchange["US"] = "usstock usfund";  
    hashExchange["SAO PAULO"] = "brsp";
    hashExchange["TOR"] = "tse";   
    hashExchange["CSEC"] = "vecsec"; 
    hashExchange["ASX"] = "auasx";
    hashExchange["SHSE"] = "shse";
    hashExchange["SSE"] = "sse";
    hashExchange["HKSE"] = "hkse";
    hashExchange["TSE"] = "jptse";
    hashExchange["KLSE"] = "myklse";
    hashExchange["NZSE"] = "nzse";
    hashExchange["SES"] = "sgses";
    hashExchange["TWSE"] = "twtwse";
    hashExchange["BRUX"] = "bebrux";
    hashExchange["COPN"] = "copn";
    hashExchange["TALLINN"] = "tallinn";
    hashExchange["HELS"] = "hels";
    hashExchange["PARB"] = "frparb";
    hashExchange["FRNK"] = "defrnk";
    hashExchange["XETRA"] = "dexetra";
    hashExchange["REYKJAVIK"] = "reykjavik";
    hashExchange["DUBLIN"] = "iedublin";
    hashExchange["MILAN"] = "itmilan";
    hashExchange["RIGA"] = "riga";
    hashExchange["LITHUANIA"] = "lithuania";
    hashExchange["AMS"] = "nlams";
    hashExchange["OSLO"] = "nooslo";
    hashExchange["SIBE"] = "escats";
    hashExchange["STKM"] = "sestkm";
    hashExchange["ZSE"] = "chzse";
    hashExchange["LONDON"] = "lse";
    hashExchange["VTX"] = "virtx";
    hashExchange["PINKSH"] = "pinksh";
    hashExchange["NNOTC"] = "nnotc";
    hashExchange["NASDBB"] = "nasdbb";

    
    var type = hashExchange[exchange];
    return type; 
    
}

function doViewQuote(symbol)
{
    symbol = symbol.replace(/^\s+|\s+$/g,""); //Trim
    //symbol = symbol.replace(/ +/gi,",");   //Replace one or more whitespaces with comma.
    symbol = symbol.replace(/,+/gi,",");   //Replace multiple commas with single comma. (Just in case)
    symbol = symbol.replace(/,$|\.,$/, "");
    if(symbol.match(","))
    {
        var symbolslist = symbol.split(",");
        var querySymbol = '';
        var exchange = '';
        for(i=0; i < symbolslist.length; i++)
        {
            tempSymb = symbolslist[i];
            tempEx = '';
            if(symbolslist[i].indexOf('(') > 0)
            {
                tempSymb = symbolslist[i].substring(0,symbolslist[i].indexOf('('));
                tempEx = symbolslist[i].substring(symbolslist[i].indexOf('(')+1,symbolslist[i].length-1);
            }  
            else
            {
                tempEx = 'US'
            }
            tempSymb = tempSymb.replace(/^\s+|\s+$/g,""); //Trim
            querySymbol = querySymbol + tempSymb + ",";
            exchange = exchange + doExchangeTypeMap(tempEx) + ",";                  
        }
        querySymbol = querySymbol.substring(0,querySymbol.length-1);
        exchange = exchange.substring(0,exchange.length-1); 
        querySymbol = querySymbol.replace(/\+/g, "%2B");
        var quoteURL = baseDomain + ((loggedIn)?'':'/public') + '/quotes/main.html?symbol=' + querySymbol + '&type=' + exchange + '&mod=DNH_S';
        window.location = quoteURL;
        
    }
    else
    {
        //Extract exchange part from symbol if present
        var exchange = 'US';
        var querySymbol = symbol;
        if(symbol.indexOf('(') > 0)
        {
            querySymbol = symbol.substring(0,symbol.indexOf('('));
            exchange = symbol.substring(symbol.indexOf('(')+1,symbol.length-1);
        }
        //encoding the '+' character in symbol as escape fn doesn't work for '+'
        querySymbol = querySymbol.replace("+","%2B");
        var quoteURL = baseDomain + ((loggedIn)?'':'/public') + '/quotes/main.html?symbol=' + querySymbol + '&type=' + doExchangeTypeMap(exchange) + '&mod=DNH_S';
        window.location = quoteURL;
    }
 }

function doKeyWordSearch(query)
{
    query = query.replace(/^\s+|\s+$/g,"").replace(/,$|\.,$/, ""); //Trim and remove trailing periods/commas

var searchURL = baseDomain + '/search/term.html?KEYWORDS='+escape(query) + '&mod=DNH_S';	

    window.location = searchURL;
}

function doRedirectMDC(query)
{   
    query = query.replace(/^\s+|\s+$/g,"").replace(/,$|\.,$/, ""); //Trim and remove trailing periods/commas
    query = query.toLowerCase();
    baseDomain = "http://online.wsj.com";
    var isInternational = false;
    var match = query.match(/^ftse$|^dax$|^cac 40$|^jsx$/);
    if(match != null && match.length > 0 && match[0].length > 0)
    {
     isInternational = true;
    }
    //replace the symbol with the actual ones   
    query = query.replace("util", "djua");
    query = query.replace("tran","djta");
    query = query.replace("gspc","spx");
    query = query.replace("compq","comp");
    query = query.replace("nysi","nya");
    query = query.replace("amsi","xax");
    query = query.replace("sox","soxx");
    query = query.replace("ftse","uk:ftse100");
    query = query.replace("dax","dx:1876534");
    query = query.replace("cac 40","fr:px1");
    query = query.replace("jsx","1803554");
    var mdcURL = baseDomain + '/mdc/public/npage/2_3051.html?symb='+query+((isInternational)?'&page=intl':'');
    
    window.location = mdcURL + '&mod=DNH_S';    
}

function addMoreResultsLink(q,iIndex,acObj)
{
    var lookupURL = baseDomain + ((loggedIn)?'':'/public') + '/quotes/main.html?name=' + q; 
    var headerText = "";
    if(q.length > 1)
    {
        headerText = "<div class=\"subHeading\">Choose a symbol match to get quote:</div><div class=\"showAllLink\"><a href='" + lookupURL + "'>See all symbol results for \""+q.toUpperCase()+"\"</a></div>";
    }
    else
    {
        headerText = "<div class=\"subHeading\">Choose a symbol match to get quote:</div>";
    }
    acObj.setSubHeader(headerText,iIndex);
}

function formatKeywordCompleteResult(aResultItem, Query, iIndex)
{
    var SCRegExp = new RegExp("\\b(" + Query + ")(.*)\\b", "i"); //Find part to bold
    
    var result = aResultItem[0].toLowerCase();
    
    aResultItem[0] = result;
    if(result.length > 80)
    {
        result =  result.substring(0,80);
    }
    
    if (result.match(SCRegExp))
        result = result.replace(SCRegExp, '<span class="scResultTerm">$1</span>$2');
        
        var aMarkup = '<span class="keywordResult">'+result+'</span>';
        return aMarkup;
    //return result;    
}

function formatSymbolCompleteResult(aResultItem, Query, iIndex, acObj)
{
    addMoreResultsLink(Query,iIndex,acObj);
    var SelectionValue = new param;
    var CompanyName = aResultItem[1];
    CompanyName = CompanyName.toLowerCase();
    var Exchange = aResultItem[3];
    var CountryCode = aResultItem[2].toUpperCase();
    Symbol = aResultItem[0];
    //Eliminate the exchange added by previous selection from Result item
    if(Symbol.indexOf('(') > 0)
    {
        Symbol = Symbol.substring(0,Symbol.indexOf('('));
    }
    
    if (CountryCode != "US")
    {
        aResultItem[0] = Symbol + "(" + Exchange + ")";
    }                
     if (Exchange == "NNOTC" || Exchange == "NASDBB" || Exchange == "PINKSH")
      {
    	if (CountryCode == "US")
    	{
    	 	aResultItem[0] = Symbol + "(" + Exchange + ")";
    	 }
    } 

    var CountryName = doExchangeCountryMap(Exchange);
    var SCRegExp = new RegExp("\\b(" + Query + ")(.*)\\b", "i"); //Find part to bold
    
    var tickerDisplay = Symbol;    
    if (Symbol.match(SCRegExp))
        tickerDisplay = tickerDisplay.replace(SCRegExp, "<span class=scResultTerm>$1</span>$2");
    else 
        CompanyName = CompanyName.replace(SCRegExp, "<span class=scResultTerm>$1</span>$2");        
    //if(CountryCode != "US")
    	//CompanyName = CompanyName + "("+ Exchange + ")";
    var aMarkup = ["<table class=scResultTable><tr><td class=symbolCompleteCol1>",   
           tickerDisplay,
           "</td><td class=symbolCompleteCol2>",   
           CompanyName,   
           "</td><td class=symbolCompleteCol3>",
           CountryName,
           "</td></tr></table>"];  
    
    return (aMarkup.join(""));    
}

function validateQuoteSearchBox(el)
{
    var isTextEntered = false;
    
    if(el.value == null || el.value.length == 0)
    {
        alert("Please Enter a Symbol or Keyword.");
    }
    else
    {
        isTextEntered = true;        
    }

    return isTextEntered;
}

function isQuoteInput(textValue, icObj)
{    
    if (!icObj || !icObj.autoComplete)    
        return false;
    else if (icObj.autoComplete._bItemSelected)
        return true;
    else
        return icObj.isSymbolMatch();
}

function showHideCRDrpdwn(elem)
{

	if(document.all) {

		var resultsContentEl = document.getElementById("resultsContentDiv");
		var crDrpdwnEl = document.getElementById("wsjCRSelectDrpdwn");

		if(elem != "show"){
			if(crDrpdwnEl) crDrpdwnEl.style.display = "none";
		}else{
			if(crDrpdwnEl) crDrpdwnEl.style.display = "block";
		}
	}
	
}

function setFocused(elem)
{
	var resolved = YAHOO.util.Dom.get(elem);
	window.formElementWithFocus = resolved;
}

function setUnUsed(searchField) { 
	var defaultValue;	
	switch (searchField.name) 
	{
		case "Symbol": 
			defaultValue = "Symbol(s)"; 
			break; 
		case "KeywordSearch": 
			defaultValue = "Keyword(s)"; 
			break;
	} 
	if (searchField.value == defaultValue) 
	{ 
		searchField.className = searchField.className + " unUsed";
	} 
}

function checkUnUsed(searchField) { 
	if (searchField.className.indexOf("unUsed") >= 0) 
	{ 			
		searchField.value = ""; 
	}
	return true; 
}

function searchFieldOnFocus(searchField) 
{ 
	var index = searchField.className.indexOf("unUsed"); 
	if (index >= 0) 
	{
		searchField.value = ""; 
		if (index == 0) 
		{ 
			if (searchField.className.match("unUsed ")) 
			{ 
				searchField.className = searchField.className.replace("unUsed ", "");
			} 
			else 
			{ 
				searchField.className = searchField.className.replace("unUsed", "");
			} 
		} 
		else 
		{ 
			searchField.className = searchField.className.replace(" unUsed", ""); 
		}
	} 
}

function clearSearchFieldFocus(searchFieldID)
{
    var searchField = document.getElementById(searchFieldID)
    if(typeof(searchField) != 'undefined')
    {
        searchField.blur();
        searchField.className = "unUsed";
    }
}

