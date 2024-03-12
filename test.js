this._subElements.field.addEventListener("input", (e) => {
  e.target.dispatchEvent(
    new CustomEvent("getInput", {
      bubbles: true,
      detail: {
        inputValue: e.target.value.trim(),
      },
    })
  );
});

root.addEventListener("getInput", (e) => {
  productList.update(e.detail.inputValue);
  console.log(e.target.value);
});

const test = debounce(() => productList.update(e.detail.inputValue), 3000);

function debounce(handler, ms) {
  console.log(handler, ms);
  let timeoutID;
  return (...args) => {
    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
      timeoutID = null;
      return handler.apply(this, args);
    }, ms);
  };
}
