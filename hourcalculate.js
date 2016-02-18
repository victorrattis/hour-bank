

var toMinute = function(hour) {
    var part = hour.match(/(\d+):(\d+)/i);
    var hh = parseInt(part[1], 10);
    var mm = parseInt(part[2], 10);
    return (hh * 60) + mm;
};

var toHour = function(minutes) {
    var hh = ~~(minutes / 60);
    var mm = minutes % 60;
    return "" + hh + ":" + mm;
};

var sum = function(a, b) {
    return a + b;
};

var calculate = function(day, current) {
    var registers = [];
    for(var i = 0, len = day.hours.length; i < len; i++) {
        registers[i] = toMinute(day.hours[i]);
    }

    var intervalo = [];
    var turno = [];
    var lastIndex = registers.length - 1;

    var last = 0;

    for(var i = 0, len = registers.length; i < len; i++) {
        var a = registers[i];
        var b = registers[i + 1] != undefined ? registers[i + 1] : current;
        last = b;

        if(i % 2 == 0){
            turno.push(b - a);
        }else {
            intervalo.push(b - a);
        }
    }

    return {
        registers: registers,
        turn: turno,
        intervalo: intervalo,
        working: turno.reduce(sum),
        interval: intervalo.reduce(sum),
        last: last
    }
}

module.exports.generate = function(day) {
    var total = toMinute("8:00"); // Horas de trabalho no dia
    var extra = toMinute("2:00"); // Horas maximas de horas extras no dia
    
    var c = new Date();
    var current = toMinute("" + c.getHours() + ":" + c.getMinutes());

    var result = calculate(day, current);
    var working     = result.working;
    var interval    = result.interval;
    var registers   = result.registers;

    var out = "" + result.turn.reduce(function(a, b) {return "" + toHour(a) + " + " + toHour(b);});
    console.log("t: " + out  + " = " + toHour(working));

    var out = "" + result.intervalo.reduce(function(a, b) {return "" + toHour(a) + " + " + toHour(b);});
    console.log("i: " + out  + " = " + toHour(interval));

    console.log("Hora Atual: " + toHour(current));
    console.log("worked: "     + toHour(working));
    console.log("saida: "      + toHour(result.last + total - working));
    console.log("extra: "      + toHour(result.last + total - working + extra));
};