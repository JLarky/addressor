
/*
original version (PHP) belongs to runcore
http://habrahabr.ru/post/53210/

Edited by JLarky <jlarky@gmail.com>
 *
 * Возвращает сумму прописью
 * @ author runcore
 * @ uses morph(...)
 *
*/


(function() {
  var morph, str_split;

  window.number_to_string = function(num) {
    var a20, gender, hundred, i1, i2, i3, kop, leading_zeros, nul, out, rub, ten, tens, uk, unit, v, zeros, _i, _len, _ref, _ref1, _ref2;
    nul = 'ноль';
    ten = [['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'], ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']];
    a20 = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
    tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
    hundred = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
    unit = [['копейка', 'копейки', 'копеек', 1], ['рубль', 'рубля', 'рублей', 0], ['тысяча', 'тысячи', 'тысяч', 1], ['миллион', 'миллиона', 'миллионов', 0], ['миллиард', 'милиарда', 'миллиардов', 0]];
    _ref = parseFloat(num).toFixed(2).split('.'), rub = _ref[0], kop = _ref[1];
    if ((leading_zeros = 12 - rub.length) < 0) {
      return false;
    }
    zeros = ((function() {
      var _results;
      _results = [];
      while (leading_zeros--) {
        _results.push('0');
      }
      return _results;
    })());
    rub = zeros.join('') + rub;
    out = [];
    if (rub > 0) {
      _ref1 = str_split(rub, 3);
      for (uk = _i = 0, _len = _ref1.length; _i < _len; uk = ++_i) {
        v = _ref1[uk];
        if (!(v > 0)) {
          continue;
        }
        uk = unit.length - uk - 1;
        gender = unit[uk][3];
        _ref2 = str_split(v, 1), i1 = _ref2[0], i2 = _ref2[1], i3 = _ref2[2];
        out.push(hundred[i1]);
        if (i2 > 1) {
          out.push(tens[i2] + ' ' + ten[gender][i3]);
        } else {
          out.push(i2 > 0 ? a20[i3] : ten[gender][i3]);
        }
        if (uk > 1) {
          out.push(morph(v, unit[uk][0], unit[uk][1], unit[uk][2]));
        }
      }
    } else {
      out.push(nul);
    }
    out.push(morph(rub, unit[1][0], unit[1][1], unit[1][2]));
    out.push(kop + ' ' + morph(kop, unit[0][0], unit[0][1], unit[0][2]));
    return out.join(' ').replace(RegExp(' {2,}', 'g'), ' ').trimLeft();
  };

  /*
   *
   * Склоняем словоформу
   * @ author runcore
   *
  */


  morph = function(n, f1, f2, f5) {
    n = n % 100;
    if (n > 10 && n < 20) {
      return f5;
    }
    n = n % 10;
    if (n > 1 && n < 5) {
      return f2;
    }
    if (n === 1) {
      return f1;
    }
    return f5;
  };

  /* http://phpjs.org/functions/str_split:530
  */


  str_split = function(string, split_length) {
    var chunks, len, pos;
    if (string == null) {
      string = "";
    }
    if (split_length == null) {
      split_length = 1;
    }
    chunks = [];
    pos = 0;
    len = string.length;
    while (pos < len) {
      chunks.push(string.slice(pos, pos += split_length));
    }
    return chunks;
  };

}).call(this);
