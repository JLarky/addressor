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
	var nbsp = ' ';
	window.bind_to_storage = function($element, key, callback) {
		return $element.val(get_val(key)).bind('paste keyup change', function() {
			var $this = $(this);
			setTimeout(function() {
				save_val(key, $this.val());
				if (jQuery.isFunction(callback)) {
					callback();
				}
			}, 0);
		});
	};
	Array.prototype.filter = function(filter) {
		var output = new Array();
		for (var i = 0; i < this.length; i++) {
			var el = this[i];
			if (filter(el)) {
				output.push(el)
			}
		}
		return output;
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
	String.prototype.add_dot = function(strings) {
		var t = this;
		strings.map(function(e) {
			t = t.replace(RegExp("^"+e+'\\s'), e+'.'+nbsp) // 'ул ' -> 'ул._'
			     .replace(RegExp("\\s"+e+'$'), ' '+e+'.') // ' обл' -> ' обл.'
			     .replace(RegExp("\\s"+e+'\\s'), ' '+e+'.'+nbsp); // ' д ' -> ' д._'
		})
		return t;
	};
	String.prototype.prepend_nbsp = function(strings) {
		var t = this;
		strings.map(function(e) { // ' обл.' -> '_обл.'
			t = t.replace(RegExp("\\s"+e+'$'), nbsp+e)
			     .replace(RegExp("\\s"+e+','), nbsp+e+',');
		})
		return t;
	};
	
})(window.jQuery);


/* trigger when page is ready */
$(document).ready(function (){

	// your functions go here
	var nbsp = ' ';

	var $input =$("#addr_input")
	  , $input2 = $("#other_input")
	  , $output = $("#addr_output")
	  , $output21 = $("#addr_output21")
	  , $output22 = $("#addr_output22")
	  , $output3 = $("#addr_output3")
	  , $output4 = $("#addr_output4")
	  , addr_output = {};

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
				index = full_addr.splice(i, 1)[0];
			}
		}
		// бывает так, что после индекса нет запятой
		var index_tail = index.substring(6).trim();
		if (index_tail) {
			index = index.substring(0,6);
			full_addr = [index_tail].concat(full_addr);
		}
		var rgn = full_addr.splice(0,1)
		  , addr = full_addr.join(', ');
		return [name, rgn, addr, index];
	}

	var format_name_string = function(val) {
		return val
			.replace(/муниципальное унитарное предприятие/i, "МУП")
			.replace(/государственное унитарное предприятие/i, "ГУП")
			.replace(/общество с ограниченной ответственностью/i, "ООО")
			.replace(/открытое акционерное общество/i, "ОАО")
			.replace(/закрытое акционерное общество/i, "ЗАО")
			.replace(/индивидуальный предприниматель/i, "ИП")
			.trim();
	}

	var format_addr_string = function(val) {
		var split_join_dot = function(string) {return string.split_join('.', '.'+nbsp)}; // д.6 -> д. 6
		val = val.split(',').trim().map(split_join_dot).join(', '); // г. Москва,д. 6 -> г. Москва, д. 6
		return val
			.replace("."+nbsp+",", '.,') // обл. , -> обл.,
			.replace(/россия,/i, "")
			.replace(/(\ |^)область/g, "$1обл.")
			.replace(/(\ |^)район/g, "$1р-н")
			.replace(/(\ |^)р-он/g, "$1р-н")
			.replace(/(\ |^)пос/g, "$1п")
			.replace(/(\ |^)город/g, "$1г")
			.add_dot(["обл", "г", "п", "ул", "д"])
			.trim()
			.prepend_nbsp(["обл.", "р-н"])
			.replace(" д.", nbsp+"д.");
	}

	var format_addr = function(val) {
		var name = val[0]
		  , rgn = val[1]
		  , addr = val[2]
		  , index = val[3];
		name = format_name_string(name);
		addr = format_addr_string(addr);
		rgn = format_addr_string(rgn);
		addr = addr
			.replace(rgn+", ", '') // удаляем регион из адреса (если он продублирован)
			.trim();
		return {name: name, rgn: rgn, addr: addr, index: index};
	}

	var parse_addr = function() {
		var val = $input.val().split('\n').trim();
		val = val.filter(function(e) {return e;})
		if (val.length > 2) {
			var out = parse_order(val);
		} else {
			// чем больше запятых тем больше шанс, что это адрес, а не название организации
			val = val.sort(function(a,b) {return b.split(',').length-a.split(',').length;})
			var out = parse_update(val);
		}
		out = out.trim()
		out = format_addr(out);
		addr_output = out;
		var title = JSON.stringify(out, null, 2).replace(RegExp(nbsp, 'g'), '_');
		$output.attr('title', title);
		$output.val([out.name, out.rgn+',', out.addr, out.index].join('\t'));
		$output21.val(out.name);
		$output22.val([out.index, out.rgn, out.addr].join(', '));

	};

	var parse_sum = function() {
		var val = $input2.val().split('\n').trim();
		val = val.filter(function(e) {return e;});
		if (!val[0]) return;
		var sum = val[0].replace(/\s/g, '')
		  , code = val[1];
		$output3.val(number_to_string(sum));
		var filename=code+' '+addr_output['name'].replace(/"/g, '')
		$output4.val(filename);
		console.log(sum, code)
	};

	var change = function() {
		parse_addr();
		parse_sum();
	};

	bind_to_storage($input, 'addr_input', change);
	bind_to_storage($input2, 'sum_input', change).change();

	$("textarea, input").click(function() {
		$(this).select()
	})
});
