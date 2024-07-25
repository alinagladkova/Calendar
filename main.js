"use strict";

import { Swiper } from "/node_modules/swiper/swiper-bundle.mjs";

const week = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]; // этот массив точно оставляем
const months = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
//"январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"

function createElement(html) {
  const root = document.createElement("div");
  root.insertAdjacentHTML("beforeend", html);
  return root.firstElementChild;
}

class BasicComponent {
  _element = null;
  _subElements = {};

  constructor() {}

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
  }

  _getSubElements() {
    return Array.from(this._element.querySelectorAll("[data-element]")).reduce((acc, el) => {
      return {
        ...acc,
        [el.getAttribute("data-element")]: el,
      };
    }, {});
  }

  get element() {
    return this._element;
  }
}

//работаем тут
// привязать год к месяцам в календаре
//selected сделать
class Header extends BasicComponent {
  _eventYears = [];

  _state = {
    activeYear: null,
  };

  constructor({ currentYear }, Option) {
    super();
    this._currentYear = currentYear;
    this._Option = Option;
    this._init();
  }
  _init() {
    super._init();
    this._fillEventYears();
    this._render();
  }

  _fillEventYears() {
    this._eventYears.push(this._currentYear - 2, this._currentYear - 1, this._currentYear, this._currentYear + 1, this._currentYear + 2);
  }

  _setStateActiveYear() {
    this._state.activeYear = this._currentYear;
    return this._state.activeYear;
  }

  _generateOptions() {
    return this._eventYears.map((year) => {
      return new this._Option(year, this._setStateActiveYear()).element;
    });
  }

  _render() {
    this._subElements.select.append(...this._generateOptions());
  }

  _getTemplate() {
    return `<form action="#" method="post" class="header-form">
							<div class="header-form__field-wrapper">
								<label for="year" class="header-form__label">Календарь мероприятий</label>
								<select name="year" id="year" data-element="select" class="header-form__select"></select>
							</div>
      			</form>`;
  }
}

class Option extends BasicComponent {
  constructor(value, activeValue) {
    super();
    this._value = value;
    this._activeValue = activeValue;

    this._init();
  }

  _init() {
    super._init();
    this._render();
  }

  _render() {
    +this._element.value === this._activeValue ? (this._element.selected = true) : (this._element.selected = false);
  }

  _getTemplate() {
    return `<option value="${this._value}" class="header-form__option">${this._value}</option>`;
  }
}

class CalendarWrapper extends BasicComponent {
  constructor(dateData, months, week, Calendar, CalendarHeader, monthSlider, Slide, CalendarMain, WeekDays, days, Day) {
    super();
    this._dateData = dateData;
    this._months = months;
    this._week = week;
    this._Calendar = Calendar;
    this._CalendarHeader = CalendarHeader;
    this._monthSlider = monthSlider;
    this._Slide = Slide;
    this._CalendarMain = CalendarMain;
    this._WeekDays = WeekDays;
    this._days = days;
    this._Day = Day;
    this._init();
  }
  _init() {
    super._init();
    this._render();
  }

  _render() {
    this._element.insertAdjacentElement(
      "afterbegin",
      new this._Calendar(
        this._dateData,
        this._months,
        this._week,
        this._CalendarHeader,
        this._monthSlider,
        this._Slide,
        this._CalendarMain,
        this._WeekDays,
        this._days,
        this._Day
      ).element
    );
  }
  _getTemplate() {
    return `<div class="calendar-wrapper"></div>`;
  }
}

class Calendar extends BasicComponent {
  constructor(dateData, months, week, CalendarHeader, monthSlider, Slide, CalendarMain, WeekDays, days, Day) {
    super();
    this._dateData = dateData;
    this._months = months;
    this._week = week;
    this._CalendarHeader = CalendarHeader;
    this._monthSlider = monthSlider;
    this._Slide = Slide;
    this._CalendarMain = CalendarMain;
    this._WeekDays = WeekDays;
    this._days = days;
    this._Day = Day;
    this._init();
  }
  _init() {
    super._init();
    this._render();
  }

  _render() {
    this._element.insertAdjacentElement(
      "beforeend",
      new this._CalendarHeader(this._dateData, this._months, this._monthSlider, this._Slide, this._days).element
    );
    this._element.insertAdjacentElement(
      "beforeend",
      new this._CalendarMain(this._dateData, this._months, this._week, this._WeekDays, this._days, this._Day).element
    );
  }

  _getTemplate() {
    return `<div class="calendar"></div>`;
  }
}

/*
Задачи:
- когда листаем влево сбивается показ слайдов(первый не показывается)
- переключение года в хэдере
- кнопка Свернуть в хэдере календаря
*/

class CalendarHeader extends BasicComponent {
  _state = {
    activeMonth: 0,
  };

  constructor(dateData, months, monthSlider, Slide, days) {
    super();
    this._dateData = dateData;
    this._months = months;
    this._monthSlider = monthSlider;
    this._Slide = Slide;
    this._days = days;
    this._init();
  }
  _init() {
    super._init();
    this._monthSlider;
    this._addListeners();
    this._setStateActiveMonth();
    this._render();
  }

  _addListeners() {
    this._subElements.rightBtn.addEventListener("click", (e) => {
      e.target.dispatchEvent(
        new CustomEvent("switchToNextMonth", {
          bubbles: true,
          detail: {
            monthNumber: ++this._dateData.currentMonth + 1,
          },
        })
      );
      // this._days.render();
    });
    this._subElements.leftBtn.addEventListener("click", (e) => {
      e.target.dispatchEvent(
        new CustomEvent("switchToPrevMonth", {
          bubbles: true,
          detail: {
            monthNumber: --this._dateData.currentMonth + 1,
          },
        })
      );
      // this._days.render();
    });
  }

  _setStateActiveMonth() {} //

  _getActiveMonth(html) {
    //
    return console.log(html); //
  }

  _generateSlides() {
    return this._months.map((monthName) => {
      return new this._Slide(monthName, this._getActiveMonth.bind(this)).element;
    });
  }

  _render() {
    this._subElements.wrapper.innerHTML = "";
    this._subElements.wrapper.append(...this._generateSlides());
  }

  _getTemplate() {
    return `<div class="calendar-header">
							<div class="swiper">
								<div class="swiper-wrapper" data-element = "wrapper"></div>
								<div class="btn swiper-button-prev"><i class="fa-solid fa-chevron-left" data-element = "leftBtn"></i></div>
								<div class="btn swiper-button-next"><i class="fa-solid fa-chevron-right" data-element = "rightBtn"></i></div>
							</div>
							<button class="btn calendar-header__btn btn--hide">
								<p class="calendar-header__text">Свернуть</p>
								<i class="fa-solid fa-chevron-down"></i>
							</button>
						</div>`;
  }
}

class Slide extends BasicComponent {
  constructor(monthName, callback) {
    super();
    this._monthName = monthName;
    this._callback = callback;
    this._init();
  }

  _init() {
    super._init();
    //как выбрать активный слайд
  }

  _getActiveSlide() {
    if (this._element.className === `swiper-slide-active`) {
      console.log(this._callback(this._element));
      this._callback(this._element);
    }
  }

  _getTemplate() {
    return `<div class="swiper-slide" data-element = "slide">${this._monthName}</div>`;
  }
}

class CalendarMain extends BasicComponent {
  constructor(dateData, months, week, WeekDays, days, Day) {
    super();
    this._dateData = dateData;
    this._months = months;
    this._week = week;
    this._WeekDays = WeekDays;
    this._days = days;
    this._Day = Day;
    this._init();
  }

  _init() {
    super._init();
    this._render();
  }
  _render() {
    this._element.insertAdjacentElement("beforeend", new this._WeekDays(this._week).element);
    this._element.insertAdjacentElement("beforeend", this._days.element);
  }

  _getTemplate() {
    return `<div class="calendar__main"></div>`;
  }
}

class WeekDays extends BasicComponent {
  constructor(week) {
    super();
    this._week = week;
    this._init();
  }

  _init() {
    super._init();
    this._render();
  }

  _generateItems() {
    return this._week.map((weekDay) => {
      return `<li>${weekDay}</li>`;
    });
  }

  _render() {
    this._element.innerHTML = this._generateItems().join("");
  }

  _getTemplate() {
    return `<ul class="calendar__weekdays"></ul>`;
  }
}

class Days extends BasicComponent {
  _currMonthDays = [];
  _prevMonthDays = [];
  _nextMonthDays = [];

  constructor(dateData, months, Day) {
    super();
    this._dateData = dateData;
    this._months = months;
    this._Day = Day;
    this._init();
  }

  _init() {
    super._init();
    this._getPrevMonthLastDays();
    this._getCurrentMonthDays();
    this._getNextMonthFirstDays();
    this.render();
  }

  _getFirstDayOfMonth() {
    return new Date(this._dateData.currentYear, this._dateData.currentMonth, 1).getDay(); //firstDay
  }

  _getLastDateOfMonth() {
    return new Date(this._dateData.currentYear, this._dateData.currentMonth + 1, 0).getDate(); //lastDate
  }

  _getLastDayOfMonth() {
    return new Date(this._dateData.currentYear, this._dateData.currentMonth, this._getLastDateOfMonth()).getDay(); //lastDay
  }

  _getLastDateOfPrevMonth() {
    return new Date(this._dateData.currentYear, this._dateData.currentMonth, 0).getDate(); //lastDateofPrevMonth
  }

  _getPrevMonthLastDays() {
    for (let i = this._getFirstDayOfMonth(); i > 1; i--) {
      this._prevMonthDays.push(this._getLastDateOfPrevMonth() - i + 1);
    }
  }

  _getNextMonthFirstDays() {
    for (let i = this._getLastDayOfMonth(); i < 7; i++) {
      if (this._getLastDayOfMonth() === 6) {
        this._nextMonthDays = [];
      } else {
        this._nextMonthDays.push(i - this._getLastDayOfMonth() + 1);
      }
    }
  }

  _getCurrentMonthDays() {
    for (let i = 1; i <= this._getLastDateOfMonth(); i++) {
      this._currMonthDays.push(i);
    }
  }

  getNextMonthDays(nextMonth) {
    let firstDayOfNextMonth = new Date(this._dateData.currentYear, nextMonth - 1, 1).getDay() - 1;
    let lastDateNextMonth = new Date(this._dateData.currentYear, nextMonth, 0).getDate();
    let lastDayOfNextMonth = new Date(this._dateData.currentYear, nextMonth - 1, lastDateNextMonth).getDay() - 1;
    let lastDatesOfMonthBeforeNextMonth = new Date(this._dateData.currentYear, nextMonth - 1, 0).getDate();

    firstDayOfNextMonth === -1 ? (firstDayOfNextMonth = 6) : firstDayOfNextMonth; //условие учета того, что неделя начинаетс с пн, а не вск

    for (let i = 1; i <= lastDateNextMonth; i++) {
      this._currMonthDays.push(i);
    }
    for (let i = firstDayOfNextMonth; i > 0; i--) {
      this._prevMonthDays.push(lastDatesOfMonthBeforeNextMonth - i + 1);
    }
    for (let i = lastDayOfNextMonth; i < 6; i++) {
      if (lastDayOfNextMonth === 6) {
        this._nextMonthDays = [];
      } else {
        this._nextMonthDays.push(i - lastDayOfNextMonth + 1);
      }
    }
  }

  getPrevMonthDays(prevMonth) {
    let firstDayOfPrevMonth = new Date(this._dateData.currentYear, prevMonth - 1, 1).getDay() - 1;
    let lastDatePrevMonth = new Date(this._dateData.currentYear, prevMonth, 0).getDate();
    let lastDayOfPrevMonth = new Date(this._dateData.currentYear, prevMonth - 1, lastDatePrevMonth).getDay();
    let lastDatesOfMonthBeforePrevMonth = new Date(this._dateData.currentYear, prevMonth - 1, 0).getDate();

    firstDayOfPrevMonth === -1 ? (firstDayOfPrevMonth = 6) : firstDayOfPrevMonth;

    for (let i = 1; i <= lastDatePrevMonth; i++) {
      this._currMonthDays.push(i);
    }

    for (let i = firstDayOfPrevMonth; i > 0; i--) {
      this._prevMonthDays.push(lastDatesOfMonthBeforePrevMonth - i + 1);
    }

    for (let i = lastDayOfPrevMonth; i < 7; i++) {
      if (lastDayOfPrevMonth === 0) {
        this._nextMonthDays = [];
      } else {
        this._nextMonthDays.push(i - lastDayOfPrevMonth + 1);
      }
    }
  }

  _generateCurrentDays(notCurrMonth) {
    return this._currMonthDays.map((day) => {
      this._currMonthDays = [];

      let currentDate =
        (day === this._dateData.today && notCurrMonth === undefined) ||
        (notCurrMonth === this._dateData.currentMonth + 1 && this._dateData.currentYear === new Date().getFullYear());

      if (currentDate) {
        return new this._Day(day, { curr: this._dateData.today, off: false }).element;
      }
      return new this._Day(day, { curr: undefined, off: false }).element;
    });
  }

  _generatePrevMonthLastDays() {
    return this._prevMonthDays.map((day) => {
      this._prevMonthDays = [];
      return new this._Day(day, { curr: false, off: true }).element;
    });
  }

  _generateNextMonthFirstDays() {
    return this._nextMonthDays.map((day) => {
      this._nextMonthDays = [];
      return new this._Day(day, { curr: false, off: true }).element;
    });
  }

  render(notCurrMonth) {
    this._element.innerHTML = "";
    this._element.append(...this._generatePrevMonthLastDays());
    this._element.append(...this._generateCurrentDays(notCurrMonth));
    this._element.append(...this._generateNextMonthFirstDays());
  }

  _getTemplate() {
    return ` <ul class="calendar__days"></ul>`;
  }
}

class Day extends BasicComponent {
  _state = {
    curr: false,
  };

  constructor(day, { curr, off }) {
    super();
    this._day = day;
    this._curr = curr;
    this._off = off;
    this._init();
  }

  _init() {
    super._init();
    this._render();
  }

  _render() {
    this._off ? this._element.classList.add("day--off") : "";
    this._day === this._curr ? this._element.classList.add("day--today") : "";
  }
  _getTemplate() {
    return `<li class="day">${this._day}</li>`;
  }
}

const root = document.querySelector(".root");
const header = new Header({ currentYear: new Date().getFullYear() }, Option);
const days = new Days(
  { date: new Date(), today: new Date().getDate(), currentMonth: new Date().getMonth(), currentYear: new Date().getFullYear() },
  months,
  Day
);
//================Custom Events
root.addEventListener("switchToNextMonth", (e) => {
  days.getNextMonthDays(e.detail.monthNumber);
  days.render(e.detail.monthNumber);
});

root.addEventListener("switchToPrevMonth", (e) => {
  days.getPrevMonthDays(e.detail.monthNumber);
  days.render(e.detail.monthNumber);
});

//================Debounce
// function debounce(handler, ms) {
//   console.log(handler, ms);
//   let timeoutID;
//   return (...args) => {
//     clearTimeout(timeoutID);

//     timeoutID = setTimeout(() => {
//       timeoutID = null;
//       return handler.apply(this, args);
//     }, ms);
//   };
// }

//=================

const calendarWrapper = new CalendarWrapper(
  { date: new Date(), today: new Date().getDate(), currentMonth: new Date().getMonth(), currentYear: new Date().getFullYear() },
  months,
  week,
  Calendar,
  CalendarHeader,
  Swiper,
  Slide,
  CalendarMain,
  WeekDays,
  days,
  Day
);
root.insertAdjacentElement("afterbegin", header.element);
root.insertAdjacentElement("beforeend", calendarWrapper.element);

new Swiper(".swiper", {
  speed: 400,
  loop: true,
  slidesPerView: 3,
  initialSlide: new Date().getMonth(),
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  keyboard: {
    enabled: true,
  },
  mousewheel: true,
});
