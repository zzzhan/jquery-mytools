(function(factory){
    "use strict";
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (window.jQuery) {
      factory(window.jQuery);
    }	
}(function($){
  var MyForm = function(el, opt) {
    this._el = el;
    this._opt = opt;
	$(this._el).on('submit', $.proxy(this._submit, this));
  };
  MyForm.prototype = {
	_submit:function(){
	  var fm = $(this._el);
	  fm.trigger('mf.submit');
	  this._doSubmit();
      return false;
    },
	_submited: function(resp) {
	  var fm = $(this._el);
	  fm.trigger('mf.submited', resp);
	},
	_doSubmit: function() {
	  var fm = $(this._el);
	  $.ajax({
		method:fm.attr('method')||'POST',
		url:fm.attr('action'),
		data:fm.serialize(),
		success:$.proxy(this._submited, this)
	  });
	}
  };
  $.fn.myform = function(option) {
	var pickerArgs = arguments;

	return this.each(function() {
		var $this = $(this),
		inst = $this.data('myform'),
		options = ((typeof option === 'object') ? option : {});
		if ((!inst) && (typeof option !== 'string')) {
			$this.data('myform', new MyForm(this, options));
		} else {
			if (typeof option === 'string') {
				inst[option].apply(inst, Array.prototype.slice.call(pickerArgs, 1));
			}
		}
	});
  };
}));