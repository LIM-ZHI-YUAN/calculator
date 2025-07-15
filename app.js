let firstNumber;
let secondNumber;
let operator;
let resultShown = false;

const buttonsNumber = document.querySelectorAll(".button-number");
const buttonEval = document.querySelector(".button-eval");
const buttonClear = document.querySelector(".button-clear");
const display = document.querySelector(".display");
const buttonsOperator = document.querySelectorAll(".button-operate");
const buttonDot = document.querySelector(".button-number.dot");
const buttonBackspace = document.querySelector(".button-backspace");

buttonsNumber.forEach((ele) =>
  ele.addEventListener("click", addNumberToDisplay)
);
buttonsOperator.forEach((ele) => ele.addEventListener("click", setOperator));
buttonEval.addEventListener("click", evaluate);
buttonClear.addEventListener("click", clear);
buttonDot.addEventListener("click", toggleButtonDot);
buttonBackspace.addEventListener("click", removeLastNumber);

document.addEventListener("keydown", function (e) {
  handleInputKeys(e.key);
  playSound();
});

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", playSound);
});

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  let result = a * b;
  // handle long decimals answer
  if (
    result.toString().split(".")[1] &&
    result.toString().split(".")[1].length > 4
  ) {
    return result.toFixed(4);
  }
  return result;
}

function divide(a, b) {
  if (b == 0) {
    alert("divide by 0 is not valid");
    return;
  }
  let result = a / b;
  // handle long decimals answer
  if (
    result.toString().split(".")[1] &&
    result.toString().split(".")[1].length > 4
  ) {
    return result.toFixed(4);
  }
  return result;
}

function operate(num1, num2, op) {
  switch (op) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
    default:
      return null;
  }
}

function setOperator(e, key = null) {
  // If firstNumber is set and operator is set, but display is empty,
  // that means there is consetutive operator
  // we take only the last operator
  // for example: 2 +* , we take only the last operator *
  if (operator && !display.value) {
    operator = e ? e.target.getAttribute("data-action") : key;
    return;
  }

  // If a result is showing, use it as firstNumber for the next operation
  // and set the resultShown to false to avoid clear method in addNumberToDisplay
  if (resultShown) {
    firstNumber = display.value;
    resultShown = false;
  } else {
    firstNumber = display.value;
  }

  operator = e ? e.target.getAttribute("data-action") : key;
  display.value = "";
  toggleButtonDot();
}

function addNumberToDisplay(e, key = null) {
  // if resultshown is true, meaning user
  // trying to enter new number after result is shown
  // we clear the display and start a new calculation
  if (resultShown) {
    clear();
  }
  if (key) {
    display.value += key;
  } else {
    display.value += e.target.getAttribute("data-value");
  }
  toggleButtonDot();
}

function evaluate(e) {
  secondNumber = display.value;

  // if there is no value for firstnumber or secondnumber
  // meaning invalid operand
  // we clear the display and return
  if (!firstNumber || !secondNumber) {
    clear();
    return;
  }

  display.value =
    operate(Number(firstNumber), Number(secondNumber), operator) ?? "";
  operator = "";
  resultShown = true;
}

function clear(e) {
  display.value = "";
  firstNumber = "";
  secondNumber = "";
  operator = "";
  resultShown = false;
  toggleButtonDot();
}

function checkFloatingPoint(str) {
  return str.includes(".");
}

function toggleButtonDot() {
  if (checkFloatingPoint(display.value)) {
    buttonDot.disabled = true;
  } else {
    buttonDot.disabled = false;
  }
}

function removeLastNumber() {
  if (display.value) {
    display.value = display.value.slice(0, display.value.length - 1);
    toggleButtonDot();
  }
}

function handleInputKeys(value) {
  switch (value) {
    case "Enter":
    case "=":
      evaluate();
      break;
    case "Backspace":
      removeLastNumber();
      break;
    case "Escape":
      clear();
      break;
    case ".":
      // if the display already has a dot, do not add another one
      // if the display is empty, do not add a dot
      if (!checkFloatingPoint(display.value) && display.value !== "") {
        addNumberToDisplay(null, value);
      }
      break;
    default:
      if (!isNaN(value)) {
        // If the key is a number, add it to the display
        addNumberToDisplay(null, value);
      } else if (["+", "-", "*", "/"].includes(value)) {
        // If the key is an operator, set the operator
        setOperator(null, value);
      }
      break;
  }
}

function playSound() {
  const audio = document.querySelector("audio");
  if (audio) {
    audio.currentTime = 0; // Reset the audio to the start
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });
  }
}

