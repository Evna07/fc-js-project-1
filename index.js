import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
const addTransaction = document.querySelector("#addTransaction");
const transactionList = document.querySelector("#transactionList");
const description = document.querySelector("#description");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const balance = document.querySelector("#balance");
let total = [];
const balanceTotal = document.createElement("span");
balance.appendChild(balanceTotal);

function updateBalance() {
  const sumTotal = total.reduce((acc, val) => acc + val.value, 0);
  if (sumTotal > 0) {
    balanceTotal.innerHTML = `Możesz jeszcze wydać ${sumTotal} złotych`;
    balance.classList.add("positive");
    balance.classList.remove("negative", "zero");
  } else if (sumTotal === 0) {
    balanceTotal.innerHTML = `Bilans wynosi zero`;
    balance.classList.add("zero");
    balance.classList.remove("positive", "negative");
  } else {
    balanceTotal.innerHTML = `Bilans jest ujemny. Jesteś na minusie ${-sumTotal} złotych`;
    balance.classList.add("negative");
    balance.classList.remove("positive", "zero");
  }
  console.log(total);
}

function removeTransaction(id) {
  total.forEach((item, index) => {
    if (item.id === id) {
      total.splice(index, 1);
      updateBalance();
    }
  });
}

addTransaction.addEventListener("click", function () {
  const li = document.createElement("li");
  li.innerHTML = `<span>${description.value} </span> <span>${amount.value} </span><span>PLN</span>`;

  if (description.value !== "" && amount.value !== "") {
    const transactionValue =
      type.value === "income" ? Number(amount.value) : -Number(amount.value);

    if (type.value === "income") li.classList.add("income");
    else li.classList.add("expense");

    transactionList.appendChild(li);
    const buttonEdit = document.createElement("button");
    buttonEdit.innerHTML = "Edytuj";
    buttonEdit.addEventListener("click", () => {
      const currentDescription = li
        .querySelector("span:nth-child(1)")
        .textContent.trim();
      const currentAmount = li
        .querySelector("span:nth-child(2)")
        .textContent.trim();

      const inputDescription = document.createElement("input");
      inputDescription.type = "text";
      inputDescription.value = currentDescription;
      inputDescription.placeholder = currentDescription;

      const inputAmount = document.createElement("input");
      inputAmount.type = "text";
      inputAmount.value = currentAmount;
      inputAmount.placeholder = currentAmount;

      li.innerHTML = "";
      li.appendChild(inputDescription);
      li.appendChild(inputAmount);

      const buttonAccept = document.createElement("button");
      buttonAccept.innerHTML = "Zatwierdź";
      li.appendChild(buttonAccept);

      const buttonCancel = document.createElement("button");
      buttonCancel.innerHTML = "Anuluj";
      li.appendChild(buttonCancel);

      buttonAccept.addEventListener("click", () => {
        const newDescription = inputDescription.value.trim();
        const newAmount = inputAmount.value.trim();

        if (newDescription !== "" && newAmount !== "") {
          li.innerHTML = `<span>${newDescription}</span> <span>${newAmount} </span><span>PLN</span>`;

          const totalId = total.findIndex(
            (obj) => obj.id === transactionObject.id
          );

          if (totalId !== -1) {
            total[totalId].description = newDescription;
            total[totalId].value =
              type.value === "income" ? Number(newAmount) : -Number(newAmount);
          }
        } else {
          li.innerHTML = `<span>${currentDescription}</span> <span>${currentAmount} </span><span>PLN</span>`;
        }

        li.appendChild(buttonEdit);
        li.appendChild(buttonDel);

        updateBalance();
      });

      buttonCancel.addEventListener("click", () => {
        li.innerHTML = `<span>${currentDescription}</span> <span>${currentAmount} </span><span>PLN</span>`;

        li.appendChild(buttonEdit);
        li.appendChild(buttonDel);
      });
    });

    li.appendChild(buttonEdit);

    const buttonDel = document.createElement("button");
    buttonDel.innerHTML = "Usuń";
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
  }
});
