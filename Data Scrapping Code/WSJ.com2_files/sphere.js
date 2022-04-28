function TransformIE() {
var xslt = new ActiveXObject("Msxml2.XSLTemplate.3.0");

var xslObj = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.3.0")
xslObj.async = false
xslObj.load("/static_html_files/xsl/sphere.xsl")

xslt.stylesheet = xslObj;

 // load the xml file, example1.xml
var xmlObj = new ActiveXObject("Msxml2.DOMDocument.3.0")
xmlObj.async = false
//xmlObj.load("/static_html_files/sphere.xml")
xmlObj.load("/sphere/widgets/sphereit/content.php?siteid=wsj_teaser&url=http://online.wsj.com/article/"+articleId+".html");

var xslProc = xslt.createProcessor();
xslProc.input = xmlObj;
xslProc.addParameter("articleId", articleId);
xslProc.addParameter("loggedIn", loggedIn);
xslProc.transform()

 document.getElementById('sphere_container').innerHTML = xslProc.output;
}

function TransformNotIE(){
  var xslStylesheet;
  var xsltProcessor = new XSLTProcessor();

  var xmlDoc;
  // load the xslt file, example1.xsl
  var myXMLHTTPRequest = new XMLHttpRequest();
  myXMLHTTPRequest.open("GET", "/static_html_files/xsl/sphere.xsl", false);
  myXMLHTTPRequest.send(null);

  xslStylesheet = myXMLHTTPRequest.responseXML;
  xsltProcessor.importStylesheet(xslStylesheet);

  // load the xml file, example1.xml
  myXMLHTTPRequest = new XMLHttpRequest();
  //myXMLHTTPRequest.open("GET", "/static_html_files/sphere.xml", false);
  myXMLHTTPRequest.open("GET", "/sphere/widgets/sphereit/content.php?siteid=wsj_teaser&url=http://online.wsj.com/article/"+articleId+".html", false);
  myXMLHTTPRequest.overrideMimeType('text/xml');
  myXMLHTTPRequest.send(null);

  xmlDoc = myXMLHTTPRequest.responseXML;

  xsltProcessor.setParameter("", "articleId", articleId);
  xsltProcessor.setParameter("", "loggedIn", loggedIn);

  var fragment = xsltProcessor.transformToFragment(xmlDoc, document);

  if (fragment.childNodes[0].nodeValue == null) {  document.getElementById('sphere_container').appendChild(fragment);
}
  xsltProcessor.reset();
} 
