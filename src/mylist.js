(function(factory){
    "use strict";
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (window.jQuery) {
      factory(window.jQuery);
    }	
}(function($){
  var MyList = function(el, opt) {
	var self=this;
	self._el=el;
	self._opt=opt;
	$(el).on('click', 'li', $.proxy(self._selected, this));
  };
  MyList.prototype = {
	init: function(data) {
	  var self=this,$el=$(self._el),append='';
	  for(var i=0;i<data.length;i++) {
		append+=self._li(data[i]);  
	  }	  
	  $el.empty();
	  $el.append($(append));
	  self._data=data;
	},
	_li: function(item) {
	  var self=this,opt=self._opt,text=item;
	  if(typeof opt.renderer==='function') {
		text = opt.renderer(item);
	  }
	  return '<li><a href="#">'+text+'</a></li>';
	},
	_selected:function(e) {
	  var self=this,$el=$(self._el),data=self._data,
	  ind=$el.children().index(e.currentTarget);
	  $el.trigger('selected', data[ind]);	
	},
	find: function(callback) {
	  var self=this,data=self._data,
	  ret = null;
	  for(var i=0;i<data.length;i++) {
		var item=data[i];
		if(callback(item)) {
		  ret = item;
		  break;
		}
	  }
	  return ret;
	}
  };
  $.fn.mylist = function(option) {
	var pickerArgs = arguments;

	return this.each(function() {
		var $this = $(this),
		inst = $this.data('mylist'),
		options = ((typeof option === 'object') ? option : {});
		if ((!inst) && (typeof option !== 'string')) {
			$this.data('mylist', new MyList(this, options));
		} else {
			if (typeof option === 'string') {
				inst[option].apply(inst, Array.prototype.slice.call(pickerArgs, 1));
			}
		}
	});
  };
}));