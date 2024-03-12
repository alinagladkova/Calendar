"use strict";

const weeks = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВСК"];

const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

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

class Header extends BasicComponent {
  constructor() {
    super();
    this._init();
  }
  _init() {
    super._init();
  }

  _getTemplate() {
    return `<form action="#" method="post" class="form">
							<div class="form__field-wrapper">
								<label for="year" class="form__label">Календарь мероприятий</label>
								<select name="year" id="year" class="form__select">
									<option value="2024" class="form__option" selected>2024</option>
									<option value="2025" class="form__option">2025</option>
									<option value="2026" class="form__option">2026</option>
								</select>
							</div>
      			</form>`;
  }
}

class CalendarWrapper extends BasicComponent {
  constructor(Calendar) {
    super();
    this._Calendar = Calendar;
    this._init();
  }
  _init() {
    super._init();
    this._render();
  }

  _render() {
    this._element.innerHTML = "";
    this._element.insertAdjacentElement("afterbegin", this._addCalendar());
  }

  _addCalendar() {
    return new this._Calendar().element;
  }

  _getTemplate() {
    return `<div class="calendar-wrapper"></div>`;
  }
}

class Calendar extends BasicComponent {
  constructor() {
    super();

    this._init();
  }
  _init() {
    super._init();
  }

  _getTemplate() {
    return `<div class="calendar">
							<div class="calendar__header">
								<div class="calendar__current">
									<div class="calendar__arrows">
										<div class="calendar__left-arrow">
											<i class="fa-light fa-chevron-left"></i>
											<p>август</p>
										</div>
										<p class="calendar__month">сентябрь</p>
										<div class="calendar__right-arrow">
										<p>октябрь</p>
											<i class="fa-light fa-chevron-right"></i>
										</div>
									</div>
								</div>
								<button class="btn calendar__btn btn--hide">
									<p>Свернуть</p>
									<i class="fa-light fa-chevron-down"></i>
								</button>
							</div>
							<div class="calendar__main"></div>
						</div>`;
  }
}

const root = document.querySelector(".root");
const header = new Header();
const calendarWrapper = new CalendarWrapper(Calendar);

//================Custom Events
// root.addEventListener("openProperties", (e) => {
//   popupProductWithProperty.open(e.detail.properties);
// });

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

root.insertAdjacentElement("afterbegin", header.element);
root.insertAdjacentElement("beforeend", calendarWrapper.element);
// root.insertAdjacentElement("beforeend", calendar.element);
