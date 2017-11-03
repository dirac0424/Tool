
function YawdbaDialog(hYW, id, t, w, h)	{
	var mdiv;
	var dialog   = document.createElement('div');
	var body     = document.getElementsByTagName('body');
	var cur_p = null;
	var dlg_x = 0;
	var dlg_y = 0;
	var title_height = 0;
	if(id == 'YawdbaModal')	{
		mdiv = document.createElement('div');
		mdiv.style.position = 'absolute';
		mdiv.style.top    = '0px'
		mdiv.style.left   = '0px';
		mdiv.style.width  = hYW.width();
		mdiv.style.height = hYW.height();
		mdiv.oncontextmenu = function(e)	{
			return false;
		}
		hYW.setOpacity(mdiv,0.2);
	}
	/* ダイアログ画面のdiv */
	dialog.id = id;
	if(w > 0)	dialog.style.width  = w + 'px';
	if(h > 0)	dialog.style.height = (h + title_height) + 'px';
	dialog.oncontextmenu = function(e)	{
		return false;
	}
	if(t != null)	{
		/* タイトルのdiv */
		title_height = 20;
		var title = document.createElement('div');
		title.innerHTML = t;
		title.align = 'left';
		if(0 < w) title.style.width  = w + 'px';
		title.style.height = title_height + 'px';
		title.style.color = 'white';
		title.style.fontSize = (title_height - 4) + 'px';
		title.style.padding  = '1';
		title.style.backgroundColor = 'DarkSlateGray';
		title.style.border = 'solid 2px black';
		dialog.appendChild(title);

		dialog.onmousedown = function(e)	{
			if(hYW.getMouseButton(e) == 'L')	{
				cur_p = hYW.getMousePosition(e); 
				dlg_x = parseInt(dialog.style.left);
				dlg_y = parseInt(dialog.style.top);
				dialog.style.cursor = 'move';
				title.style.cursor = 'move'
			}
		}
		dialog.onmousemove = function(e)	{
			if(cur_p != null)	{
				if(hYW.getMouseButton(e) == 'L')	{
					var new_p = hYW.getMousePosition(e);
					var delta_x = new_p.x - cur_p.x;
					var delta_y = new_p.y - cur_p.y;
					if(2 <= Math.abs(delta_x) || 2 <= Math.abs(delta_y))	{
						dialog.style.left = parseInt(dialog.style.left) + delta_x;
						dialog.style.top  = parseInt(dialog.style.top)  + delta_y;
						cur_p = new_p;
					}
				}
				else	{
					cur_p = null;
					dialog.style.cursor = 'default';
					title.style.cursor = 'default';
				}
			}
		}
		dialog.onmouseup = function(e)	{
			cur_p = null;
			dialog.style.cursor = 'default';
			title.style.cursor = 'default';
		}
		dialog.onmouseout = function(e)	{
			cur_p = null;
			dialog.style.cursor = 'default';
			title.style.cursor = 'default';
		}
		dialog.onmouseover = function(e)	{
			if(cur_p == null)	{
				dialog.style.cursor = 'hand';
				title.style.cursor = 'hand';
			}
		}
		/*　クローズボタンのdiv */
		var close = document.createElement('input');
		close.type = 'button';
		close.value = '×';
		close.style.position = 'absolute';
		close.style.height = title_height + 'px';
		close.style.width  = title_height + 'px';
		close.style.top   = '0px';
		close.style.right = '0px';
		close.onclick = function() {
			myquit();
		}
		close.onmouseover = function()	{
			close.style.cursor = 'hand';
		}
		title.appendChild(close);
	}

	/* ダイアログボディのdiv */
	var pane  = document.createElement('div');
	pane.style.position = 'absolute';
	pane.style.top = title_height + 'px';
	pane.style.left = '0px';
	if(w > 0)	pane.style.width = w + 'px';
	if(h > 0)	pane.style.height = h + 'px';
	pane.style.backgroundColor = 'Gainsboro';
	pane.style.border = 'solid 2px black';
	dialog.appendChild(pane);
	this.root   = pane; 	
	this.width  = w;
	this.height = h;

	this.show = function(arg1,arg2)	{
		var x;
		var y;
		switch(arguments.length)	{
		case 1: x = hYW.getMousePosition(arg1).x; 
			y = hYW.getMousePosition(arg1).y;
			break;
		case 2: x = arg1;
			y = arg2;
			break;
		defalut:
			x = -1;
			y = -1;
			break;
		}
		if(0 <= x && 0 <= y)	{
			dialog.style.position = 'absolute';
			dialog.style.left = x + 'px';
			dialog.style.top  = y + 'px';
		}
		else
			dialog.style.position = 'relative';
		if(id == 'YawdbaModal')		{
			body[0].appendChild(mdiv);
			body[0].appendChild(dialog);
			mdiv.style.backgroundColor = 'white';
		}
		else
			body[0].appendChild(dialog);
	}
	this.quit = function()	{
		myquit();
	}
	function myquit()	{
		if(id == 'YawdbaModal')
			body[0].removeChild(mdiv);
		body[0].removeChild(dialog);
	}
	
}

function YawdbaMenu(hYW, id, t, values, w, c)	{
	var mlist = new YawdbaTable();
	mlist.setCSV("表示項目|値", values);
	var title = t;
	var width = w;
	var count = c;
	var menu;
	var option;
	var dialog = null;
	var parent = null;
	var xpos = -1;
	var ypos = -1;

	create_menu(count);
	this.mlist = mlist;
	this.menu  = menu;

	this.resetOption = function(values)	{
		mlist.clear();
		mlist.setCSV(null, values);
		if(parent != null)	{
			parent.removeChild(menu);
			delete menu;
		}
		else
			delete menu;
		create_menu(count);
		if(parent != null)	{
			this.attach(parent,xpos,ypos);
		}
	}

	this.show = function(arg1, arg2)	{
		dialog = new YawdbaDialog(hYW, 'YawdbaModal', null, width, -1);
		menu.style.position = 'absolute';
		menu.style.left = '0px';
		menu.style.top  = '0px';
		dialog.root.appendChild(menu);
		switch(arguments.length)	{
		case 1: dialog.show(arg1);
			break;
		case 2: dialog.show(arg1,arg2);
			break;
		default:dialog.show();
			break;
		}
	}
	this.attach = function(p, x, y)	{
		parent = p;
		xpos = x;
		ypos = y;
		menu.style.position   = 'absolute';
		if(x >= 0)	menu.style.left  = x;
		if(y >= 0)	menu.style.top   = y;
		parent.appendChild(menu);
	}
	this.quit = function()	{
		if(dialog != null)
			dialog.quit();
	}
	function create_menu(c)	{
		var cc;
		menu = document.createElement('select');
		menu.id = id;

		if(c == -1)	{
			cc =  mlist.data.length;
			if(title != null)	cc++;
		}
		else
			cc = c;
		
		if(width >= 0)	menu.style.width = width;
		if(0 < cc)	menu.setAttribute('size',cc);

		if(title != null && title != '')	{
			option = document.createElement('option');
			option.innerHTML = title;
			option.setAttribute("value","title");
			option.style.backgroundColor = "black";
			option.style.color = "white";
			menu.appendChild(option);
		}

		for(var i=0; i<mlist.data.length; i++)	{
			option = document.createElement('option');
			option.innerHTML = mlist.getData(i,"表示項目");
			option.setAttribute("value",mlist.getData(i,"値"));
			menu.appendChild(option);
		}
	}
}

function YawdbaColorPallet(hYW, c, option)	{
	this.parent = parent;
	var client = c;
	var has_transparent;
	var cPTB = new YawdbaTable();

	has_transparent = (0 <= option.indexOf("hasTransparent"))?Boolean(true):Boolean(false);	 
	cPTB.setCSV("cname|cvalue",
	"white               |#FFFFFF,"+
	"Snow                |#FFFAFA,"+
	"GhostWhite          |#F8F8FF,"+
	"WhiteSmoke          |#F8F8FF,"+
	"FloralWhite         |#F5F5F5,"+
	"Linen               |#FAF0E6,"+
	"AntiqueWhite        |#FAEBD7,"+
	"PapayaWhip          |#FFEFD5,"+
	"BlanchedAlmond      |#FFEBCD,"+
	"Bisque              |#FFE4C4,"+
	"Moccasin            |#FFE4B5,"+
	"NavajoWhite         |#FFDEAD,"+
	"PeachPuff           |#FFDAB9,"+
	"MistyRose           |#FFDAB9,"+
	"LavenderBlush       |#FFF0F5,"+
	"Seashell            |#FFF5EE,"+
	"OldLace             |#FDF5E6,"+
	"Ivory               |#FFFFF0,"+
	"Honeydew            |#F0FFF0,"+
	"MintCream           |#F5FFFA,"+
	"Azure               |#F0FFFF,"+
	"AliceBlue           |#F0F8FF,"+
	"lavender            |#E6E6FA,"+
	"Black               |#000000,"+
	"DarkSlateGray       |#2F4F4F,"+
	"DimGray             |#696969,"+
	"Gray                |#808080,"+
	"DarkGray            |#A9A9A9,"+
	"Silver              |#C0C0C0,"+
	"LightGrey           |#D3D3D3,"+
	"Gainsboro           |#DCDCDC,"+
	"LightSlateGray      |#778899,"+
	"SlateGray           |#708090,"+
	"LightSteeBlue       |#B0C4DE,"+
	"SteeBlue            |#4682B4,"+
	"RoyalBlue           |#4169E1,"+
	"MidnightBlue        |#191970,"+
	"Navy                |#000080,"+
	"Darkblue            |#00008B,"+
	"MediumBlue          |#0000CD,"+
	"Blue                |#0000FF,"+
	"DodgerBlue          |#1E90FF,"+
	"CornflowerBlue      |#6495ED,"+
	"DeepSkyBlue         |#00BFFF,"+
	"LightSkyBlue        |#87CEFA,"+
	"SkyBlue             |#87CEEB,"+
	"LightBlue           |#ADD8E6,"+
	"PowderBlue          |#B0E0E6,"+
	"PaleTurquoise       |#AFEEEE,"+
	"LightCyan           |#E0FFFF,"+
	"Cyan                |#00FFFF,"+
	"Aqua                |#00FFFF,"+
	"Turquoise           |#40E0D0,"+
	"MediumTurquoise     |#48D1CC,"+
	"DarkTurquoise       |#00CED1,"+
	"LightSeaGreen       |#20B2AA,"+
	"CadetBlue           |#5F9EA0,"+
	"Darkcyan            |#008B8B,"+
	"Teal                |#008080,"+
	"SeaGreen            |#2E8B57,"+
	"DarkOliveGreen      |#556B2F,"+
	"DarkGreen           |#006400,"+
	"Green               |#008000,"+
	"ForestGreen         |#228B22,"+
	"MediumSeaGreen      |#3CB371,"+
	"DarkSeaGreen        |#8FBC8F,"+
	"MediumAquamarine    |#66CDAA,"+
	"Aquamarine          |#7FFFD4,"+
	"PaleGreen           |#98FB98,"+
	"LightGreen          |#90EE90,"+
	"SpringGreen         |#00FF7F,"+
	"MediumSpringGreen   |#00FA9A,"+
	"LawnGreen           |#7CFC00,"+
	"Chartreuse          |#7FFF00,"+
	"GreenYellow         |#ADFF2F,"+
	"Lime                |#00FF00,"+
	"LimeGreen           |#32CD32,"+
	"YellowGreen         |#9ACD32,"+
	"OliveDrab           |#6B8E23,"+
	"Olive               |#808000,"+
	"DarkKhaki           |#BDB76B,"+
	"PaleGoldenrod       |#EEE8AA,"+
	"Cornsilk            |#FFF8DC,"+
	"Beige               |#F5F5DC,"+
	"LightYellow         |#FFFFE0,"+
	"Lightgoldenrodyellow|#FAFAD2,"+
	"LemonChiffon        |#FFFACD,"+
	"Wheat               |#F5DEB3,"+
	"Burlywood           |#DEB887,"+
	"Tan                 |#D2B48C,"+
	"Khaki               |#F0E68C,"+
	"Yellow              |#FFFF00,"+
	"Gold                |#FFD700,"+
	"Orange              |#FFA500,"+
	"SandyBrown          |#F4A460,"+
	"DarkOrange          |#FF8C00,"+
	"goldenrod           |#DAA520,"+
	"Peru                |#CD853F,"+
	"DarkGoldenrod       |#B8860B,"+
	"Chocolate           |#D2691E,"+
	"Sienna              |#A0522D,"+
	"SaddleBrown         |#8B4513,"+
	"Maroon              |#800000,"+
	"DarkRed             |#8B0000,"+
	"Brown               |#A52A2A,"+
	"Firebrick           |#B22222,"+
	"IndianRed           |#CD5C5C,"+
	"RosyBrown           |#BC8F8F,"+
	"DarkSalmon          |#E9967A,"+
	"LightCoral          |#F08080,"+
	"Salmon              |#FA8072,"+
	"LightSalmon         |#FFA07A,"+
	"Coral               |#FF7F50,"+
	"Tomato              |#FF6347,"+
	"OrangeRed           |#FF4500,"+
	"Red                 |#FF0000,"+
	"Crimson             |#DC143C,"+
	"MediumVioletRed     |#C71585,"+
	"DeepPink            |#FF1493,"+
	"HotPink             |#FF69B4,"+
	"PaleVioletRed       |#DB7093,"+
	"Pink                |#DDC0CB,"+
	"LightPink           |#FFB6C1,"+
	"Thistle             |#D8BFD8,"+
	"Magenta             |#FF00FF,"+
	"Fuchsia             |#FF00FF,"+
	"Violet              |#EE82EE,"+
	"Plum                |#DDA0DD,"+
	"Orchid              |#DA70D6,"+
	"MediumOrchid        |#BA55D3,"+
	"DrakOrchid          |#9932CC,"+
	"DarkViolet          |#9400D3,"+
	"DarkMagenta         |#8B008B,"+
	"Purple              |#800080,"+
	"Indigo              |#4B0082,"+
	"DarkSlateBlue       |#483D8B,"+	
	"BlueViolet          |#8A2BE2,"+
	"MediumPurple        |#9370DB,"+
	"SlateBlue           |#6A5ACD,"+
	"MediumSlateBule     |#7B68EE"
	);
	var dialog = new YawdbaDialog(hYW, 'YawdbaModal', 'カラーパレット', 180, 360);
	creatPallet(dialog.root, cPTB, dialog);

	this.show = function(arg1,arg2)	{
		switch(arguments.length)	{
		case 1: dialog.show(arg1);
			break;
		case 2: dialog.show(arg1,arg2);
			break;
		defalut:dialog.show();
			break;
		}
	}

	function creatPallet(canvas, cPTbl, dialog)	{
		var root = document.createElement('div');
		root.style.position = 'absolute';
		root.style.top      = '0px';
		root.style.left     = '0px';
		var win_h = dialog.height;
		var win_w = dialog.width;
		var base = 0;
		var w = 20;
		var h = 15;
		var cp_x;
		var cp_y;
		var x = 0;
		var y = 0;

		canvas.appendChild(root);
		if(has_transparent)	{
			var tobj = document.createElement('div');
			tobj.id = 'colortag';
			tobj.style.position = 'absolute';
			tobj.style.top    = '0px';
			tobj.style.left   = '0px';
			tobj.style.width  = w * 2 - 2 + 'px';
			tobj.style.height = h - 1 + 'px';
			tobj.style.backgroundColor = 'white';
			tobj.style.border = 'solid 1px black';
			tobj.style.padding = '1px';
			tobj.style.fontSize = '7pt';
			tobj.style.textAlign = 'center';
			tobj.style.verticalAlign = 'middle';
			tobj.innerHTML = '透明';
			tobj.onclick = function()	{
				getcolor(canvas,root,'none');
			}
			tobj.onmouseover = function()	{
				tobj.style.cursor = 'hand';
			}
			tobj.onmouseout = function()	{
				tobj.style.cursor = 'default';
			}
			root.appendChild(tobj);
			base = 16
		}
		for(var i=0; i<cPTbl.rowSIZE; i++)	{
			var obj = document.createElement('div');
			obj.id = 'colortag';
			obj.name = cPTbl.getData(i,'cname');
			if(y == 20)	{
				y = 0;
				x++;
			}
			obj.style.position = 'absolute';
			obj.style.top    = (y * h + base) + 'px';
			obj.style.left   = x * w + 'px';
			obj.style.width  = (w - 2) + 'px';
			obj.style.height = (h - 2) + 'px';
			obj.style.backgroundColor = cPTbl.getData(i,'cvalue');
			obj.style.border = 'solid 1px black';
			obj.onclick = function(){
				getcolor(canvas, root, this.style.backgroundColor);
			}
			obj.onmouseover = function()	{
				this.style.cursor = 'hand';
			}
			obj.onmouseout = function()	{
				this.style.cursor = 'default';
			}
			root.appendChild(obj);
			y++;
		}
		cp_x = Math.max(Math.round(win_w / 2 - ((x+1) * w) / 2),0);
		cp_y = Math.max(Math.round(win_h / 2 - ((y+1) * h + base) / 2),0);
		root.style.left = cp_x + 'px';
		root.style.top  = cp_y + 'px';
	}
	function getcolor(canvas, root, c)	{
		if(client.tagName.toLowerCase() == 'input')	{
			if(c == 'none')	{
				client.style.backgroundColor = 'white';
				client.style.color = 'black';
			}
			else	{
				client.style.backgroundColor = c;
				client.style.color = c;
			}
			client.value = c;
		}
		else	
			client.style.backgroundColor = c;
		dialog.quit();
	}
}

function YawdbaTable()	{
	this.label = new Array();
	this.data  = new Array();
	this.sepCOL  = '|';
	this.sepREC  = ',';
	this.rowSIZE = -1;
	this.colSIZE = -1;
	this.web_id = '';
	this.web_cols = null;
	this.web_flds = null;
	this.filters  = new Array();
	this.web_gap  = 100;
	var hYW= new YawdbaBrowser();

	this.getData = function(row_ix,col)	{
		var col_ix = this.col_index(col);
		if(col_ix == -1) 
			return null;
		if(0 <= row_ix && row_ix < this.data.length)	{
			var row = this.data[row_ix];
			if(0 <= col_ix && col_ix < row.length)
				return row[col_ix];
			else
				return null;
		}
		return null;
	}
	this.show = function(parent, id, fldstr, colstr, filterstr)	{
		var label = (this.label == null)?null:this.label[0];
		var data  = this.data;
		var interval = this.web_gap;
		var ix     = 0;
		var web_id = id;
		var web_
		var colWidth = null;
		var colArray = create_table_array(colstr,this.repREC, this.sepCOL);
		var tblhead;
		var tblbody;
		var divbody;
		var div;
		var prv;
		var adv;
		//var body = document.getElementsByTagName('body');
		//var mask = null;

		if(colArray != null && colArray[0] != null)
			colWidth = colArray[0];
		else
			colWidth = null;
		div = document.createElement('div');
		div.id = id + '_root';
		hYW.cssFloat(div,'left');
		div.style.backgroundColor = 'Ivory';
		parent.appendChild(div);

		if(interval < data.length)	{
			var ldiv = document.createElement('div');
			hYW.cssFloat(ldiv,'left');
			prv = document.createElement('a');
			prv.setAttribute('href','javascript:void(0)');
			prv.innerHTML = '&lt;前へ';
			prv.onclick = function() {
				if (0 < ix)	{
					ix--;
					div.removeChild(divbody);
					divbody = show_tableBody(hYW, div, label.length, data, colWidth, web_id, ix, interval);
					tblbody = divbody.firstChild;
					adjustCell(hYW, label.length, tblhead, tblbody);
					divbody.style.width = tblbody.offsetWidth + 17;
				}
				else
					alert('テーブルの先頭です');
			}
			ldiv.appendChild(prv);
			var rdiv = document.createElement('div');
			rdiv.style.textAlign = 'right';
			adv = document.createElement('a');
			adv.setAttribute('href','javascript:void(0)');
			adv.innerHTML = '後へ&gt;';
			/*
			adv.onmousedown = function()	{
				mask = document.createElement('div');
				mask.style.position = 'absolute';
				mask.style.top = 0;
				mask.style.left = 0;
				mask.style.width = '1200px';
				mask.style.height = '1000px';
				mask.style.backgroundColor = 'green';
				mask.style.cursor          = 'wait';
				hYW.setOpacity(mask,0.2);
				body[0].appendChild(mask);
			}
			*/
			adv.onclick = function() {
				if((ix+1) * interval < data.length)	{ 
					ix++;
					div.removeChild(divbody);
					divbody = show_tableBody(hYW, div, label.length, data, colWidth, web_id, ix, interval);
					tblbody = divbody.firstChild;
					adjustCell(hYW, label.length, tblhead, tblbody);
					divbody.style.width = tblbody.offsetWidth + 17;
				}
				else	{
					alert('テーブルの最後です');
				}
			}
			
			rdiv.appendChild(adv);
			div.appendChild(ldiv);
			div.appendChild(rdiv);
		}
		tblhead = show_tableHead(hYW, div, label, colWidth, web_id, filterstr);
		divbody = show_tableBody(hYW, div, label.length, data, colWidth, web_id, ix, interval);
		tblbody = divbody.firstChild;
		adjustCell(hYW, label.length, tblhead, tblbody);
		divbody.style.width = tblbody.offsetWidth + 17;
	}
	this.setCSV = function(lstr,str)	{
		var tmp
		var ch;
		var s;
		var e;
		
		if(lstr != null)	{
			this.label = create_table_array(lstr,this.sepREC, this.sepCOL);
		}
		if(str != null)
			this.data  = create_table_array(str, this.sepREC, this.sepCOL);
		this.rowSIZE = this.data.length;
		this.colSIZE = this.label[0].length; 
	}
	this.clear = function()	{
		delete this.data;
		this.data  = new Array();
		this.rowSIZE = -1;
	}
	this.sort = function(col,order)	{
		var col_ix = this.col_index(col);
		if(col_ix == -1) 
			return null;
		
	}
	this.dump = function()	{
		var s = new String();
		s += 'label -> {' ;
		for (var i=0; i<this.label[0].length; i++)	{
			s += ('['+i+':' + this.label[0][i]+']');
			s += ',';	
		}
		s += '}\n';
		s += 'data ->\n'
		for(var i=0; i< this.data.length; i++)	{
			s += '{';
			var row = this.data[i];
			for(var j=0; j<row.length; j++)	{
				s += row[j];
				s += ', ';
			}
			s += '}\n';
		}
		return (s);
	}
	this.col_index = function(col)	{
		if(isNaN(col))	{
			for(col_ix = 0; col_ix < this.label[0].length; col_ix++)	{
				if(this.label[0][col_ix] == col)
					break;
			}
			if(this.label[0].length <= col_ix)
				return -1; 
		}
		else	{
			col_ix = col;
		}
		return col_ix;
	}
	function redraw()	{
		alert(this.label.length);
	}
	function show_tableHead(hYW, parent, label, colWidth, id, filterstr)	{
		var table;
		var header;
		var tr;
		var th;
		var td;
		var tbody;
		var thead;
		var maxcol = label.length;

		table = document.createElement('table');
		table.id = id + '_HEAD';
		if(0 < maxcol)	{
			thead = document.createElement('thead');
			tr = document.createElement('tr');
			for (var i=0; i<maxcol; i++)	{
				th = document.createElement('th');
				th.id = 'hC' + i;
				th.innerHTML = hYW.writeText(label[i]);
				if(colWidth != null &&  colWidth[i] != '') {
					th.style.width = colWidth[i];
				}
				tr.appendChild(th);	
			}
			thead.appendChild(tr);
			table.appendChild(thead);

			tbody = document.createElement('tbody');
			if(filterstr != null)	{
				tr = document.createElement('tr');
				for (var i=0; i<maxcol; i++)	{
					td = document.createElement('td');
					td.id = 'hCF' + i;
					td.innerHTML = '&nbsp;';
					tr.appendChild(td);	
					var m = new YawdbaMenu(td, 'Filter_'+i, 0, 0, 40, null, 'aaaa|1,bbbb|2', 1);
				}
				tbody.appendChild(tr);
			}
			table.appendChild(tbody);
		}
		parent.appendChild(table);
		return table;
	}
	function show_tableBody(hYW, parent, maxcol, data, colWidth, id, ix, interval)	{
		var table;
		var header;
		var tr;
		var th;
		var td;
		var tbody;
		var thead;
		var maxrow = data.length;

		var div = document.createElement('div');
		hYW.cssFloat(div,'left');
		div.id = id;
		div.style.height = '200px';
		div.style.overflowY = 'auto';

		table = document.createElement('table');
		table.id = id + '_BODY';

		tbody = document.createElement('tbody');

		var start = ix * interval;
		var end   = start + interval;
		for(var i=start; i< Math.min(end, maxrow); i++)	{
			var rec = data[i];
			tr = document.createElement('tr');
			for(var j=0; j<rec.length; j++)	{
				td = document.createElement('td');
				td.id = 'dC' + j;
				td.innerHTML = hYW.writeText(rec[j]);
				if(colWidth != null &&  colWidth[j] != '') {
					td.style.width = colWidth[j];
				}
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		div.appendChild(table);
		parent.appendChild(div);
		return div;
	}
	function adjustCell(hYW, c, head, body)	{
		var h_tr = head.firstChild.firstChild.childNodes;
		var d_tr = body.firstChild.childNodes;
		var wh;
		var wd;
		var r;

		//r = d_tr.length;
		r = 1;
		for(i = 0; i<c; i++)	{
			if(h_tr[i].style.width == '' || h_tr[i].style.width != d_tr[0].childNodes[i].style.width)	{
				wd = 0;
				for(j=0; j<r; j++)	{
					wd = Math.max(wd, hYW.getObjWidth(d_tr[j].childNodes[i]));
				}
				if(wd < 50)	wd = 50;
				for(j=0; j<r; j++)	{
					if(wd != hYW.getObjWidth(d_tr[j].childNodes[i]))
						d_tr[j].childNodes[i].style.width = wd + 'px';
				}
			}
		}
		for(i=0; i<c; i++)	{
			if(h_tr[i].style.width == '' || h_tr[i].style.width != d_tr[0].childNodes[i].style.width)	{
				wd = hYW.getObjWidth(d_tr[0].childNodes[i]);
				if(hYW.getObjWidth(h_tr[i]) != wd)
					h_tr[i].style.width = wd;
			}
			//alert('hr[' + i + ']=' + h_tr[i].clientWidth + 'hd[' + i + ']=' + d_tr[0].childNodes[i].clientWidth);
		}
	}
	function create_table_array(str, sepREC, sepCOL)	{
		if(str == null || str.length == 0)
			return null;
		var tbl = new Array();
		var rec = new Array();
		var r = 0;
		var c = 0;
		rec[c] = '';
		for(var i=0; i<str.length; i++)	{
			var ch = str.charAt(i);
			if(ch == '\\')	{
				i++;
				if(i < str.length)	
					rec[c] += str.charAt(i);
			}
			else	{
				if(ch == sepCOL)	{
					c++;
					rec[c] = '';
				}
				else if(ch == sepREC)	{
					tbl[r] = rec;
					rec = new Array();
					r++;
					c = 0;
					rec[c] = '';
				}
				else	{
					rec[c] += ch;
				}
			}
		}
		tbl[r] = rec;
		return tbl;
	}
}

