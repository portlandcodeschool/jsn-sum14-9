var today = new Date();
var monthLength = function(year, month) {
  return new Date(year, month + 1, 0).getDate();
};
var firstDay = function(year, month) {
  return new Date(year, month, 1).getDay();
};
var monthName = function(month) {
  return monthNames[month];
};
var MonthView = function(date){

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function makeTable(date) {
    var table = document.createElement('table');
    table.classList.add('month_view', 'calendar');
    var thead = document.createElement('thead');
    var currentYear = date.getYear();
    var currentMonth = date.getMonth();
    var monthStart = new Date(currentYear, currentMonth, 1); // holds the date for the month creation loop

    var getStart = function() {
      if (monthStart.day() !== 0) {
        monthStart.setDate(monthStart.getDate() - 1 );
        getStart();
      } else {
        return;
      }
    };
    getStart();

    var makeHeader = function() {
      for (i=0; i<7; i++) {
        var th = document.createElement('th');
        var day = document.createTextNode(dayNames[i]);
        th.appendChild(day);
        thead.appendChild(th);
      }
      table.appendChild(thead);
    };
    makeHeader();

    var rowCount = function(year, month) {
      //console.log('checking ' + monthLength(year, month) + ' + ' + firstDay(year, month) );
      return Math.ceil((monthLength(year, month) + firstDay(year, month))/7);
    };

    var height = rowCount(date.getYear(), date.getMonth());
    var tr, td;

    for (var rows = 0; rows < height; rows++) {
      var row = document.createElement('tr');
      table.appendChild(row);
      var cellDateCounter = 0;
      var workingDate = new Date(monthStart.getYear(), monthStart.getMonth(), monthStart.getDate());
      for (var cellCount = 0; cellCount < 7; cellCount++) {
        var cell = document.createElement('td');
        workingDate.setDate(monthStart + cellDateCounter);
        var cellDate = workingDate.getDate();
        var dateSpan = document.createElement('span');
        var dateText = document.createTextNode(cellDate);
        dateSpan.appendChild(dateText);
        cell.appendChild(dateSpan);
        row.appendChild(cell);
      }
    }
    return table;

  }

  function MonthMaker(date) {
    var table = makeTable(date);
    document.body.appendChild(table);
  }

return MonthMaker;
}();
