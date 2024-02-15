import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
// Selecting DOM elements
const incomeList = document.querySelector("#incomeList");
const incomeDescription = document.querySelector("#incomeDescription");
const incomeAmount = document.querySelector("#incomeAmount");
const formIncome = document.querySelector("#incomeForm");

const expenseList = document.querySelector("#expenseList");
const expenseDescription = document.querySelector("#expenseDescription");
const expenseAmount = document.querySelector("#expenseAmount");
const formExpense = document.querySelector("#expenseForm");

// const type = document.querySelector("#type");
const balance = document.querySelector("#balance");
balance.textContent = "Bilans wynosi zero";

const formContainer = document.querySelector(".form-container");
const errorLabel = document.createElement("span");
errorLabel.classList.add("error-label");

// Error label
const emptyDescriptionError = (descriptionId, inputId) => {
  if (descriptionId.value.trim() === "" || inputId.value === 0) {
    errorLabel.textContent = "Żadne pole nie może być puste";
    descriptionId.value = "";
  } else if (inputId.value < 0.01) {
    errorLabel.textContent = "Kwota nie może być mniejsza niż 0.01";
  }
  formContainer.appendChild(errorLabel);
};

// Creating list item
const addListItem = (transactionDescription, transactionAmount, listId) => {
  const transactionObject = {
    id: nanoid(),
    description: transactionDescription.value,
    value: Number(transactionAmount.value),
  };

  const li = document.createElement("li");
  li.classList.add("list-item");

  const spanDes = document.createElement("span");
  spanDes.classList.add("transaction-details");
  spanDes.textContent = transactionDescription.value.trim();
  li.appendChild(spanDes);

  const spanAmnt = document.createElement("span");
  spanAmnt.classList.add("transaction-details");
  spanAmnt.textContent = Math.abs(transactionAmount.value.trim()).toFixed(2);
  li.appendChild(spanAmnt);

  const spanPln = document.createElement("span");
  spanPln.classList.add("transaction-details");
  spanPln.textContent = " PLN";
  li.appendChild(spanPln);

  listId.appendChild(li);

  addTransaction(
    transactionDescription,
    transactionAmount,
    listId,
    transactionObject
  );
  addEditButton(li, transactionObject, listId);
  addDeleteButton(li, transactionObject, listId);
};

// Arrays to store transactions
const incomeTransactions = [];
const expenseTransactions = [];

const expensesTotal = document.querySelector("#expensesTotal");
const incomesTotal = document.querySelector("#incomesTotal");

// Updating total balance
const updateBalance = () => {
  const sumTotal =
    expenseTransactions.reduce(
      (acc, transactionObject) => acc + -transactionObject.value,
      0
    ) +
    incomeTransactions.reduce(
      (acc, transactionObject) => acc + transactionObject.value,
      0
    );
  if (Number(sumTotal) > 0) {
    balance.textContent = `Możesz jeszcze wydać ${sumTotal.toFixed(2)} złotych`;
    balance.classList.add("positive");
    balance.classList.remove("negative", "zero");
  } else if (sumTotal === 0) {
    balance.textContent = "Bilans wynosi zero";
    balance.classList.add("zero");
    balance.classList.remove("positive", "negative");
  } else {
    balance.textContent = `Bilans jest ujemny. Jesteś na minusie ${-sumTotal.toFixed(
      2
    )} złotych`;
    balance.classList.add("negative");
    balance.classList.remove("positive", "zero");
  }
  expensesTotal.textContent = `Suma wydatków:  ${expenseTransactions.reduce(
    (acc, transactionObject) => acc + transactionObject.value,
    0
  )} PLN`;
  incomesTotal.textContent = `Suma przychodów:  ${incomeTransactions.reduce(
    (acc, transactionObject) => acc + transactionObject.value,
    0
  )} PLN`;
};

// Adding new transaction into array
const addTransaction = (
  transactionDescription,
  transactionAmount,
  transactionList,
  transactionObject
) => {
  if (transactionList === document.querySelector("#incomeList")) {
    incomeTransactions.push(transactionObject);
  } else {
    expenseTransactions.push(transactionObject);
  }

  updateBalance();
  transactionDescription.value = "";
  transactionAmount.value = "";
};

// Input validation
const validateInput = (transactionDescription, transactionAmount, listId) => {
  if (!transactionDescription.value.trim() || transactionAmount.value < 0.01) {
    emptyDescriptionError(transactionDescription, transactionAmount);
    return false;
  }
  addListItem(transactionDescription, transactionAmount, listId);
};

// Deleting transaction
const removeTransaction = (transactionObject, listId) => {
  let transactionArray;
  if (listId.id === "incomeList") {
    transactionArray = incomeTransactions;
  } else {
    transactionArray = expenseTransactions;
  }
  const indexToRemove = transactionArray.findIndex(
    (item) => item.id === transactionObject.id
  );
  if (indexToRemove !== -1) {
    transactionArray.splice(indexToRemove, 1);
    updateBalance();
  }
};

// Making delete button
const addDeleteButton = (li, transactionObject, listId) => {
  const buttonDel = document.createElement("button");
  buttonDel.classList.add("action-button");
  buttonDel.textContent = "Usuń";
  li.appendChild(buttonDel);

  buttonDel.addEventListener("click", () => {
    removeTransaction(transactionObject, listId);
    li.remove();
  });
};

// Making edit button
const addEditButton = (li, transactionObject, listId) => {
  const buttonEdit = document.createElement("button");
  buttonEdit.classList.add("action-button");
  buttonEdit.textContent = "Edytuj";
  li.appendChild(buttonEdit);

  buttonEdit.addEventListener("click", () => {
    editTransaction();
  });
};

// Editing transaction
const editTransaction = () => {
  const currentDescription = spanDes.textContent.trim();
  const currentAmount = spanAmnt.textContent.trim();

  const inputDescription = document.createElement("input");
  inputDescription.classList.add("input-field");
  inputDescription.type = "text";
  inputDescription.placeholder = currentDescription;

  // Add "keypress" event listener to inputDescription
  inputDescription.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buttonAccept.click();
    }
  });

  const inputAmount = document.createElement("input");
  inputAmount.classList.add("input-field");
  inputAmount.type = "number";
  inputAmount.placeholder = currentAmount;

  // Add "keypress" event listener to inputAmount
  inputAmount.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buttonAccept.click();
    }
  });

  li.textContent = "";
  li.appendChild(inputDescription);
  li.appendChild(inputAmount);
};
//! TODO redo rest of the code

//   // Making accept and cancell buttons
//   const buttonAccept = document.createElement("button");
//   buttonAccept.classList.add("accept-transaction");
//   buttonAccept.textContent = "Zatwierdź";
//   li.appendChild(buttonAccept);
//   const buttonCancel = document.createElement("button");
//   buttonCancel.classList.add("cancel-transaction");
//   buttonCancel.textContent = "Anuluj";
//   li.appendChild(buttonCancel);

//   const cancelChange = () => {
//     spanDes.textContent = currentDescription;
//     spanAmnt.textContent = Number(currentAmount);
//   };

//   // Accept button
//   buttonAccept.addEventListener("click", () => {
//     const newDescription = inputDescription.value.trim();
//     const newAmount = Math.abs(Number(inputAmount.value).toFixed(2));
//     if (newDescription !== "" || newAmount !== 0) {
//       newDescription !== ""
//         ? (spanDes.textContent = newDescription)
//         : (spanDes.textContent = currentDescription);

//       newAmount !== 0
//         ? (spanAmnt.textContent = newAmount.toFixed(2))
//         : (spanAmnt.textContent = currentAmount);

//       const totalId = total.findIndex((obj) => obj.id === transactionObject.id);

//       if (totalId !== -1) {
//         total[totalId].description = spanDes.textContent;
//         total[totalId].value = li.classList.contains("income")
//           ? Number(spanAmnt.textContent)
//           : -Number(spanAmnt.textContent);
//       }
//     }
//     buttonAccept.remove();
//     buttonCancel.remove();
//     inputDescription.remove();
//     li.appendChild(spanDes);
//     inputAmount.remove();
//     li.appendChild(spanAmnt);
//     li.appendChild(spanPln);
//     li.appendChild(buttonEdit);
//     li.appendChild(buttonDel);

//     updateBalance();
//   });

//   // Cancel button
//   buttonCancel.addEventListener("click", () => {
//     cancelChange();
//     buttonAccept.remove();
//     buttonCancel.remove();
//     inputDescription.remove();
//     inputAmount.remove();
//     li.appendChild(spanDes);
//     li.appendChild(spanAmnt);
//     li.appendChild(spanPln);
//     li.appendChild(buttonEdit);
//     li.appendChild(buttonDel);
//   });
// });
// li.appendChild(buttonEdit);

// rewriting code

const runBudget = (transactionDescription, transactionAmount, listId) => {
  errorLabel.remove();

  validateInput(transactionDescription, transactionAmount, listId);
};

formIncome.addEventListener("submit", (event) => {
  event.preventDefault();
  runBudget(incomeDescription, incomeAmount, incomeList);
});

formExpense.addEventListener("submit", (event) => {
  event.preventDefault();
  runBudget(expenseDescription, expenseAmount, expenseList);
});
