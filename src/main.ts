import "./main.scss";

// Add selectors
const calculatorButton = document.querySelectorAll<HTMLButtonElement>(
  ".calculator__button"
);
const outputAnswer = document.querySelector<HTMLOutputElement>(
  ".calculator__answer"
);
const outputHistory = document.querySelector<HTMLOutputElement>(
  ".calculator__history"
);

// Add error handling
if (!calculatorButton || !outputAnswer || !outputHistory) {
  throw new Error("Issue with Selector.");
}

// Add global variables
let value: null | number = null;
let tempEqualsValue: null | number = null;
let operator: null | string = null;
let actionTracker: null | undefined | string = null;

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

// Add switch function for operation buttons
const getOperator = (buttonClass: string) => {
  buttonClass = buttonClass.replace(
    "calculator__button calculator__button-",
    ""
  );
  switch (buttonClass) {
    case "plus":
      return "+";
    case "minus":
      return "-";
    case "multiply":
      return "x";
    case "divide":
      return "/";
    default:
      throw new Error("Invalid button class");
  }
};

// Change string output to number value
const parseToNumber = (output: HTMLOutputElement): number => {
  let stringAsNumber = checkTextContent(output);
  return Number(stringAsNumber);
};

// Add switch statement for special action buttons
const performAction = (buttonClass: string) => {
  buttonClass = buttonClass.replace(
    "calculator__button calculator__button-",
    ""
  );
  switch (buttonClass) {
    case "clear":
      outputAnswer.textContent = "";
      outputHistory.textContent = "";
      value = null;
      operator = null;
      actionTracker = null;
      break;
    case "negate":
      const negatedOutput = parseToNumber(outputAnswer) * -1;
      outputAnswer.textContent = negatedOutput.toString();
      // value = negatedOutput;
      break;
    case "percent":
      let result = calculatePercent(parseToNumber(outputAnswer));
      if (result) {
        outputAnswer.textContent = result.toString();
        // value = result;
      }
      break;
    case "equals calculator__button--equal":
      if (typeof operator === "string" && value !== null) {
        let currentTextContent = parseToNumber(outputAnswer);

        if (actionTracker === "equals" && tempEqualsValue){
          value = currentTextContent
          currentTextContent = tempEqualsValue;
          
        }
        
        let result = calculate(value, currentTextContent, operator);
        if (result !== null) {
          outputAnswer.textContent = result.toString();
          outputHistory.textContent = `${value}${operator}${currentTextContent}`;
          value = result;
          actionTracker = "equals";
          tempEqualsValue = currentTextContent;
        } 
      }
      break;
    default:
      throw new Error("Invalid button class.");
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

// Return output.textContent as a String or empty String
const checkTextContent = (output: HTMLOutputElement): string => {
  return output.textContent || "";
};

// Check if decimal point already exists
const checkDecimal = (output: HTMLOutputElement) => {
  if (actionTracker === "operator"){
    output.textContent = "";
  }
  const text = checkTextContent(output);
  if (text.length === 0) {
    output.textContent += "0.";
  } else if (!text.includes(".")) {
    output.textContent += ".";
  }
  actionTracker = "decimal";
};

// Add handler for numeric buttons and operators
const handleClickButton = (event: Event) => {
  const target = event.currentTarget as HTMLButtonElement;

  // Ensure the event target is a button element
  if (target instanceof HTMLButtonElement) {
    // Get the class and type of the button
    const buttonClass = target.className;
    const buttonType = target.dataset.type;

    
    if (buttonType === "number") {
      if (actionTracker === "operator") {
        outputAnswer.textContent = "";
      } else if ( actionTracker === "equals"){
        value = null; 
        operator = null;
        outputAnswer.textContent = "";
        
      }
      // Only proceed if the output length check passes
      if (checkOutputLength(outputAnswer)) {
        const numericValue = getNumericValue(buttonClass);
        outputAnswer.textContent += numericValue.toString();
      }
      actionTracker = "number";
    } else if (buttonType === "decimal") {
      if (checkOutputLength(outputAnswer)) {
        checkDecimal(outputAnswer);
      }
    } else if (buttonType === "operator") {
      if (actionTracker === "operator" || actionTracker === "equals") {
        operator = null;
      }
      if (operator) {
        let currentTextContent = parseToNumber(outputAnswer);
        let result = calculate(value, currentTextContent, operator);
        outputHistory.textContent = `${value}${operator}${currentTextContent}`; //to do - set limit of characters
        value = result;
        if (value !== null) {
          outputAnswer.textContent = value.toString();
        }
      } else {
        value = parseToNumber(outputAnswer);
      }
      operator = getOperator(buttonClass);
      actionTracker = "operator";
    } else if (buttonType === "action") {
      performAction(buttonClass);
    }
  }
};

//Add event listener for each numeric button
calculatorButton.forEach((button) => {
  button.addEventListener("click", handleClickButton);
});

const addNumbers = (number1: number | null, number2: number | null) => {
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

const subtractNumbers = (number1: number | null, number2: number | null) => {
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

const multiplyNumbers = (number1: number | null, number2: number | null) => {
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

const divideNumbers = (number1: number | null, number2: number | null) => {
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

const calculatePercent = (number: number | null) => {
  if (number !== null && number !== undefined) {
    return number / 100;
  } else {
    alert("Invalid input.");
    return number;
  }
};

const calculate = (
  number1: number | null,
  number2: number | null,
  operator: string
) => {
  let result: number | null = 0;
  if (operator === "+") {
    result = addNumbers(number1, number2);
    return result;
  } else if (operator === "-") {
    result = subtractNumbers(number1, number2);
    return result;
  } else if (operator === "/") {
    result = divideNumbers(number1, number2);
    return result;
  } else if (operator === "x") {
    result = multiplyNumbers(number1, number2);
    return result;
  } else {
    return null;
  }
};
