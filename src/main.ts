import "./main.scss";

//document.querySelector<HTMLDivElement>("#app")!.innerHTML = `

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

const getOperationValue = (buttonClass: string) => {
  buttonClass = buttonClass.replace("calculator__button-", "");
  switch (buttonClass) {
    case "add":
      return "+";
    case "subtract":
      return "-";
    case "multiply":
      return "*";
    case "divide":
      return "/";
    case "negate":
      return "+/-";
    case "percent":
      return "%";
    case "equals":
      return "=";
    default:
      throw new Error("Invalid operation button class.");
  }
};

const checkOutputLength = (output: HTMLOutputElement) => {
  if (output.textContent && output.textContent.length < 18) {
    return true;
  } else if (!output.textContent) {
    return true;
  }
  return false;
};

// Add handler for numeric buttons and operators
const handleClickButton = (event: Event) => {
  const target = event.target as HTMLButtonElement;

  // Ensure the event target is a button element
  if (target instanceof HTMLButtonElement) {
    // Get the class and type of the button
    const buttonClass = target.className;
    const buttonType = target.dataset.type;
    if (buttonType === "number") {
      if (checkOutputLength(outputAnswer)) {
        const numericValue = getNumericValue(buttonClass);
        outputAnswer.textContent += numericValue.toString();
      }
    }
  }
};

//numericValue to be added to calculator__answer as an array
//outputAnswer.textContent = event.target as HTMLButtonElement;
//outputAnswer.textContent = numericValue.toString();

// Add event listener for each numeric button
calculatorButton.forEach((button) => {
  button.addEventListener("click", handleClickButton);
});
