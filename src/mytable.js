(function(factory){
    "use strict";
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (window.jQuery) {
      factory(window.jQuery);
    }	
}(function($){
	var MyTable = function(el, opt) {
	  this._el = el;
	  this._opt = opt;
	  this._data=[];
	  this._init();
	  var $el = $(el);
	  this._multiSelectable($el.data('selectabled')||!!opt.selectabled);
	  $el.delegate('td[data-editabled=true] input', 'focusout',
        $.proxy(this._editFocusout,this));
	  $el.delegate('td[data-editabled=true]', 'click',
        $.proxy(this._cellClick,this));
	};
	MyTable.prototype = {
      constructor: MyTable,
	  _init: function() {
	    var self=this,tb=$(self._el),opt=self._opt,
		hd=opt.header,hdstr='<thead><tr>';
		if($('thead', tb).length===0) {
		  for(var i=0;i<hd.length;i++) {
		    var h = hd[i];
		    hdstr+='<th>'+(h.text||'')+'</th>';			
		  }
		  hdstr+='</tr></thead>';
		  tb.append($(hdstr));
		}
	  },
	  _cell:function(h,row,ind) {
		var tdstr=null,val=row[h.key]||'';
	    if(typeof h.renderer==='function') {			  
		  val=h.renderer(row, ind, h);			
		}
		if(!!h.input) {
		  tdstr='<input type="'+h.input+
		  '" name="'+h.key+'" value="'+val+'" >';
	    } else {
		  tdstr=val;
	    }
		return tdstr;
	  },
	  insert:function(row, ind) {
	    var self=this,tb=$(self._el),opt=self._opt,
		hd=opt.header,trstr='<tr>',
		data=self._data;
		for(var i=0;i<hd.length;i++) {
		  var h = hd[i];
		  trstr+='<td data-editabled="';
		  trstr+=!!h.editabled;
		  trstr+='">';		  
		  trstr+=self._cell(h, row, ind);
		  trstr+='</td>';	
	    }
	    trstr+='</tr>';
		tb.append($(trstr).data('row', row));
		data[data.length]=row;
		tb.trigger('update');
		return self;
	  },
	  update: function(row, col, val) {
	    var self=this,
		tb=$(self._el);
		if(col!==undefined) {
		  this._update(row, col, val);
		}
		this.refresh(row);
		tb.trigger('update');		  
	  },
	  _update: function(row, col, val) {
	    var self=this,data=this._data,
		tb=$(self._el),opt=self._opt,
		hd=opt.header,
		tr=$('tr:eq('+(row+1)+')', tb),
	    td=$('td:eq('+col+')', tr),
		text = val;
		if(data[row][hd[col].key]!==val) {
		  data[row][hd[col].key]=val;
		}
		if(typeof hd[col].renderer==='function') {
		  text = hd[col].renderer(data[row],hd[col]);
		}
	    td.html(text);
		return self;
	  },
	  refresh: function(i) {
		var data = this._data;
		if(typeof i==='number') {
		  this._refreshRow(i);
		} else {
		  i = 0;
		  for(;i<data.length;i++) {
		    this._refreshRow(i);
		  }
		}
	  },
	  _refreshRow: function(i) {
		var data = this._data, row=data[i],
		  hd=this._opt.header;
	    for(var j=0;j<hd.length;j++) {			
		  this._update(i, j, row[hd[j].key]);
	    }  
	  },
	  rowId: function(row) {
		var opt=this._opt;
		if(typeof opt.rowId==='function') {
		  return opt.rowId(row);
		} else {
		  return row.id;
		}
	  },
	  remove: function(rows) {
	    var self=this,tb=$(self._el),
		data=self._data,
		isRemove=function(id){
		  var ret = false;
		  for(var j=0;!!rows&&j<rows.length;j++) {
			var row=rows[j];
			if(id===self.rowId(row)) {
			  ret=true;
			  break;
			}
		  }
		  return ret;
		};		
		for(var i=0;i<data.length;) {
		  var tr = $('tr:eq('+(i+1)+')', tb),
		  item=data[i];
		  if(isRemove(self.rowId(item))) {
			data.splice(i,1);
			tr.remove();
		  } else {
			i++;
		  }
		}
		tb.trigger('update');
		return self;		  
	  },
	  removeAll: function() {
	    var self=this,tb=$(self._el),
		data=self._data;
		data.splice(0,data.length);
		$('tr:gt(0)', tb).remove();
		tb.trigger('update');
	  },
	  selecteds: function() {
	    var self=this,tb=$(self._el),
		data=self._data,rows=[];
		for(var i=0;i<data.length;i++) {
		  var tr = $('tr:eq('+(i+1)+')', tb);
		  if(tr.is('.active')) {
			rows[rows.length]=data[i];
		  }
		}
		return rows;
	  },
	  data:function(rows) {
		var self=this;
		if(rows!==undefined) {
		  this.removeAll();
		  for(var i=0;i<rows.length;i++) {
		    var row = rows[i];
		    self.insert(row, i);
		  }
		  return self;
		} else {
		  return self._data;
		}
	  },
	  select:function(ind) {
	    var self=this,tb=$(self._el),opt=this._opt;
		if(!!opt.selectabled) {
		  if(typeof ind==='number') {			
		    $('tr:eq('+(ind+1)+')', tb).toggleClass('active');
		  } else {
		    $('tr:gt(0)', tb).toggleClass('active');
		  }
		}
	  },
	  _multiSelectable: function(enabled) {
	    var self=this,tb=$(self._el);
		if(!!enabled) {
		  /*
		  tb.on('mousedown', 'tr:gt(0)', function(e){
			if($(e.target).is('td')) {
			  if(!$(e.target).is('[contenteditable=true]')) {
		        e.preventDefault(); 
		        e.stopPropagation();
			  }
			  var el = $(e.currentTarget);
			  el.toggleClass('active');
			  self._mousedown=true;
			}
		  });
		  tb.on('mouseover', 'tr:gt(0)', function(e){
		    e.preventDefault(); 
		    e.stopPropagation();
			var el = $(e.currentTarget);
		    if(self._mousedown) {
			  el.toggleClass('active');
			}
		  });
		  tb.on('mouseup', 'tr:gt(0)', function(){
			self._mousedown=false;
		  });
		  */
		  tb.on('click', 'tr:gt(0)', function(e){
			var el = $(e.currentTarget);
			el.addClass('active');
			el.siblings().removeClass('active');
		  });
		}
	  },
	  _editFocusout: function(e) {
	    var self=this,data=self._data,
		tb=$(self._el),opt=self._opt,
		hd=opt.header,		
		input=$(e.target),
		td = input.closest('td'),
		tr = input.closest('tr'),
		row=$('tr:gt(0)', tb).index(tr),
		col=$('td',tr).index(td),
		val = input.val(),oldVal=data[row][hd[col].key];
		try {
		  if(hd[col].type==='float') {
		    val = parseFloat(val);
		  }
		  if(hd[col].type==='int') {
		    val = parseInt(val);
		  }
		} catch(e) {
		  console.log(e);
		}
		if(val!==oldVal) {
		  this._row=row;
		  this._col=col;
		  this._val = oldVal;
		  this.update(row, col, val);
		  tb.trigger('edit', [data[row], hd[col], oldVal]);
		} else {
		  this._update(row, col, val);			
		}
	  },
	  reset: function() {
		this.update(this._row, this._col, this._val);		  
	  },
	  placeCaretAtEnd: function(el) {
		if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
		  var range = document.createRange();
		  range.selectNodeContents(el);
		  range.collapse(false);
		  var sel = window.getSelection();
		  sel.removeAllRanges();
		  sel.addRange(range);
		} else if (typeof document.body.createTextRange !== "undefined") {
		  var textRange = document.body.createTextRange();
		  textRange.moveToElementText(el);
		  textRange.collapse(false);
		  textRange.select();
		}
	  },
	  _cellClick: function(e) {
		var tb=$(this._el), 
		opt = this._opt,
		data = this._data,
		el = $(e.target),
		tr = el.closest('tr'),
		hd=opt.header,
		row=$('tr:gt(0)', tb).index(tr),
		col=$('td',tr).index(el);
		if(el.is('td')) {
		  var text = data[row][hd[col].key],
		  input = $('<input name="temp" value="'+text+'" />');
		  el.empty();
		  el.append(input);
		  input.focus();
		}
	  },
	  col: function(key) {
		var hd = this._opt.header,ind=-1;
		for(var i=0;i<hd.length;i++) {
		  if(key===hd[i].key) {
			  ind = i;
			  break;
		  }
        }
		return ind;
	  }
	};
    $.fn.mytable = function(option) {
        var pickerArgs = arguments;

        return this.each(function() {
            var $this = $(this),
            inst = $this.data('mytable'),
            options = ((typeof option === 'object') ? option : {});
            if ((!inst) && (typeof option !== 'string')) {
                $this.data('mytable', new MyTable(this, options));
            } else {
                if (typeof option === 'string') {
                    inst[option].apply(inst, Array.prototype.slice.call(pickerArgs, 1));
                }
            }
        });
    };
}));