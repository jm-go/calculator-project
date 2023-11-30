import "./main.scss";

// Add selector for buttons
const calculatorButton = document.querySelectorAll<HTMLButtonElement>(
  ".calculator__button"
);

// Add selector for calculator's output
const outputAnswer = document.querySelector<HTMLOutputElement>(
  ".calculator__answer"
);

// Add selector for calculator's history
const outputHistory = document.querySelector<HTMLOutputElement>(
  ".calculator__history"
);

// Add error handling
if (!calculatorButton || !outputAnswer || !outputHistory) {
  throw new Error("Issue with Selector.");
}

// Add global variables
let value: null | number = null; // keeps first input value
let tempEqualsValue: null | number = null; // keeps temporary value for equals logic
let operator: null | string = null; // keep last used operator
let actionTracker: null | undefined | string = null; // keep track of decimal, operator and equals

/**
 * This function returns numeric value depending on button class, i.e.
 * calculator__button-zero -> 0
 * @param buttonClass
 * @returns number
 */
const getNumericValue = (buttonClass: string): number => {
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
      throw new Error("Invalid button class.");
  }
};

/**
 * This function returns operator as string depending on button class, i.e.
 * calculator__button-plus -> "+"
 * @param buttonClass
 * @returns string
 */
const getOperator = (buttonClass: string): string => {
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
      throw new Error("Invalid button class.");
  }
};

/**
 * This function returns the current text in calculator's answer display as number
 * @param output
 * @returns number
 */
const parseToNumber = (output: HTMLOutputElement): number => {
  let stringAsNumber = checkTextContent(output);
  return Number(stringAsNumber);
};

/**
 * This function performs special actions depending on button class, i.e.
 * calculator__button-clear -> clears global variables, output and history
 * calculator__button-negate -> changes the sign of current output to either positive or negative
 * calculator__button-percent -> calls {@link calculatePercent} to calculate percent for current output by dividing by 100
 * calculator__button-equals -> calls {@link calculate} function to perform calculation based on stored values and chosen operator
 * @param buttonClass
 */
const clickAction = (buttonClass: string) => {
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
      tempEqualsValue = null;
      break;
    case "negate":
      const negatedOutput = parseToNumber(outputAnswer) * -1;
      outputAnswer.textContent = negatedOutput.toString();
      break;
    case "percent":
      let result = calculatePercent(parseToNumber(outputAnswer));
      if (result) {
        outputAnswer.textContent = result.toString();
      }
      break;
    case "equals calculator__button--equal":
      if (typeof operator === "string" && value !== null) {
        let currentTextContent = parseToNumber(outputAnswer); // current calculator's output
        if (actionTracker === "equals" && tempEqualsValue !== null) {
          value = currentTextContent; // this case is only needed if user clicks negate or percent since value needs to be updated with new state
          currentTextContent = tempEqualsValue;
          /* 
          currentTextContent is used in calculate function. If user clicks equals again, it must be updated with second value before
          calculation which is stored in tempEqualsValue;
          */
        }

        let result = calculate(value, currentTextContent, operator);
        if (result !== null) {
          outputAnswer.textContent = result.toString();
          outputHistory.textContent = `${value}${operator}${currentTextContent}`;
          value = result; // update first value with calculation's result
          actionTracker = "equals"; // update actionTracker as equals was the last operator used
          tempEqualsValue = currentTextContent; // store second value before calculation
        }
      }
      break;
    default:
      throw new Error("Invalid button class.");
  }
};

/**
 * This function checks if outputAnswer is empty or if its length is less than 18 characters
 * @param output
 * @returns boolean
 */
const checkOutputLength = (output: HTMLOutputElement): boolean => {
  if (output.textContent && output.textContent.length < 18) {
    return true;
  } else if (!output.textContent) {
    return true;
  }
  return false;
};

/**
 * This function checks if textContent exists or not. If not, it returns empty string.
 * @param output
 * @returns string
 */
const checkTextContent = (output: HTMLOutputElement): string => {
  return output.textContent || "";
};

/**
 * This function checks if decimal point in current output already exists.
 * If exists, then ignore.
 * Otherwise, add either . or 0. to current output.
 * @param output
 */
const clickDecimal = (output: HTMLOutputElement) => {
  if (checkOutputLength(outputAnswer)) {
    if (actionTracker === "operator") {
      output.textContent = "";
    }
    const text = checkTextContent(output);
    if (text.length === 0) {
      output.textContent += "0.";
    } else if (!text.includes(".")) {
      output.textContent += ".";
    }
    actionTracker = "decimal";
  }
};

/**
 * This function updates current output with numbers limited by 18 characters.
 * Depending on user's previous action, it adjusts output answer accordingly (clears or adds number) or
 * clears the state of global variables.
 * @param buttonClass
 */
const clickNumber = (buttonClass: string) => {
  if (actionTracker === "operator") {
    outputAnswer.textContent = ""; // clears first value to make space for new value
  } else if (actionTracker === "equals") {
    value = null;
    operator = null;
    outputAnswer.textContent = "";
  }
  // Only proceed if the output length passes check
  if (checkOutputLength(outputAnswer)) {
    const numericValue = getNumericValue(buttonClass);
    outputAnswer.textContent += numericValue.toString();
  }
  actionTracker = "number";
};

/**
 * This function updates the state of global variables for value and operator that are being used 
 * to perform th calculation. It also updates the state of outputHistory.
 * @param buttonClass 
 */
const clickOperator = (buttonClass: string) => {
  if (actionTracker === "operator" || actionTracker === "equals") {
    operator = null;
  }
  if (operator) {
    let currentTextContent = parseToNumber(outputAnswer);
    let result = calculate(value, currentTextContent, operator);
    outputHistory.textContent = `${value}${operator}${currentTextContent}`;
    value = result;
    if (value !== null) {
      outputAnswer.textContent = value.toString();
    }
  } else {
    value = parseToNumber(outputAnswer); // case when operator is used first time or after clear so the global var is null
  }
  operator = getOperator(buttonClass);
  actionTracker = "operator";
};

/**
 * This is main handler function for all options available in calculator.
 * There are four main operations depending on button type.
 * 1. Type "number" -> calls {@link clickNumber},
 * 2. Type "operator" -> calls {@link clickOperator},
 * 3. Type "decimal" -> calls {@link clickDecimal},
 * 4. Type "action" -> calls {@link clickAction}.
 * @param event
 */
const handleClickButton = (event: Event) => {
  const target = event.currentTarget as HTMLButtonElement;
  // Ensure the event target is a button element
  if (target instanceof HTMLButtonElement) {
    // Get the class and type of the button
    const buttonClass = target.className;
    const buttonType = target.dataset.type;
    // Check button type
    if (buttonType === "number") {
      clickNumber(buttonClass);
    } else if (buttonType === "decimal") {
      clickDecimal(outputAnswer);
    } else if (buttonType === "operator") {
      clickOperator(buttonClass);
    } else if (buttonType === "action") {
      clickAction(buttonClass);
    }
  }
};

// Add event listener for each button
calculatorButton.forEach((button) => {
  button.addEventListener("click", handleClickButton);
});

/**
 * This function performs addition on two numbers
 * @param number1
 * @param number2
 * @returns number | null
 */
const addNumbers = (
  number1: number | null,
  number2: number | null
): number | null => {
  if (number1 !== null && number2 !== null) {
    return number1 + number2;
  } else {
    alert("Invalid input.");
    return null;
  }
};

/**
 * This function performs subtraction on two given numbers.
 * @param number1
 * @param number2
 * @returns number | null
 */
const subtractNumbers = (
  number1: number | null,
  number2: number | null
): number | null => {
  if (number1 !== null && number2 !== null) {
    return number1 - number2;
  } else {
    alert("Invalid input.");
    return null;
  }
};

/**
 * This function performs multiplication on two given numbers.
 * @param number1
 * @param number2
 * @returns number | null
 */
const multiplyNumbers = (
  number1: number | null,
  number2: number | null
): number | null => {
  if (number1 !== null && number2 !== null) {
    return number1 * number2;
  } else {
    alert("Invalid input.");
    return null;
  }
};

/**
 * This function perform division on two given numbers.
 * @param number1
 * @param number2
 * @returns number | null
 */
const divideNumbers = (
  number1: number | null,
  number2: number | null
): number | null => {
  if (number1 !== null && number2 !== null) {
    return number1 / number2;
  } else {
    alert("Invalid input.");
    return null;
  }
};

/**
 * This function calculates percent for current output.
 * @param number
 * @returns number | null
 */
const calculatePercent = (number: number | null): number | null => {
  if (number !== null && number !== undefined) {
    return number / 100;
  } else {
    alert("Invalid input.");
    return number;
  }
};

/**
 * This function uses four operation functions depending on operator's sign:
 * {@link addNumbers} for addition,
 * {@link subtractNumbers} for subtraction,
 * {@link divideNumbers} for division,
 * {@link multiplyNumbers} for multiplication,
 * @param number1
 * @param number2
 * @param operator
 * @returns number | null
 */
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
