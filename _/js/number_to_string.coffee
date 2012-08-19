###
original version (PHP) belongs to runcore
http://habrahabr.ru/post/53210/

Edited by JLarky <jlarky@gmail.com>
 *
 * Возвращает сумму прописью
 * @ author runcore
 * @ uses morph(...)
 *
###
window.number_to_string = (num) ->
    nul='ноль'
    ten=[
        ['','один','два','три','четыре','пять','шесть','семь', 'восемь','девять'],
        ['','одна','две','три','четыре','пять','шесть','семь', 'восемь','девять'],
    ]
    a20=['десять','одиннадцать','двенадцать','тринадцать','четырнадцать' ,'пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать']
    tens=['', '', 'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят' ,'восемьдесят','девяносто']
    hundred=['','сто','двести','триста','четыреста','пятьсот','шестьсот', 'семьсот','восемьсот','девятьсот']
    unit=[ # Units
        ['копейка' ,'копейки' ,'копеек'    ,1],
        ['рубль'   ,'рубля'   ,'рублей'    ,0],
        ['тысяча'  ,'тысячи'  ,'тысяч'     ,1],
        ['миллион' ,'миллиона','миллионов' ,0],
        ['миллиард','милиарда','миллиардов',0],
    ]
    [rub, kop] = parseFloat(num).toFixed(2).split('.')
    if (leading_zeros = 12-rub.length) < 0
        return false
    zeros = ('0' while leading_zeros--)
    rub = zeros.join('')+rub
    out = []
    if (rub > 0)
        for v, uk in str_split(rub, 3) # by 3 symbols
            if !(v > 0) then continue
            uk = unit.length-uk-1 # unit key
            gender = unit[uk][3]
            [i1,i2,i3] = str_split(v,1)
            # // mega-logic
            out.push hundred[i1] # 1xx-9xx
            if (i2>1) then out.push tens[i2]+' '+ten[gender][i3] # 20-99
            else out.push if i2>0 then a20[i3] else ten[gender][i3] # 10-19 | 1-9
            # units without rub & kop
            if (uk>1) then out.push morph(v,unit[uk][0],unit[uk][1],unit[uk][2])
    else out.push nul
    out.push morph(rub, unit[1][0],unit[1][1],unit[1][2]) # rub
    out.push kop+' '+morph(kop,unit[0][0],unit[0][1],unit[0][2]) # kop
    out.join(' ').replace(RegExp(' {2,}', 'g'), ' ').trimLeft()

###
 *
 * Склоняем словоформу
 * @ author runcore
 *
###
morph = (n, f1, f2, f5) ->
    n = n % 100
    if (n>10 && n<20) then return f5
    n = n % 10
    if (n>1 && n<5) then return f2
    if (n==1) then return f1
    return f5

### http://phpjs.org/functions/str_split:530 ###
str_split = (string = "", split_length = 1) ->
    chunks = []
    pos = 0
    len = string.length
    while (pos < len)
        chunks.push(string.slice(pos, pos += split_length))
    chunks
