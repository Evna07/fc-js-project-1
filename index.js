import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
// Selecting DOM elements
const incomeList = document.querySelector("#incomeList");
const incomeDescription = document.querySelector("#incomeDescription");
const incomeAmount = document.querySelector("#incomeAmount");
const formIncome = document.querySelector("#incomeForm");
const incomesContainer = document.querySelector("#incomesContainer");

const expenseList = document.querySelector("#expenseList");
const expenseDescription = document.querySelector("#expenseDescription");
const expenseAmount = document.querySelector("#expenseAmount");
const formExpense = document.querySelector("#expenseForm");
const expensesContainer = document.querySelector("#expensesContainer");

const balance = document.querySelector("#balance");
balance.textContent = "Bilans wynosi zero";

const errorLabel = document.createElement("span");
errorLabel.classList.add("error-label");

// Error label
const emptyDescriptionError = (descriptionId, inputId, containerId) => {
  if (descriptionId.value.trim() === "" || inputId.value === 0) {
    errorLabel.textContent = "Pola nie mogą być puste";
    descriptionId.value = "";
  } else if (inputId.value < 0.01) {
    errorLabel.textContent = "Kwota nie może być mniejsza niż 0.01";
  }

  if (containerId === "incomes") {
    incomesContainer.appendChild(errorLabel);
  } else if (containerId === "expenses") {
    expensesContainer.appendChild(errorLabel);
  }
};

// Creating list item
const addListItem = (transactionDescription, transactionAmount, listId) => {
  const transactionObject = {
    id: nanoid(),
    description: transactionDescription.value.trim(),
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
const validateInput = (
  transactionDescription,
  transactionAmount,
  listId,
  containerId
) => {
  if (!transactionDescription.value.trim() || transactionAmount.value < 0.01) {
    emptyDescriptionError(
      transactionDescription,
      transactionAmount,
      containerId
    );
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
  buttonEdit.setAttribute("id", "editBtn");
  buttonEdit.textContent = "Edytuj";
  li.appendChild(buttonEdit);

  buttonEdit.addEventListener("click", () => {
    editTransaction(li, transactionObject, listId);
  });
};

// Editing transaction
const editTransaction = (li, transactionObject, listId) => {
  const tempForm = document.createElement("form");
  tempForm.classList.add("list-form");
  li.textContent = "";
  li.appendChild(tempForm);
  const tempDescr = document.createElement("input");
  tempDescr.classList.add("input-field");
  tempDescr.setAttribute("required", "true");
  tempDescr.value = transactionObject.description;
  tempForm.appendChild(tempDescr);
  const tempAmnt = document.createElement("input");
  tempAmnt.classList.add("input-field");
  tempAmnt.setAttribute("required", "true");
  tempAmnt.setAttribute("min", "0.01");
  tempAmnt.setAttribute("step", "0.01");
  tempAmnt.setAttribute("type", "number");
  tempAmnt.value = transactionObject.value;
  tempForm.appendChild(tempAmnt);

  // Making Accept Button
  const buttonAccept = document.createElement("button");
  buttonAccept.classList.add("action-button");
  buttonAccept.textContent = "Akceptuj";
  tempForm.appendChild(buttonAccept);

  // Making Cancell Button
  const buttonCancel = document.createElement("button");
  buttonCancel.classList.add("action-button");
  buttonCancel.textContent = "Anuluj";
  tempForm.appendChild(buttonCancel);

  tempForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (event.submitter === buttonAccept) {
      errorLabel.remove();
      acceptTransaction(
        li,
        tempDescr,
        tempAmnt,
        tempForm,
        transactionObject,
        listId
      );
    } else if (event.submitter === buttonCancel) {
      cancellChanges(li, tempForm, transactionObject, listId);
    }
  });
  console.log(transactionObject);
  console.log(`incomes: ${incomeTransactions}`);
  console.log(`expenses: ${expenseTransactions}`);
};

// Cancell changes
const cancellChanges = (li, tempForm, transactionObject, listId) => {
  const spanDes = document.createElement("span");
  spanDes.classList.add("transaction-details");

  const spanAmnt = document.createElement("span");
  spanAmnt.classList.add("transaction-details");

  const spanPln = document.createElement("span");
  spanPln.textContent = " PLN";

  tempForm.remove();
  spanDes.textContent = transactionObject.description;
  li.appendChild(spanDes);
  spanAmnt.textContent = transactionObject.value;
  li.appendChild(spanAmnt);
  li.appendChild(spanPln);

  addEditButton(li, transactionObject, listId);
  addDeleteButton(li, transactionObject, listId);
};

// Accept changes
const acceptTransaction = (
  li,
  tempDescr,
  tempAmnt,
  tempForm,
  transactionObject,
  listId
) => {
  const oldDescr = transactionObject.description;
  const oldAmnt = transactionObject.value;

  const spanDes = document.createElement("span");
  spanDes.classList.add("transaction-details");

  const spanAmnt = document.createElement("span");
  spanAmnt.classList.add("transaction-details");

  const spanPln = document.createElement("span");
  spanPln.textContent = " PLN";

  if (!tempDescr.value.trim()) {
    errorLabel.textContent = "Pola nie mogą być puste";
    tempDescr.value = "";
    li.appendChild(errorLabel);
    return false;
  } else {
    if (
      // None changes where made variant
      tempDescr.value === oldDescr &&
      Number(tempAmnt.value) === oldAmnt
    ) {
      cancellChanges(li, tempForm, transactionObject);
    }
    // Changes made to either description or amount
    else {
      tempDescr.value.trim() !== oldDescr
        ? (spanDes.textContent = tempDescr.value.trim())
        : (spanDes.textContent = oldDescr);

      transactionObject.description = spanDes.textContent;

      Number(tempAmnt.value) !== oldAmnt
        ? (spanAmnt.textContent = Number(tempAmnt.value))
        : (spanAmnt.textContent = oldAmnt);

      transactionObject.value = Number(spanAmnt.textContent);

      console.log(transactionObject);

      tempForm.remove();
      li.appendChild(spanDes);
      li.appendChild(spanAmnt);
      li.appendChild(spanPln);

      updateBalance(transactionObject);
      addEditButton(li, transactionObject, listId);
      addDeleteButton(li, transactionObject, listId);
    }
  }
};

const runBudget = (
  transactionDescription,
  transactionAmount,
  listId,
  containerId
) => {
  errorLabel.remove();
  validateInput(transactionDescription, transactionAmount, listId, containerId);
};

formIncome.addEventListener("submit", (event) => {
  event.preventDefault();
  const containerId = "incomes";
  runBudget(incomeDescription, incomeAmount, incomeList, containerId);
});

formExpense.addEventListener("submit", (event) => {
  event.preventDefault();
  const containerId = "expenses";
  runBudget(expenseDescription, expenseAmount, expenseList, containerId);
});
