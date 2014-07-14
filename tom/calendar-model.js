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
    var div;
    var table = document.createElement('table');
    table.classList.add('month_view', 'calendar');
    var thead = document.createElement('thead');
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth();
    var monthStart = new Date(currentYear, currentMonth, 1); // holds the date for the month creation loop

    var getStart = function() {
      if (monthStart.getDay() !== 0) {
        monthStart.setDate(monthStart.getDate() - 1 );
        getStart();
      } else {
        return;
      }
    };
    getStart();

    var makeContainer = function() {
      div = document.createElement('div');
      div.classList.add('calendar');
    }
    makeContainer();

    var makeNav = function() {
      var nav = document.createElement('nav');
      var ol = document.createElement('ol');
      var lastlink = document.createElement('li');
      var nextlink = document.createElement('li');
      var backMonth = document.createTextNode('<<');
      var fwdMonth = document.createTextNode('>>');
      nav.classList.add('nextlast');
      lastlink.id = 'lastlink';
      nextlink.id = 'nextlink';
      lastlink.appendChild(backMonth);
      nextlink.appendChild(fwdMonth);
      ol.appendChild(lastlink);
      ol.appendChild(nextlink);
      nav.appendChild(ol);
      div.appendChild(nav);
    }
    makeNav();

    var makeHeader = function() {
      h1 = document.createElement('h1');
      h1.classList.add('month');
      console.log('month: ' + monthNames[date.getMonth()] + ' year: ' + date.getFullYear());
      headerText = document.createTextNode(monthNames[date.getMonth()] + ' ' + date.getFullYear());
      h1.appendChild(headerText);
      div.appendChild(h1);
    }
    makeHeader();

    var makeThead = function() {
      for (i=0; i<7; i++) {
        var th = document.createElement('th');
        var day = document.createTextNode(dayNames[i]);
        th.appendChild(day);
        thead.appendChild(th);
      }
      table.appendChild(thead);
    };
    makeThead();

    var rowCount = function(year, month) {
      return Math.ceil((monthLength(year, month) + firstDay(year, month))/7);
    };

    var height = rowCount(date.getFullYear(), date.getMonth());
    var tr, td;
    var cellDateCounter = 0;

    for (var rows = 0; rows < height; rows++) {
      var row = document.createElement('tr');
      table.appendChild(row);
      for (var cellCount = 0; cellCount < 7; cellCount++) {
        var cell = document.createElement('td');
        var dateModifier = monthStart.getDate() + cellDateCounter;
        var workingDate = new Date(monthStart);
        workingDate.setDate(dateModifier);
        cell.id = 'y' + workingDate.getFullYear() + 'm' + (workingDate.getMonth() + 1) + 'd' + workingDate.getDate();
        if ((workingDate.getMonth() < date.getMonth()) || (workingDate.getFullYear() < date.getFullYear())) {
          cell.classList.add('lastmonth');
        } else if ((workingDate.getMonth() > date.getMonth()) || (workingDate.getFullYear() > date.getFullYear())) {
          cell.classList.add('nextmonth');
        }
        var cellDate = workingDate.getDate();
        var dateSpan = document.createElement('span');
        var dateText = document.createTextNode(cellDate);
        dateSpan.appendChild(dateText);
        cell.appendChild(dateSpan);
        row.appendChild(cell);
        dateSpan.classList.add('date');
        cellDateCounter++;
      }
    }
    div.appendChild(table);
    return div;

  }

  function MonthMaker(date) {
    var table = makeTable(date);
    document.body.appendChild(table);
  }

return MonthMaker;
}();
