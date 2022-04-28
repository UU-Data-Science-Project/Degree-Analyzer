if((typeof window.nSP)=='undefined'||nSP==null){var nSP='';}
if((typeof window.staticDomain)=='undefined'||staticDomain==null){var staticDomain='';}
if(nSP==''){staticDomain='https://s.wsj.net'};
//User status check
var site ="WSJ";
//var loggedIn=(typeof laserJ4J=='object')?laserJ4J.isLoggedIn('WSJ'):false;

if(loggedIn){
//document.write('<scr'+'ipt type="text/javascript" src="'+nSP+'/demo-web/js/demo-client.js">' + '<\/script>');
}

document.write('<scr'+'ipt type="text/javascript" src="'+nSP+staticDomain+'/javascript/commonFunctions.js">' + '<\/script>');

//document.write('<scr'+'ipt type="text/javascript" src="'+nSP+staticDomain+'/javascript/ccs_wsj.js">' + '<\/script>');
document.write('<scr'+'ipt type="text/javascript" src="'+nSP+staticDomain+'/javascript/channelinfo.js">' + '<\/script>');

$import("com.dowjones.rolloverQuotes");
$import("com.dowjones.video");
//Global setting of currentRegion for Non-Reno apps.
var cookie = document.cookie;
var currentRegion = "";
var regionindex = cookie.indexOf("wsjregion");
if(regionindex != -1)
{
    var regioncookie = GetCookie("wsjregion");
    if (regioncookie.indexOf("reset") != -1) {
	currentRegion = regioncookie.substring(0,regioncookie.indexOf("reset") - 1);
    }else{
    	currentRegion = regioncookie;
    }
}

// This is a temporary fix till the .properties files for all modules gets changed in production
gcLFU="https://commerce.wsj.com/auth/submitlogin";
