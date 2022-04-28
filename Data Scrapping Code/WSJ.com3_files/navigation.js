//Copyright 2002 WSJ.com, All Rights Reserved
//Writen by Mohammad Tahir Khan
//Vars
var OPERA=(navigator.userAgent.toLowerCase().indexOf('opera') != -1)?true:false;
var OJH,IE,NS6,Cnctn="",OverBar=false,OverNav=false,NavOpen=false,Ctbl="</table>",EvalS,PgID,PgName,ES,Mheight,WinH=0,sT,Stl='style="color: #000; font: normal 12px arial,sans-serif;',DW,OM,actvMenu,crntMenu,OpnWhat,Scrolling,SubUrl,Yscroll=false,TrckName,NavC='EFEFEF',W=window,D=document,DB="document.documentElement",lctn=W.D.location+"",HP=' height="20" valign="middle"><nobr><spacer height="20"><img src="http://s.wsj.net/img/b.gif" height="17" width="1" border="0" align="texttop"><span style="color: #000; font: normal 14px arial,sans-serif;">&nbsp;&nbsp;</span>'
var OtherJrnlSiteArray=new Array("MarketWatch|http://www.marketwatch.com/news/default.asp?siteid=wsj&dist=freedjsiteslink","Barrons.com|http://online.barrons.com/public/main","CareerJournal|http://careerjournal.com/","OpinionJournal|http://opinionjournal.com/","RealEstateJournal|http://realestatejournal.com/","CollegeJournal|http://collegejournal.com/","AllThingsDigital|http://ptech.wsj.com/","Dow Jones News <br><div style='padding-left: 9px;'>Alerts</div>|http://www.dowjones.com/alerts","MORE|/public/other_wsj_sites")
if((typeof window.staticDomain)=='undefined'||staticDomain==null){var staticDomain='http://s.wsj.net';}
//Detect Browsers
IE=(navigator.appName.substring(0,9)=="Microsoft")?true:false;NS6=(navigator.userAgent.indexOf("Netscape6")>0)?true:false;NS7=(navigator.userAgent.indexOf("Netscape/7.0")>0)?true:false;Mozilla=(navigator.userAgent.indexOf("Gecko")>0)?true:false;Cnctn=nSP;//if(lctn.substring(4,5)=="s"){;Cnctn="http://"+lctn.split("/")[2];}
if(IE && !document.documentElement ){DB="D.body";}
//Detect Scroll
if(navigator.userAgent.indexOf("Mac")>0){;Yscroll=(IE!=true)?0:-3;}else{;ES=(IE==true)?"W.scrollTo(1,"+DB+".scrollTop);Scrolling="+DB+".scrollLeft;W.scrollTo(0,"+DB+".scrollTop);Yscroll=(Scrolling==0)?0:17":"W.scrollTo(1,pageYOffset);Scrolling=pageXOffset;W.scrollTo(0,pageYOffset);Yscroll=(Scrolling==0)?0:16";}
//Functions
function HideNav(){EvalS=(IE==true)?'ndiv.style.visibility="hidden"':'D.nlayer.visibility="hide"';if(NS6==true||NS7==true||Mozilla==true){EvalS="D.getElementById('ndiv').style.visibility=\"hidden\"";}eval(EvalS);NavOpen=false;if(crntMenu && crntMenu!="OtherJrnlSite"){eval("D."+crntMenu+"IMG.src="+crntMenu+"_normal_img.src");}crntMenu="";}
function DelayHide(){;if(OverBar==false&&OverNav==false&&NavOpen==true){;HideNav();};setTimeout("DelayHide()",500);}
function OpenMenu(CarriedVal){;OpnWhat=CarriedVal+"";setTimeout("ShowSubmenu('"+CarriedVal+"')", 1*167);}
function OpenMenuNew(CarriedVal){;OpnWhat=CarriedVal+"";setTimeout("ShowSubMenu('"+CarriedVal+"','#8E99B6','#8E99B6','#F8F9EF','p11')", 1*167);}
function ShowSubmenu(CarriedVal){;ShowSubMenu(CarriedVal,"#000000","#FFFFFF","#"+NavC,"p12");}
function ShowSubMenu(CarriedVal,border,sperator,bgcolor,fclass){
  actvMenu=CarriedVal+"";if(actvMenu!=crntMenu&&OverBar==true&&actvMenu==OpnWhat){;if(Yscroll==false){eval(ES)};HideNav();if(actvMenu!="OtherJrnlSite"){;eval("D."+CarriedVal+"IMG.src="+CarriedVal+"_over_img.src");};eval("ImageName='"+CarriedVal+"IMG'");eval("WhichArray='"+CarriedVal+"Array'");tmpHTML='';tmpHTML+='<table border="0" width="130" cellspacing="0" cellpadding="1" bgcolor="'+border+'"><tr><td bgcolor="'+border+'"><table border="0" cellspacing="0" width="128" cellpadding="0" bgcolor="'+sperator+'"><tr><td><table border="0" cellspacing="0" width="128" cellpadding="0" bgcolor="'+bgcolor+'" align="center">';var LST=new Array();eval("LST="+WhichArray);for(i=0;i<LST.length;i++){;PgID=LST[i].split("|")[1];PgName=LST[i].split("|")[0];TrckName=LST[i].split("|")[0];for(z=0;z<TrckName.indexOf(' ');z++){;TrckName=TrckName.replace(/\s/,"+");};SubUrl=(PgID!="1_0001")?Cnctn+"/page/":Cnctn+""+((loggedIn)?"/home/us":"/public/us");tmpHTML+='<tr><td'+HP+'<a href="';
  tmpHTML+=(/[0-9]/.exec(PgID.substr(0,1)))?((PgID!="1_0001")?SubUrl+'0,,'+PgID+',00.html?mod='+PgID:SubUrl+'?mod='+PgID):(PgID);tmpHTML+=(PgID.indexOf(".com")>-1&&PgID.indexOf(".wsj.com")==-1)?'" target="_blank"':'"';tmpHTML+=' '+Stl+'><span class="'+fclass+'">'+PgName+'</span></a></nobr></td></tr>';tmpHTML+=(i!=(LST.length-1))?('<tr bgcolor="'+sperator+'"><td height="1"><spcer type="block" width="1"></td></tr>'):('');};tmpHTML+=Ctbl+'</td></tr>'+Ctbl+'</td></tr>'+Ctbl+Ctbl
  if(NS6==true||NS7==true||Mozilla==true){
    OJH=(actvMenu!="OtherJrnlSite")?4:11;WinH=W.innerHeight;D.getElementById('ndiv').innerHTML=tmpHTML
    D.getElementById('ndiv').style.left=(eval("D."+ImageName+".x")+eval("D."+ImageName+".width")-4)+"px";eval("yPos=D."+ImageName+".y")
    Mheight=((LST.length*21)+1+Yscroll);D.getElementById('ndiv').style.top=(((yPos-pageYOffset)+Mheight<WinH)?yPos-OJH:((pageYOffset+WinH)-Mheight))+"px"
    D.getElementById('ndiv').style.visibility="visible"
  }else if(IE!=true){
    OJH=(actvMenu!="OtherJrnlSite")?5:13;WinH=W.innerHeight;document.nlayer.document.write(tmpHTML);document.nlayer.document.close()
    eval("document.nlayer.left=((document."+ImageName+".x)+(document."+ImageName+".width))-4");eval("yPos=document."+ImageName+".y")
    Mheight=((LST.length*21)+1+Yscroll);document.nlayer.top=((yPos-pageYOffset)+Mheight<WinH)?yPos-OJH:((pageYOffset+WinH)-Mheight)
    document.nlayer.visibility="show"
  }else if(OPERA==true){
    OJH=(actvMenu!="OtherJrnlSite")?4:8;ndiv.innerHTML=tmpHTML;WinH=(navigator.userAgent.indexOf("Mac")>0)?D.body.clientHeight:D.body.offsetHeight;eval("xPos="+ImageName+".offsetLeft");eval("tempEl="+ImageName+".offsetParent")
    while(tempEl!=null){;xPos+=tempEl.offsetLeft;tempEl=tempEl.offsetParent;};eval("yPos="+ImageName+".offsetTop");eval("tempEl="+ImageName+".offsetParent")
    while(tempEl!=null){;yPos+=tempEl.offsetTop;tempEl=tempEl.offsetParent;};eval("ndiv.style.left=((xPos)+(D."+ImageName+".width))-4")
    Mheight=((LST.length*21)+5+Yscroll);sT=D.body.scrollTop;ndiv.style.top=((yPos-sT)+Mheight<WinH)?yPos-OJH:(sT+WinH)-Mheight
    ndiv.style.visibility="visible"
  }else{
    OJH=(actvMenu!="OtherJrnlSite")?4:8;ndiv.innerHTML=tmpHTML;WinH=(navigator.userAgent.indexOf("Mac")>0)?eval(DB+".clientHeight"):eval(DB+".offsetHeight");eval("xPos="+ImageName+".offsetLeft");eval("tempEl="+ImageName+".offsetParent")
    while(tempEl!=null){;xPos+=tempEl.offsetLeft;tempEl=tempEl.offsetParent;};eval("yPos="+ImageName+".offsetTop");eval("tempEl="+ImageName+".offsetParent")
    while(tempEl!=null){;yPos+=tempEl.offsetTop;tempEl=tempEl.offsetParent;};eval("ndiv.style.left=((xPos)+(D."+ImageName+".width))-4")
    Mheight=((LST.length*21)+5+Yscroll);sT=eval(DB+".scrollTop");ndiv.style.top=((yPos-sT)+Mheight<WinH)?yPos-OJH:(sT+WinH)-Mheight
    ndiv.style.visibility="visible"
  };NavC='EFEFEF';NavOpen=true;crntMenu=CarriedVal+"";}
}
//PreLoad images
if(typeof SectionArray!='undefined'){for(i=0;i<SectionArray.length;i++){;eval("var "+SectionArray[i]+"_normal_img=new Image(131,20)");eval(SectionArray[i]+"_normal_img.src='"+staticDomain+"/img/"+SectionArray[i]+"_normal.gif'");eval("var "+SectionArray[i]+"_over_img=new Image(131,20)");eval(SectionArray[i]+"_over_img.src='"+staticDomain+"/img/"+SectionArray[i]+"_over.gif'");}}
//Write
Stl=(IE==true||NS6==true||NS7==true||Mozilla==true)?Stl+'"':Stl+' text-decoration: none;"';DW=(IE==true||NS6==true||NS7==true||Mozilla==true)?'<div id="ndiv" style="position:absolute; z-index:1; visibility:hide" onMouseover="OverNav=true" onMouseout="OverNav=false"></div>':'<layer id="nlayer" z-index="1" visibility="hide" onMouseover="OverNav=true" onMouseout="OverNav=false"></layer>';D.write(DW);DelayHide()
