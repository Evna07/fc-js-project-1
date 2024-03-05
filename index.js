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

const balance = document.querySelector("#balance");
balance.textContent = "The balance is zero";

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
    balance.textContent = `You can spend ${sumTotal.toFixed(2)} złotych`;
    balance.classList.add("positive");
    balance.classList.remove("negative", "zero");
  } else if (sumTotal === 0) {
    balance.textContent = "The balance is zero";
    balance.classList.add("zero");
    balance.classList.remove("positive", "negative");
  } else {
    balance.textContent = `The balance is negative. You're in the red ${-sumTotal.toFixed(
      2
    )} złotych`;
    balance.classList.add("negative");
    balance.classList.remove("positive", "zero");
  }
  const expensesSum = expenseTransactions.reduce(
    (acc, transactionObject) => acc + transactionObject.value,
    0
  );
  const incomesSum = incomeTransactions.reduce(
    (acc, transactionObject) => acc + transactionObject.value,
    0
  );
  expensesTotal.textContent = `Suma wydatków:  ${expensesSum.toFixed(2)} PLN`;
  incomesTotal.textContent = `Suma przychodów:  ${incomesSum.toFixed(2)} PLN`;
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
  tempDescr.setAttribute("pattern", "^.*\\S.*");
  tempDescr.setAttribute("title", "The name cannot consist of only spaces");
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
    tempDescr.value = "";
    return false;
  } else {
    if (
      // None changes were made variant
      tempDescr.value === oldDescr &&
      Number(tempAmnt.value) === oldAmnt
    ) {
      cancellChanges(li, tempForm, transactionObject, listId);
    }
    // Changes made to either description or amount
    else {
      transactionObject.description = tempDescr.value.trim();
      transactionObject.value = Number(tempAmnt.value);

      spanDes.textContent = transactionObject.description;
      spanAmnt.textContent = Math.abs(transactionObject.value).toFixed(2);

      tempForm.remove();
      li.appendChild(spanDes);
      li.appendChild(spanAmnt);
      li.appendChild(spanPln);

      updateBalance();
      addEditButton(li, transactionObject, listId);
      addDeleteButton(li, transactionObject, listId);
    }
  }
};

const runBudget = (transactionDescription, transactionAmount, listId) => {
  addListItem(transactionDescription, transactionAmount, listId);
};

formIncome.addEventListener("submit", (event) => {
  event.preventDefault();
  runBudget(incomeDescription, incomeAmount, incomeList);
});

formExpense.addEventListener("submit", (event) => {
  event.preventDefault();
  runBudget(expenseDescription, expenseAmount, expenseList);
});
