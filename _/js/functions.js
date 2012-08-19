function save_val(key, value) {
	if (Modernizr.localstorage) {
		localStorage.setItem(key, value);
	}
	if (Modernizr.sessionstorage) {
		sessionStorage.setItem(key, value);
	}
};

function get_val(key) {
	if (Modernizr.localstorage) {
		return localStorage[key];
	}
	if (Modernizr.sessionstorage) {
		return sessionStorage[key];
	}
};

// remap jQuery to $
(function($){
	window.bind_to_storage = function($element, key, callback) {
		return $element.val(get_val(key)).bind('paste keyup change', function() {
			var $this = $(this);
			setTimeout(function() {
				var val = $this.val();
				save_val(key, val);
				if (jQuery.isFunction(callback)) {
					callback(val);
				}
			}, 0);
		});
	};
	Array.prototype.trim = function() {
		return this.map(function(e) {return $.trim(e)});
	};
	String.prototype.trim = function() {
		return $.trim(this);
	};
	String.prototype.split_join = function(separator, delimiter) {
		return this.split(separator).trim().join(delimiter);
	};
	
})(window.jQuery);


/* trigger when page is ready */
$(document).ready(function (){

	// your functions go here
	var $input =$("#addr_input")
	  , $output = $("#addr_output");

	var parse_order = function(val) {
		var index = val[0]
		  , rgn = val[1]
		  , addr = val[2]
		  , name = val[3];
		return [name, rgn, addr, index];
	}

	var parse_update = function(val) {
		var full_addr = val[0].split(',').trim()
		  , name = val[1]
		  , index = '';

		for (var i = 0; i < full_addr.length; i++) {
			if (!!full_addr[i].match(/\d{6}/)) { // индекс
				index = full_addr.splice(i, 1);
			}
		}
		var rgn = full_addr.splice(0,1)
		  , addr = full_addr.join(', ');
		return [name, rgn, addr, index];
	}

	var format_addr_string = function(val) {
		var split_join_dot = function(string) {return string.split_join('.', '. ')}; // д.6 -> д. 6 
		val = val.split(',').trim().map(split_join_dot).join(', '); // г. Москва,д. 6 -> г. Москва, д. 6 
		return val
			.replace(". ,", '.,') // обл. , -> обл.,
			.replace("область", "обл.")
			.replace("район", "р-н")
			.trim();
	}

	var format_addr = function(val) {
		var name = val[0]
		  , rgn = val[1]
		  , addr = val[2]
		  , index = val[3];
		addr = format_addr_string(addr);
		rgn = format_addr_string(rgn);
		addr = addr
			.replace(rgn+", ", '')
			.trim();
		return [name, rgn+',', addr, index];
	}

	var parse_addr = function(val) {
		var val = val.split('\n').trim();
		if (val.length > 3) {
			var out = parse_order(val);
		} else {
			var out = parse_update(val);
		}
		out = out.trim()
		out = format_addr(out);
		console.log(out);
		out = out.join('\t')
		$output.val(out);
	};
	bind_to_storage($input, 'addr_input', parse_addr);
	bind_to_storage($output, 'addr_output');

});
