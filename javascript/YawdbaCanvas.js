function YawdbaCanvas(hYW, parent, x, y, w, h)	{
	if(hYW.type == 'E')		
		canvas = new CanvasVML(hYW, parent, x, y, w, h);
	else
		canvas = new CanvasSVG(hYW, parent, x, y, w, h);
	return canvas;
}

function CanvasVML(hYW, parent, x, y, w, h)	{
	var div = document.createElement('div');
	div.id = 'drawcanvas';
	div.style.position = 'absolute';
	div.style.left = x;
	div.style.top  = y;
	div.style.width = w;
	div.style.height = h;
	div.style.backgroundColor = 'Ivory';
	div.oncontextmenu = function(e)	{
		return false;
	}
	parent.appendChild(div);
	this.pane = div;
	this.top = y;
	this.left = x;
	this.width = w;
	this.height = h;
	this.root = div;

	this.getcursor = function(e)	{
		var pos = hYW.getMousePosition(e);
		pos.x = pos.x - parseInt(x);
		pos.y = pos.y - parseInt(y);
		return pos;
	}
	this.creatLine = function(id, x1, y1, x2, y2)	{
		var obj = document.createElement('v:line');
		obj.id = id;
		if(arguments.length != 1)	/* */
			this.setLine(obj,x1, y1, x2, y2);
		div.appendChild(obj);
		return obj;
	}
	this.setLine = function(obj,x1,y1,x2,y2)	{
		if(x1 != -1 && x2 != -1 && y1 != -1 && y2 != -1 ) 	{
			obj.style.position = 'absolute';
			obj.style.top  = y1;
			obj.style.left = x1;
			obj.setAttribute("from", "0,0");
			obj.setAttribute("to",   (x2 - x1) + "," + (y2 - y1));
		}
	}
	this.creatRect = function(id, x1, y1, x2, y2)	{
		var obj = document.createElement('v:rect');
		obj.id = id;
		if(arguments.length != 1)	/* */
			this.setRect(obj,x1, y1, x2, y2);
		div.appendChild(obj);
		return obj;
	}
	this.setRect = function(obj, x1, y1, x2, y2)	{
		if(x1 != -1 && x2 != -1 && y1 != -1 && y2 != -1 ) 	{
			var w = x2 - x1;
			var h = y2 - y1;
			obj.style.position = 'absolute';
			obj.style.top    = (h>0)?y1:y1 + h;
			obj.style.left   = (w>0)?x1:x1 + w;
			obj.style.width  = Math.abs(w);
			obj.style.height = Math.abs(h);
		}
	}
	this.creatOval = function(id, x1, y1, x2, y2)		{
		var obj = document.createElement('v:oval');
		obj.id = id;
		if(arguments.length != 1)	/* */
			this.setOval(obj,x1, y1, x2, y2);
		div.appendChild(obj);
		return obj;
	}
	this.setOval = function(obj, x1, y1, x2, y2)	{
		if(x1 != -1 && x2 != -1 && y1 != -1 && y2 != -1 ) 	{
			var w = x2 - x1;
			var h = y2 - y1;
			obj.style.position = 'absolute';
			obj.style.top    = (h>0)?y1:y1 + h;
			obj.style.left   = (w>0)?x1:x1 + w;
			obj.style.width  = Math.abs(w);
			obj.style.height = Math.abs(h);
		}
	}
	this.setStrokeAttr = function(obj, type, color, weight, opacity)	{
		/*【type】
		solid           実線
		shortdot  	短点線		0 2
		dot		点線		1 2
		shortdash	短破線		2 2
		dash		破線		4 2
		longdash	長破線		8 2
		shortdashdot	短一点鎖線	2 2 0 2
		shortdashdotdot	短ニ点鎖線	2 2 0 2 0 2
		dashdot		一点鎖線<	4 2 1 2
		longdashdot	長一点鎖線	8 2 1 2
		longdashdotdot	長ニ点鎖線	8 2 1 2 1 2
		*/
		var stroke = getObjByTag(obj,'v:stroke');
		if(type != null)
			stroke.setAttribute('dashstyle',type);
		if(color != null)	{
			if(color == 'none')
				obj.setAttribute('stroked','false');
			else	{
				obj.setAttribute('stroked','true');
				obj.setAttribute('strokecolor', color);
			}
		}
		if(weight != null)
			obj.setAttribute('strokeweight', weight);
		if(opacity != null)
			stroke.setAttribute('opacity', opacity);
	}
	this.changeAttr = function(obj, strokecolor, strokeweight, fillcolor)	{
		var attr = new Object(); 
		attr.strokecolor  = new String(obj.getAttribute('strokecolor'));
		attr.strokeweight = new String(obj.getAttribute('strokeweight'));
		attr.fillcolor    = new String(obj.getAttribute('fillcolor'));
		if(strokecolor != null)
			obj.setAttribute('strokecolor', strokecolor);
		if(strokeweight != null)
			obj.setAttribute('strokeweight', strokeweight);
		if(fillcolor != null)	{
			obj.setAttribute('fillcolor', fillcolor);
		}
		return attr;
	}
	this.restoreAttr = function(obj, attr)	{
		obj.setAttribute('strokecolor',  attr.strokecolor);
		obj.setAttribute('strokeweight', attr.strokeweight);
		obj.setAttribute('fillcolor',    attr.fillcolor);	
	}
	this.setFillAttr = function(obj, type, color, color_sub, shadow_type, opacity)	{
		/*
		【type】
		solid		単色
		hgradation	水平グラデーション
		vgradation	垂直グラデーション
		 */
		var fill = getObjByTag(obj,'v:fill');
		var extrusion = getObjByTag(obj,'v:extrusion');
		var shadow = getObjByTag(obj,'v:shadow');

		if(color != null)	{
			if(color == 'none')	
				obj.setAttribute("filled",'false');
			else	{
				obj.setAttribute('filled','true');
				obj.setAttribute('fillcolor', color);
			}
		}
		if(type == 'hgradation')	{
			fill.setAttribute("type","gradient");
			fill.setAttribute("angle","0");
		}
		else if(type == 'vgradation')	{
			fill.setAttribute("type","gradient");
			fill.setAttribute("angle","270");
		}
		if (color_sub != null　&& (type == 'hgradation' || type == 'vgradation'))	{
			if(color_sub != 'none')
				fill.setAttribute("color2",color_sub);	
			else
				fill.removeAttribute("color2");
		}

		if(shadow_type != null)	{
			if(shadow_type != 'none')	{
				if(shadow_type.charAt(0) == 'e')	{
					var ext = shadow_type.substring(1);
					shadow.setAttribute("on","false");
					extrusion.setAttribute("on","true");
					extrusion.setAttribute("backdepth", ext);
				}
				else if(shadow_type.charAt(0) == 's')	{
					var shd = shadow_type.substring(1);
					extrusion.setAttribute("on","false");
					shadow.setAttribute("on","true");
					shadow.setAttribute("type","single");
					shadow.setAttribute('offset',shd+'pt,'+shd+'pt');
					shadow.setAttribute('opacity',fillopacity());
				}
			}
			else	{
				extrusion.setAttribute("on","false");
				shadow.setAttribute("on","false");
			}
		}

		if(opacity != null)							
			fill.setAttribute('opacity',opacity);
	}
	this.transfObj = function(obj, deltaX, deltaY)	{
		obj.style.left = parseInt(obj.style.left) + deltaX;
		obj.style.top  = parseInt(obj.style.top)  + deltaY;
	}
	this.removeObj  = function(obj)	{
		div.removeChild(obj);
	}
	function getObjByTag(obj,tagName)	{
		var child  = null;
		var tag = (tagName.indexOf(':')==-1)?tagName:(tagName.substring(tagName.indexOf(':')+1));
		for(var i=0; i<obj.childNodes.length; i++)	{
			if(obj.childNodes[i].tagName == tag)	{
				child = obj.childNodes[i];
				break;
			}
		}
		if(child == null)	{
			child = document.createElement(tagName);
			obj.appendChild(child);
		}
		return child;
	}
}
function CanvasSVG(hYW, parent, x, y, w, h)	{
	var svgNS = "http://www.w3.org/2000/svg";
	var div = document.createElement('div');
	div.id = 'drawcanvas';
	div.style.position = 'absolute';
	div.style.left = x;
	div.style.top  = y;
	div.style.width = w;
	div.style.height = h;
	div.style.backgroundColor = 'Ivory';
	parent.appendChild(div);
	div.oncontextmenu = function(e)	{
			return false;
		}
	var svg = document.createElementNS(svgNS,"svg");
	svg.id = "svg";
	svg.setAttributeNS(null,"width" , w + "px");
	svg.setAttributeNS(null,"height", h + "px");
	div.appendChild(svg);
	this.pane = svg; 
	this.top = y;
	this.left = x;
	this.width = w;
	this.height = h;
	this.root = div;

	this.getcursor = function(e)	{
		var pos = hYW.getMousePosition(e);
		pos.x = pos.x - parseInt(x);
		pos.y = pos.y - parseInt(y);
		return pos;
	}
	this.creatLine = function(id, x1, y1, x2, y2)	{
		var obj = document.createElementNS(svgNS,'line');
		obj.id = id;
		if(arguments.length != 1)	/* */
			this.setLine(obj,x1, y1, x2, y2);
		svg.appendChild(obj);
		return obj;
	}
	this.setLine = function(obj,x1,y1,x2,y2)	{
		if(x1 != -1 && x2 != -1 && y1 != -1 && y2 != -1 ) 	{
			obj.setAttribute("x1",x1);
			obj.setAttribute("y1",y1);
			obj.setAttribute("x2",x2);
			obj.setAttribute("y2",y2);			
		}
	}
	this.creatRect = function(id, x1, y1, x2, y2)	{
		var obj = document.createElementNS(svgNS,'rect');
		obj.id = id;
		if(arguments.length != 1)	/* */
			this.setRect(obj,x1, y1, x2, y2);
		svg.appendChild(obj);		
		return obj;
	}
	this.setRect = function(obj, x1, y1, x2, y2)	{
		if(x1 != -1 && x2 != -1 && y1 != -1 && y2 != -1 ) 	{
			var w = x2 - x1;
			var h = y2 - y1;
			obj.setAttribute("x",(w>0)?x1:x1 + w);
			obj.setAttribute("y",(h>0)?y1:y1 + h);
			obj.setAttribute("width",Math.abs(w));
			obj.setAttribute("height",Math.abs(h));
		}
	}
	this.creatOval = function(id, x1, y1, x2, y2)		{
		var obj = document.createElementNS(svgNS,'ellipse');
		obj.id = id;
		if(arguments.length != 1)	/* */
			this.setOval(obj,x1, y1, x2, y2);
		svg.appendChild(obj);		
		return obj;	
		return obj;
	}
	this.setOval = function(obj, x1, y1, x2, y2)	{
		if(x1 != -1 && x2 != -1 && y1 != -1 && y2 != -1 ) 	{
			var w = x2 - x1;
			var h = y2 - y1;
			obj.setAttribute("cx",(x1+x2)/2);
			obj.setAttribute("cy",(y1+y2)/2);
			obj.setAttribute("rx",Math.abs(w)/2);
			obj.setAttribute("ry",Math.abs(h)/2);	
		}
	}
	this.setStrokeAttr = function(obj, type, color, weight, opacity)	{
		var w = weight;
		/*【type】
		solid           実線
		shortdot  	短点線		0 2
		dot		点線		1 2
		shortdash	短破線		2 2
		dash		破線		4 2
		longdash	長破線		8 2
		shortdashdot	短一点鎖線	2 2 0 2
		shortdashdotdot	短ニ点鎖線	2 2 0 2 0 2
		dashdot		一点鎖線<	4 2 1 2
		longdashdot	長一点鎖線	8 2 1 2
		longdashdotdot	長ニ点鎖線	8 2 1 2 1 2
		*/
		if(color != null)
			obj.setAttribute("stroke", color);
		if(weight != null)
			obj.setAttribute("stroke-width", weight);
		if(type != null)	{
			switch(type)	{
			case 'shortdot':
				obj.setAttribute("stroke-dasharray", w/2 +","+ w*2);
				break;
			case 'dot':
				obj.setAttribute("stroke-dasharray", w*1 +","+ w*2);
				break;
			case 'shortdash':
				obj.setAttribute("stroke-dasharray", w*2 +","+ w*2);
				break;
			case 'dash':
				obj.setAttribute("stroke-dasharray", w*4 +","+ w*2);
				break;
			case 'longdash':
				obj.setAttribute("stroke-dasharray", w*8 +","+ w*2);
				break;
			case 'shortdashdot':
				obj.setAttribute("stroke-dasharray", w*2 +","+ w*2 +","+ w/2 +","+ w*2);
				break;
			case 'shortdashdotdot':
				obj.setAttribute("stroke-dasharray", w*2 +","+ w*2 +","+ w/2 +","+ w*2 +","+ w +","+ w*2);
				break;
			case 'dashdot':
				obj.setAttribute("stroke-dasharray", w*4 +","+ w*2 +","+ w*1 +","+ w*2);
				break;
			case 'longdashdot':
				obj.setAttribute("stroke-dasharray", w*8 +","+ w*2 +","+ w*1 +","+ w*2);
				break;
			case 'longdashdotdot':
				obj.setAttribute("stroke-dasharray", w*8 +","+ w*2 +","+ w*1 +","+ w*2 + ","+ w*1 +","+ w*2);
				break;
			}
		}
		if(opacity != null)
			obj.setAttribute("stroke-opacity", opacity);
	}
	this.setFillAttr = function(obj, type, color, color_sub, shadow_type, opacity)	{
		var parent = obj.parentNode;
		/* 詳細の検討が必要 */
		if(color != null)	
			obj.setAttribute('fill', color);
		if(type == 'hgradation')	{
			var g_obj_id = obj.getAttribute('id') + '_g';
			var gradation = document.getElementById(g_obj_id);
			if(gradation == null)
				gradation = document.createElementNS(svgNS,'linearGradient');
			else	{
				for(var i=gradation.childNodes.length-1; 0 < i; i--)
					gradation.removeChild(gradation.childNodes[i]);
			}
			//var gradation = document.createElementNS(svgNS,'linearGradient');
			obj.setAttribute("style","fill:url(#"+g_obj_id+")");
			gradation.setAttribute("id",g_obj_id);
			gradation.setAttribute("x1","0%");
			gradation.setAttribute("x2","0%");
			gradation.setAttribute("y1","100%");
			gradation.setAttribute("y2","0%");
			var stop1 = document.createElementNS(svgNS,'stop');
			stop1.setAttribute('stop-color',color);
			stop1.setAttribute('offset','0%');
			gradation.appendChild(stop1);
			var stop2 = document.createElementNS(svgNS,'stop');
			if(color_sub == null || color_sub == 'none')
				stop2.setAttribute('stop-color','white');
			else
				stop2.setAttribute('stop-color',color_sub);
			stop2.setAttribute('offset','95%');
			gradation.appendChild(stop2);
			obj.parentNode.appendChild(gradation);
		}
		else if(type == 'vgradation')	{
			var obj_id = obj.getAttribute('id') + '_g';
			var gradation = getObjById(obj, obj_id, 'linearGradient');
			obj.setAttribute("style","fill:url(#"+obj_id+")");
			gradation.setAttribute("id",obj_id);
			gradation.setAttribute("y1","0%");
			gradation.setAttribute("y2","0%");
			gradation.setAttribute("x1","0%");
			gradation.setAttribute("x2","100%");
			var stop1 = document.createElementNS(svgNS,'stop');
			stop1.setAttribute('stop-color',color);
			stop1.setAttribute('offset','0%');
			gradation.appendChild(stop1);
			var stop2 = document.createElementNS(svgNS,'stop');
			if(color_sub == null || color_sub == 'none')
				stop2.setAttribute('stop-color','white');
			else
				stop2.setAttribute('stop-color',color_sub);
			stop2.setAttribute('offset','95%');
			gradation.appendChild(stop2);
			obj.parentNode.appendChild(gradation);
		}
		else	{
			var g_obj_id = obj.getAttribute('id') + '_g';
			var g_obj = document.getElementById(g_obj_id);
			if(g_obj != null)
				parent.removeChild(g_obj);
			obj.removeAttribute('style');
		}
		if(shadow_type != null)	{
			if(shadow_type != 'none')	{
				if(shadow_type.charAt(0) == 'e')	{
					// SVGでは、できない
				}
				else if(shadow_type.charAt(0) == 's')	{
					var shd = shadow_type.substring(1);
					var f_obj_id = obj.getAttribute('id') + '_f';
					var filter = getObjById(obj, f_obj_id, 'filter');
					obj.setAttribute("filter","url(#"+f_obj_id+")");
					filter.setAttribute("id",f_obj_id);
					var gaussian = document.createElementNS(svgNS,'feGaussianBlur');
					gaussian.setAttribute("in","SourceAlpha");
					gaussian.setAttribute("stdDeviation","4");
					gaussian.setAttribute("result","blur");
					var offset = document.createElementNS(svgNS,'feOffset');
					offset.setAttribute("in","blur");
					offset.setAttribute("dx",shd);
					offset.setAttribute("dy",shd);
					offset.setAttribute("result","offsetBlur");
					filter.appendChild(gaussian);
					filter.appendChild(offset);
					var merge = document.createElementNS(svgNS,'feMerge');
					var node1 = document.createElementNS(svgNS,'feMergeNode');
					node1.setAttribute("in", "offsetBlur");
					var node2 = document.createElementNS(svgNS,'feMergeNode')
					node2.setAttribute("in","SourceGraphic");
					merge.appendChild(node1);
					merge.appendChild(node2);
					filter.appendChild(merge);
					obj.parentNode.appendChild(filter);
				}
			}
			else	{
				var f_obj_id = obj.getAttribute('id') + '_f';
				var f_obj = document.getElementById(f_obj_id);
				if(f_obj != null)
					parent.removeChild(f_obj);
				obj.removeAttribute('filter');
			}
		}

		if(opacity != null)							
			obj.setAttribute('fill-opacity',opacity);
	}
	this.changeAttr = function(obj, strokecolor, strokeweight, fillcolor)	{
		var attr = new Object(); 
		attr.strokecolor  = new String(obj.getAttribute('stroke'));
		attr.strokeweight = new String(obj.getAttribute('stroke-width'));
		attr.fillcolor    = new String(obj.getAttribute('fill'));
		if(strokecolor != null)
			obj.setAttribute('stroke', strokecolor);
		if(strokeweight != null)
			obj.setAttribute('stroke-width', strokeweight);
		if(fillcolor != null)	{
			obj.setAttribute('fill', fillcolor);
		}
		return attr;
	}
	this.restoreAttr = function(obj, attr)	{
		obj.setAttribute('stroke',  attr.strokecolor);
		obj.setAttribute('stroke-width', attr.strokeweight);
		obj.setAttribute('fill',    attr.fillcolor);	
	}
	this.transfObj = function(obj, deltaX, deltaY)	{
		if(obj.tagName == 'line')	{
			obj.setAttribute("x1",parseInt(obj.getAttribute('x1')) + deltaX);
			obj.setAttribute("y1",parseInt(obj.getAttribute('y1')) + deltaY);
			obj.setAttribute("x2",parseInt(obj.getAttribute('x2')) + deltaX);
			obj.setAttribute("y2",parseInt(obj.getAttribute('y2')) + deltaY);
		}
		else if(obj.tagName == 'rect')	{
			obj.setAttribute("x",parseInt(obj.getAttribute('x')) + deltaX);
			obj.setAttribute("y",parseInt(obj.getAttribute('y')) + deltaY);
		}
		else if(obj.tagName == 'ellipse')	{
			obj.setAttribute("cx",parseInt(obj.getAttribute('cx')) + deltaX);
			obj.setAttribute("cy",parseInt(obj.getAttribute('cy')) + deltaY);
		}
	}
	this.removeObj  = function(obj)	{
		var parent = obj.parentNode;
		var id = obj.getAttribute('id');
		var f_obj_id = obj.getAttribute('id') + '_f';
		var g_obj_id = obj.getAttribute('id') + '_g';
		var f_obj = document.getElementById(f_obj_id);
		if(f_obj != null)
			parent.removeChild(f_obj);
		var g_obj = document.getElementById(g_obj_id);
		if(g_obj != null)
			parent.removeChild(g_obj);
		this.pane.removeChild(obj);
	}
	function getObjById(obj, id, tag)	{
		var parent = obj.parentNode;
		var target = document.getElementById(id);
		if(target == null)	{
			target = document.createElementNS(svgNS,tag);
			target.setAttribute("id",id);
			parent.appendChild(target);
		}
		return target;
	}
}


