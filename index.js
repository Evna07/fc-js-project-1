import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
// Selecting DOM elements
const addTransaction = document.querySelector("#addTransaction");
const transactionList = document.querySelector("#transactionList");
const description = document.querySelector("#description");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const balance = document.querySelector("#balance");
const balanceTotal = document.createElement("span");
balance.appendChild(balanceTotal);

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

// Array to store transactions
const total = [];

// Updateing total balance
const updateBalance = () => {
  const sumTotal = total.reduce((acc, val) => acc + val.value, 0);
  if (sumTotal > 0) {
    balanceTotal.textContent = `Możesz jeszcze wydać ${sumTotal.toFixed(
      2
    )} złotych`;
    balance.classList.add("positive");
    balance.classList.remove("negative", "zero");
  } else if (sumTotal === 0) {
    balanceTotal.textContent = `Bilans wynosi zero`;
    balance.classList.add("zero");
    balance.classList.remove("positive", "negative");
  } else {
    balanceTotal.textContent = `Bilans jest ujemny. Jesteś na minusie ${-sumTotal.toFixed(
      2
    )} złotych`;
    balance.classList.add("negative");
    balance.classList.remove("positive", "zero");
  }
  console.log(total);
};

// Deleting transaction
const removeTransaction = (id) => {
  const indexToRemove = total.findIndex((item) => item.id === id);
  if (indexToRemove !== -1) {
    total.splice(indexToRemove, 1);
    updateBalance();
  }
};

//potrzebne ograniczenie, zeby najmniejsza mozliwa wartosc byla rowna 0.01.....

addTransaction.addEventListener("click", function () {
  const li = document.createElement("li");
  const spanDes = document.createElement("span");
  spanDes.textContent = description.value.trim();
  li.appendChild(spanDes);
  const spanAmnt = document.createElement("span");
  spanAmnt.textContent = Math.abs(amount.value.trim()).toFixed(2);
  li.appendChild(spanAmnt);
  const spanPln = document.createElement("span");
  spanPln.textContent = " PLN";
  li.appendChild(spanPln);

  const value = Number(Math.abs(amount.value).toFixed(2));
  if (description.value !== "" && amount.value !== "") {
    const transactionValue = type.value === "income" ? value : -value;

    if (type.value === "income") li.classList.add("income");
    else li.classList.add("expense");

    transactionList.appendChild(li);

    // Edit button
    const buttonEdit = document.createElement("button");
    buttonEdit.textContent = "Edytuj";
    buttonEdit.addEventListener("click", () => {
      const currentDescription = spanDes.textContent.trim();
      const currentAmount = spanAmnt.textContent.trim();

      const inputDescription = document.createElement("input");
      inputDescription.type = "text";
      inputDescription.placeholder = currentDescription;

      const inputAmount = document.createElement("input");
      inputAmount.type = "number";
      inputAmount.placeholder = currentAmount;

      li.textContent = "";
      li.appendChild(inputDescription);
      li.appendChild(inputAmount);

      // Making accept and cancell buttons
      const buttonAccept = document.createElement("button");
      buttonAccept.textContent = "Zatwierdź";
      li.appendChild(buttonAccept);
      const buttonCancel = document.createElement("button");
      buttonCancel.textContent = "Anuluj";
      li.appendChild(buttonCancel);

      const cancelChange = () => {
        spanDes.textContent = currentDescription;
        spanAmnt.textContent = currentAmount;
      };

      // Accept button
      buttonAccept.addEventListener("click", () => {
        const newDescription = inputDescription.value.trim();
        const newAmount = Math.abs(Number(inputAmount.value).toFixed(2));

        if (newDescription !== "" && newAmount !== 0) {
          spanDes.textContent = newDescription;
          spanAmnt.textContent = newAmount;

          const totalId = total.findIndex(
            (obj) => obj.id === transactionObject.id
          );

          if (totalId !== -1) {
            total[totalId].description = newDescription;
            total[totalId].value = li.classList.contains("income")
              ? newAmount
              : -newAmount;
          }
        } else if (newDescription === "" && newAmount !== 0) {
          spanDes.textContent = currentDescription;
          spanAmnt.textContent = newAmount;
        } else if (newDescription !== "" && newAmount === 0) {
          spanDes.textContent = newDescription;
          spanAmnt.textContent = currentAmount;
        } else {
          cancelChange();
        }
        buttonAccept.remove();
        buttonCancel.remove();
        inputDescription.remove();
        li.appendChild(spanDes);
        inputAmount.remove();
        li.appendChild(spanAmnt);
        li.appendChild(spanPln);
        li.appendChild(buttonEdit);
        li.appendChild(buttonDel);

        updateBalance();
      });

      // Cancel button
      buttonCancel.addEventListener("click", () => {
        cancelChange();
        buttonAccept.remove();
        buttonCancel.remove();
        inputDescription.remove();
        inputAmount.remove();
        li.appendChild(spanDes);
        li.appendChild(spanAmnt);
        li.appendChild(spanPln);
        li.appendChild(buttonEdit);
        li.appendChild(buttonDel);
      });
    });

    li.appendChild(buttonEdit);

    const buttonDel = document.createElement("button");
    buttonDel.textContent = "Usuń";
    li.appendChild(buttonDel);
    buttonDel.addEventListener("click", () => {
      li.remove();
      removeTransaction(transactionObject.id);
    });

    const transactionObject = {
      id: nanoid(),
      description: description.value,
      value: transactionValue,
    };
    total.push(transactionObject);

    updateBalance();
    description.value = "";
    amount.value = "";
  }
});
