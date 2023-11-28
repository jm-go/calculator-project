import "./main.scss";

// Add selectors
const calculatorButton = document.querySelectorAll<HTMLButtonElement>(
  ".calculator__button"
);
const outputAnswer = document.querySelector<HTMLOutputElement>(
  ".calculator__answer"
);

// Add error handling
if (!calculatorButton || !outputAnswer) {
  throw new Error("Issue with Selector.");
}

// Add switch function for numeric buttons
const getNumericValue = (buttonClass: string) => {
  buttonClass = buttonClass.replace(
    "calculator__button calculator__button-",
    ""
  );
  switch (buttonClass) {
    case "zero":
      return 0;
    case "one":
      return 1;
    case "two":
      return 2;
    case "three":
      return 3;
    case "four":
      return 4;
    case "five":
      return 5;
    case "six":
      return 6;
    case "seven":
      return 7;
    case "eight":
      return 8;
    case "nine":
      return 9;
    default:
      throw new Error("Invalid button class");
  }
};

const getOperatorValue = (buttonClass: string) => {
  buttonClass = buttonClass.replace(
    "calculator__button calculator__button-",
    ""
  );
  switch (buttonClass) {
    case "clear":
      clearOutput();
      break;
    case "plus":
      return "+";
    case "minus":
      return "-";
    case "multiply":
      return "x";
    case "divide":
      return "/";
    case "negate":
      return "+/-";
    case "percent":
      return "%";
    case "dec":
      return ".";
    case "equals":
      return "=";
    default:
      throw new Error("Invalid operation button class.");
  }
};

// Check if outputAnswer is empty or if its length is less than 18 characters
const checkOutputLength = (output: HTMLOutputElement) => {
  if (output.textContent && output.textContent.length < 18) {
    return true;
  } else if (!output.textContent) {
    return true;
  }
  return false;
};

const checkTextContent = (output: HTMLOutputElement): string =>  {
  if (output.hasOwnProperty("textContent")) {
    if (output.textContent !== null) {
      return output.textContent.toString();
    }
    return "";
  }
  return "";
}

const checkDecimal = (output: HTMLOutputElement) => {
  const text = checkTextContent(output);
  if (!text.includes(".")) {
    output.textContent += ".";
  } else if (!text) {
    output.textContent += "0.";
  }
}

// Add handler for numeric buttons and operators
const handleClickButton = (event: Event) => {
  const target = event.target as HTMLButtonElement;

  // Ensure the event target is a button element
  if (target instanceof HTMLButtonElement) {
    // Get the class and type of the button
    const buttonClass = target.className;
    const buttonType = target.dataset.type;

    // Only proceed if the output length check passes
    if (checkOutputLength(outputAnswer)) {
      if (buttonType === "number") {
        const numericValue = getNumericValue(buttonClass);
        outputAnswer.textContent += numericValue.toString();
      } else if (buttonType === "decimal") {
        checkDecimal(outputAnswer);
      } else if (buttonType === "operator") {
        console.log("to do")
      } else if (buttonType === "action") {
        // const specialAction = (buttonClass);
        console.log("to do");
      }
    }
  }
};

//outputAnswer.textContent = event.target as HTMLButtonElement;

// Add event listener for each numeric button
calculatorButton.forEach((button) => {
  button.addEventListener("click", handleClickButton);
});

const addNumbers = (number1: number, number2: number) => {
  if (
    number1 !== null &&
    number1 !== undefined &&
    number2 !== null &&
    number2 !== undefined
  ) {
    return number1 + number2;
  } else {
    alert("Please input valid values.");
    return null;
  }
};

const subtractNumbers = (number1: number, number2: number) => {
  if (
    number1 !== null &&
    number1 !== undefined &&
    number2 !== null &&
    number2 !== undefined
  ) {
    return number1 - number2;
  } else {
    alert("Please input valid values.");
    return null;
  }
};

const multiplyNumbers = (number1: number, number2: number) => {
  if (
    number1 !== null &&
    number1 !== undefined &&
    number2 !== null &&
    number2 !== undefined
  ) {
    return number1 * number2;
  } else {
    alert("Please input valid values.");
    return null;
  }
};

const divideNumbers = (number1: number, number2: number) => {
  if (
    number1 !== null &&
    number1 !== undefined &&
    number2 !== null &&
    number2 !== undefined
  ) {
    return number1 / number2;
  } else {
    alert("Please input valid values.");
    return null;
  }
};

const calculatePercent = (number: number) => {
  if (number !== null && number !== undefined) {
    return number / 100;
  } else {
    alert("Please input valid values.");
    return null;
  }
};

const clearOutput = () => {
  outputAnswer.textContent = "";
};
