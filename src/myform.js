(function(factory){
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (window.jQuery) {
    factory(window.jQuery);
  }	
}(function($){
  var MyForm = function(el, opt) {
    var self = this;
    self._el = el;
    self._opt = opt;
    $(self._el).on('submit', $.proxy(self._submit, self));
  };
  MyForm.prototype = {
    _submit:function(){
      var self = this,
          el = self._el,
          fm = $(el);
      fm.trigger('mf.submit');
      self._doSubmit();
        return false;
    },
    _submited: function(resp) {
      var self = this,
          el = self._el,
          fm = $(el);
      fm.trigger('mf.submited', resp);
    },
    _doSubmit: function() {
      var self = this,
          el = self._el,
          opt = self._opt||{},
          fm = $(el),
          fd = fm.serialize(),
          ctype = 'application/x-www-form-urlencoded',
          processData = true;
      if($(':file', fm).size()>0) {
        fd = new FormData(el);
        ctype = false;
        processData = false;
      }
      $.ajax({
        method:fm.attr('method')||'POST',
        url:fm.attr('action')||opt.url,
        contentType:ctype,
        processData:processData,
        data:fd,
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