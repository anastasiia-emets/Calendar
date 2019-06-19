var cal = {
  mName: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"], // Month Names
  data: null,
  sDay: 0,
  sMth: 0,
  sYear: 0,
  sMon: false,

  list: function () {
    cal.sMth = parseInt(document.querySelector(".calendar__month").value);
    cal.sYear = parseInt(document.querySelector(".calendar__year").value);
    var daysInMth = new Date(cal.sYear, cal.sMth + 1, 0).getDate(), // к-ть днів у цьому місяці
      startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), // перший день цього місяця
      endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(); // останій день

    cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.data == null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.data = {};
    } else {
      cal.data = JSON.parse(cal.data);
    }

    // порожні квадрати
    var squares = [];
    if (cal.sMon && startDay != 1) {
      var empty = startDay == 0 ? 7 : startDay;
      for (var i = 1; i < empty; i++) { squares.push("empty"); }
    }
    if (!cal.sMon && startDay != 0) {
      for (i = 0; i < startDay; i++) { squares.push("empty"); }
    }


    for (i = 1; i <= daysInMth; i++) { squares.push(i); }


    if (cal.sMon && endDay != 0) {
      empty = endDay == 6 ? 1 : 7 - endDay;
      for (i = 0; i < empty; i++) { squares.push("empty"); }
    }
    if (!cal.sMon && endDay != 6) {
      empty = endDay == 0 ? 6 : 6 - endDay;
      for (i = 0; i < empty; i++) { squares.push("empty"); }
    }


    var container = document.querySelector(".calendar__container"),
      cTable = document.createElement("table");
    cTable.id = "calendar";

    container.innerHTML = "";
    container.appendChild(cTable);
    var cRow = document.createElement("tr"),
      cCell = null,
      days = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
    if (cal.sMon) { days.push(days.shift()); }
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("calendar__head");
    cTable.appendChild(cRow);

    var total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("calendar__day");
    for (i = 0; i < total; i++) {
      cCell = document.createElement("td");
      if (squares[i] == "empty") { cCell.classList.add("calendar__empty-cells"); }
      else {
        cCell.innerHTML = "<div class='calendar__day'>" + squares[i] + "</div>";
        if (cal.data[squares[i]]) {
          cCell.innerHTML += "<div class='calendar__event-day'>" + cal.data[squares[i]] + "</div>";
        }
        cCell.addEventListener("click", function () {
          cal.show(this);
        });
      }
      cRow.appendChild(cCell);
      if (i != 0 && (i + 1) % 7 == 0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("calendar__day");
      }
    }

    cal.close();
  },



  show: function (el) {
    cal.sDay = el.getElementsByClassName("calendar__day")[0].innerHTML;
    var tForm = "<h1 class='calendar__event-header'>" + (cal.data[cal.sDay] ? "РЕДАКТИРОВАТЬ" : "ДОБАВИТЬ") + " СОБЫТИЕ </h1>";
    tForm += "<div class='calendar__event-date'>" + cal.sDay + " " + cal.mName[cal.sMth] + " " + cal.sYear + "</div>";
    tForm += "<textarea class='calendar__event-details' placeholder = 'Введите название события' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "") + "</textarea>";
    tForm += "<div class='calendar__event-button'>";
    tForm += "<input class='calendar__cancel-button' type='button' value='Отмена' onclick='cal.del()'/>";
    tForm += "<input class='calendar__save-button'type='submit' value='Сохранить'/>";
    tForm += "</div>"

    var eForm = document.createElement("form");
    eForm.classList.add("calendar__form");
    eForm.addEventListener("submit", cal.save);

    calendar.style.display = "none";
    eForm.innerHTML = tForm;
    var container = document.querySelector(".calendar__event");
    container.innerHTML = "";
    container.appendChild(eForm);

  },

  close: function () {
    document.querySelector(".calendar__event").innerHTML = "";
  },

  save: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    cal.data[cal.sDay] = document.querySelector(".calendar__event-details").value;
    localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
    cal.list();
  },

  del: function () {
    if (confirm("Видалити подію?")) {
      delete cal.data[cal.sDay];
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
      cal.list();
    }
  },
  next: function () {
    cal.sMth = (parseInt(document.querySelector(".calendar__month").value) + 1);
    cal.sYear = parseInt(document.querySelector(".calendar__year").value);
    var daysInMth = new Date(cal.sYear, cal.sMth, 0).getDate(),
      startDay = new Date(cal.sYear, cal.sMth, 1).getDay(),
      endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay();

    cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.data == null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.data = {};
    } else {
      cal.data = JSON.parse(cal.data);
    }

    var squares = [];
    if (cal.sMon && startDay != 1) {
      var empty = startDay == 0 ? 7 : startDay;
      for (var i = 1; i < empty; i++) { squares.push("empty"); }
    }
    if (!cal.sMon && startDay != 0) {
      for (i = 0; i < startDay; i++) { squares.push("empty"); }
    }


    for (i = 1; i <= daysInMth; i++) { squares.push(i); }


    if (cal.sMon && endDay != 0) {
      empty = endDay == 6 ? 1 : 7 - endDay;
      for (i = 0; i < empty; i++) { squares.push("empty"); }
    }
    if (!cal.sMon && endDay != 6) {
      empty = endDay == 0 ? 6 : 6 - endDay;
      for (i = 0; i < empty; i++) { squares.push("empty"); }
    }

    var container = document.querySelector(".calendar__container"),
      cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);

    var cRow = document.createElement("tr"),
      cCell = null,
      days = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
    if (cal.sMon) { days.push(days.shift()); }
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("calendar__head");
    cTable.appendChild(cRow);

    var total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("calendar__day");
    for (i = 0; i < total; i++) {
      cCell = document.createElement("td");
      if (squares[i] == "empty") { cCell.classList.add("calendar__empty-cells"); }
      else {
        cCell.innerHTML = "<div class='calendar__day'>" + squares[i] + "</div>";
        if (cal.data[squares[i]]) {
          cCell.innerHTML += "<div class='calendar__event-day'>" + cal.data[squares[i]] + "</div>";
        }
        cCell.addEventListener("click", function () {

          cal.show(this);
        });
      }
      cRow.appendChild(cCell);
      if (i != 0 && (i + 1) % 7 == 0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("calendar__day");
      }
    }

    cal.close();

  },
  prev: function () {
    cal.sMth = (parseInt(document.querySelector(".calendar__month").value) - 1);
    cal.sYear = parseInt(document.querySelector(".calendar__year").value);
    var daysInMth = new Date(cal.sYear, cal.sMth, 0).getDate(),
      startDay = new Date(cal.sYear, cal.sMth, 1).getDay(),
      endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay();

    cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.data == null) {
      localStorage.setItem("cal-" + cal.sMth + 1 + "-" + cal.sYear, "{}");
      cal.data = {};
    } else {
      cal.data = JSON.parse(cal.data);
    }

    var squares = [];
    if (cal.sMon && startDay != 1) {
      var empty = startDay == 0 ? 7 : startDay;
      for (i = 1; i < empty; i++) { squares.push("empty"); }
    }
    if (!cal.sMon && startDay != 0) {
      for (i = 0; i < startDay; i++) { squares.push("empty"); }
    }


    for (i = 1; i <= daysInMth; i++) { squares.push(i); }

    if (cal.sMon && endDay != 0) {
      empty = endDay == 6 ? 1 : 7 - endDay;
      for (i = 0; i < empty; i++) { squares.push("empty"); }
    }
    if (!cal.sMon && endDay != 6) {
      empty = endDay == 0 ? 6 : 6 - endDay;
      for (i = 0; i < empty; i++) { squares.push("empty"); }
    }

    var container = document.querySelector(".calendar__container"),
      cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);

    var cRow = document.createElement("tr"),
      cCell = null,
      days = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("calendar__head");
    cTable.appendChild(cRow);

    var total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("calendar__day");
    for (var i = 0; i < total; i++) {
      cCell = document.createElement("td");
      if (squares[i] == "empty") { cCell.classList.add("calendar__empty-cells"); }
      else {
        cCell.innerHTML = "<div class='calendar__day'>" + squares[i] + "</div>";
        if (cal.data[squares[i]]) {
          cCell.innerHTML += "<div class='calendar__event-day'>" + cal.data[squares[i]] + "</div>";
        }
        cCell.addEventListener("click", function () {

          cal.show(this);
        });
      }
      cRow.appendChild(cCell);
      if (i != 0 && (i + 1) % 7 == 0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("calendar__day");
      }
    }

    cal.close();

  }
};


window.addEventListener("load", function () {

  var now = new Date(),
    nowMth = now.getMonth(),
    nowYear = parseInt(now.getFullYear());


  // вибрати місяці
  var month = document.querySelector(".calendar__month");
  for (var i = 0; i < 12; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = cal.mName[i];
    if (i == nowMth) { opt.selected = true; }
    month.appendChild(opt);
  }

  // діапазон 10 років
  var year = document.querySelector(".calendar__year");
  for (i = nowYear - 10; i <= nowYear + 10; i++) {
    opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    if (i == nowYear) { opt.selected = true; }
    year.appendChild(opt);
  }

  document.querySelector(".calendar__enter").addEventListener("click", cal.list);
  document.querySelector(".calendar__next-button").addEventListener("click", cal.next);
  document.querySelector(".calendar__prev-button").addEventListener("click", cal.prev);
  document.querySelector(".calendar__today-button").addEventListener("click", cal.list);
  cal.list();
});