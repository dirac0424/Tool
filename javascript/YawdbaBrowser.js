
function YawdbaBrowser()	{
	this.browser = navigator.userAgent;
	var browser_type = ' ';
	var wait = null;
	var cur_ondrag = null;
	var body;
	if(0 <= this.browser.indexOf('MSIE'))		
		browser_type = 'E';
	else if(0 <= this.browser.indexOf('Opera'))
		browser_type = 'O';
	else if(0 <= this.browser.indexOf('Chrome'))
		browser_type = 'C';
	else if(0 <= this.browser.indexOf('Safari'))
		browser_type = 'S';
	else if(0 <= this.browser.indexOf('Firefox'))
		browser_type = 'F';
	else if(0 <= this.browser.indexOf('Mozilla'))
		browser_type = 'M';
	this.type = browser_type;
	
	this.width = function()	{
		return(browser_type != 'E')?innerWidth:window.document.body.clientWidth;
	}
	this.height = function()	{
		return(browser_type != 'E')?innerHeight:window.document.body.clientHeight;
	}
	this.getMousePosition = function(e)	{
		var obj = new Object();

		if(browser_type != 'E')	{
			obj.x = e.pageX;
			obj.y = e.pageY;
		}
		else	{
			obj.x = event.x + document.body.scrollLeft;
			obj.y = event.y + document.body.scrollTop;			
		}
		return obj;
	}
	this.getMouseButton = function(e)	{
		switch(browser_type)	{
		case 'E':switch(event.button)	{
			 case 1 :return 'L'; 
			 case 2 :return 'R'; 
			 default:return 'E';
			}
		default:switch(e.button) {
			 case 0: return 'L'; 
			 case 2: return 'R'; 
			 default:return 'E'; 
			}
		}
		return 'E';
	}
	this.writeText = function(s)	{
		var	r = new String();
		if(browser_type == 'E')	{
			for(var i=0; i<s.length; i++)	{
				r += s.charAt(i);
				if(i < s.length-1)
					r += "<wbr>";
			}
			return r;
		} 
		else	{
			for(var i=0; i<s.length; i++)	{
				r += s.charAt(i);
				if(i < s.length-1)
					r += "&shy;";
			}
		}
		return r;
	}
	this.cssFloat = function(obj, stylevalue)	{
		if(browser_type == 'E')	
			obj.style.styleFloat = stylevalue;
		else
			obj.style.cssFloat = stylevalue;
	}
	this.getEventObject = function(e)	{
		return ((browser_type == 'F')?e.target:event.srcElement);	
	}
	this.getObjWidth  = function(obj)	{
		var padding = 1; // = obj.style.padding;
		if(obj == null)
			return 0;
		else
			return obj.clientWidth - padding * 2; 
	}
	this.setOpacity = function(div, r)	{
		if(browser_type == 'E')
			div.style.filter = 'alpha(opacity=' + Math.ceil(r*100) + ')';
		else
			div.style.opacity = r;
			
	}
}
