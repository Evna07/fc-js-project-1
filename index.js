let addTransaction = document.querySelector("#addTransaction");
let transactionList = document.querySelector("#transactionList");
let description = document.querySelector("#description");
let amount = document.querySelector("#amount");
let select = document.querySelector("#type");
let balance = document.querySelector("#balance");
let total = [];

const balanceTotal = document.createElement("span");
balance.appendChild(balanceTotal);

/*PRZYCISK DO DODAWANIA WPISU*/
addTransaction.addEventListener("click", function () {
  const li = document.createElement("li");
  li.innerHTML = `<span>${description.value} </span> <span>${amount.value} </span><span>PLN</span>`;
  if (description.value !== "" && amount.value !== "") {
    if (type.value === "income") {
      li.classList.add("income");
    } else li.classList.add("expense");
    transactionList.appendChild(li);
    //!dodac dokladanie obiektu do tablicy: {id, type(inc/exp), value}
    /*PRZYCISK DO ZMIENIANIA WARTOSCI*/
    const buttonEdit = document.createElement("button");
    buttonEdit.innerHTML = "Edytuj";
    buttonEdit.addEventListener("click", function () {
      alert("Podaj nowa wartosc");
    });
    li.appendChild(buttonEdit);
    /*PRZYCISK DO USUWANIA WPISU*/
    const buttonDel = document.createElement("button");
    buttonDel.innerHTML = "Usuń";
    li.appendChild(buttonDel); //!dopracowac
    buttonDel.addEventListener("click", function () {
      li.innerHTML = "";
    });
  }
  total.push(Number(amount.value));

  balanceTotal.innerHTML = `Bieżące salo: ${total.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  )}`;
});
