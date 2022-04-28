//info complete should be used when a text box should be show results from both keyword complete
//and symbol complete in the same result box.


function InfoComplete()
{
    this.dataSource = null;  
    this.autoComplete = null;  
    this.count = 0;
    this.domain = "";
    this.allowcountries = "";
    this.allowsymboltypes= "";
    this.allowexchanges= "";
    this.currentQueryHasResultMatch = false;
    this.lastExactResult = "";
    this.exactMatches = new Array();
		this.symbol=null;
		this.keyword=null;
};

InfoComplete.prototype.Setup = function(config)
{
	if(typeof config=='undefined' || config===null){
        return;
	}
	for(var i=0,maxi=config.sections.length;i<maxi;i++){
		var server=config.sections[i].dataSource.server;
		if(typeof server=='undefined' || server===null || server==''){
			return;
		}
	}
    var bodyelement = document.getElementsByTagName("BODY")[0];
    this.count = config.count;
    this.dataSource = [];
	for(var i=0,maxi=config.sections.length;i<maxi;i++){
		var section=config.sections[i];
		if(section.type=='keyword'){
			this.keyword=i;
		}
		else if(section.type=='symbol'){
			this.symbol=i;
		}
		var tmpDs=new YAHOO.widget.DS_XHR(section.dataSource.server, section.dataSource.schema);
		tmpDs.responseType = section.dataSource.responseType;
		tmpDs.scriptQueryAppend = section.dataSource.scriptQueryAppend 
		tmpDs.index = i;
		tmpDs.dataErrorEvent.subscribe(this.handleError, tmpDs);
		this.dataSource[i]=tmpDs;
	}
    this.autoComplete = new YAHOO.widget.MultiAutoComplete(config.inputId,config.containerId, this.dataSource);
    this.count = config.count;
    this.autoComplete.autoHighlight = false;
    this.autoComplete.maxResultsDisplayed = config.count;
    this.autoComplete.queryDelay = config.delay;
    this.autoComplete.allowBrowserAutocomplete = false;
    this.autoComplete.typeAhead = true;
    this.autoComplete.animVert = false;
    this.autoComplete.animHoriz = false;
    this.autoComplete.delimChar = ",";
    this.autoComplete.setHeader('Choose a quote match or "GO" to get quote news');
    this.autoComplete.setFooter('Separate multiple symbols with commas (,)');
    this.autoComplete.formatResult = function(aResultItem, sQuery, iIndex) { return config.sections[iIndex].formatFunc(aResultItem, sQuery, iIndex, this); };
    this.autoComplete.dataReturnEvent.subscribe(this.checkResultsForExactMatch, this.autoComplete, this);
    this.autoComplete.textboxKeyEvent.subscribe(this.checkPastExactResults, this.autoComplete, this);
}

InfoComplete.prototype.getFirstDelimChar = function()
{
    if (this.autoComplete.delimChar && this.autoComplete.delimChar.length > 0)
        return this.autoComplete.delimChar[0];
    return '';
}

InfoComplete.prototype.isSymbolMatch = function()
{
    var delim = this.getFirstDelimChar();
    if (this.currentQueryHasResultMatch == true && this.lastExactResult.toUpperCase() == autoCompleteTrim(this.autoComplete._oTextbox.value).replace(/,$|\.,$/, "").toUpperCase())
        return true;
	var splitInput = this.autoComplete._oTextbox.value.split(delim);
    for (var i = 0; i < this.exactMatches.length; i++)
		for (var j = 0; j < splitInput.length; j++)
			if (this.exactMatches[i] == splitInput[j])
				return true;
    return this.doesListHaveMatch(0);
}

InfoComplete.prototype.handleError = function(e, args)
{
    var ac = args[1];
    if (ac._populateStaging)
        ac._populateStaging("null", null, ac, args[0].index);
}

InfoComplete.prototype.checkPastExactResults = function(e, args)
{
   if('function' == typeof this.getFirstDelimChar){

    var delim = this.getFirstDelimChar();
	if (args[0]._oTextbox.value.length > 0 && 
	    args[0]._oTextbox.value.lastIndexOf(delim) == args[0]._oTextbox.value.length - 1 && 
	    this.currentQueryHasResultMatch)
    {
		if (this.exactMatches.length > 0)
		{
			for (var i = 0; i < this.exactMatches.length; i++)
			{
				if (this.exactMatches[i] == this.lastExactResult)
					return;
			}
		}
		this.exactMatches.push(this.lastExactResult);
    }
    }
}

InfoComplete.prototype.checkResultsForExactMatch = function(e, args)
{
    //only check against first datasource for now.
    if (!args || args.length < 4 || args[3] > 0)
		return;		
 
    var delim = this.getFirstDelimChar();   
    var listItems = args[2];
    var termToMatch = args[0]._oTextbox.value;
	if (termToMatch.indexOf(delim) > 0)
	{
		var splitTerms = termToMatch.split(delim);
		termToMatch = autoCompleteTrim(splitTerms[splitTerms.length - 1]);
	}
    if (listItems && listItems.length > 0)
    {        
        for (var i = 0; i < listItems.length; i++)
        {
		    if (listItems[i] && listItems[i][0] != null)
		    {
				var ticker = listItems[i][0];
			    if (termToMatch.toUpperCase() == ticker.toUpperCase())
			    {
				    this.currentQueryHasResultMatch = true;
				    this.lastExactResult = termToMatch;
				    return;
			    }
            }                
        }
    }
    this.currentQueryHasResultMatch = false;
}

InfoComplete.prototype.doesListHaveMatch = function(iDsIndex)
{
    var delim = this.getFirstDelimChar();
	var allItems = this.autoComplete.getListItems();
	var termToMatch = autoCompleteTrim(this.autoComplete._oTextbox.value).replace(/,$|\.,$/, "");
	if (termToMatch.indexOf(delim) > 0)
	{
		var splitTerms = termToMatch.split(delim);
		termToMatch = autoCompleteTrim(splitTerms[splitTerms.length - 1]);
	}
	if (iDsIndex < allItems.length)
	{
		var listItems = allItems[iDsIndex];
		for (var i = 0; i < listItems.length; i++)
		{
			if (listItems[i] && listItems[i]._oResultData != null)
			{
				if (termToMatch.toUpperCase() == listItems[i]._oResultData[0].toUpperCase())
				{
					return true;
				}
			}
		}
	}
	return false;
}

function param()
{
    this.array = new Array(1);

    this.setValue = function(v) { this.array[0] = v; }
    this.getValue = function()  { return this.array[0]; }
}

function autoCompleteTrim(text) {
    return text.replace( /^\s*(\S*(\s+\S+)*)\s*$/, "$1" );
}    

function InstallLibrary(target)
{
    var t = target||window;
		t.symbolComplete = new InfoComplete();
    t.InfoComplete = new InfoComplete();
};
InstallLibrary();

