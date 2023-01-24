'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
   owner: 'Jonas Schmedtmann',
   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
   interestRate: 1.2, // %
   pin: 1111,
};

const account2 = {
   owner: 'Jessica Davis',
   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
   interestRate: 1.5,
   pin: 2222,
};

const account3 = {
   owner: 'Steven Thomas Williams',
   movements: [200, -200, 340, -300, -20, 50, 400, -460],
   interestRate: 0.7,
   pin: 3333,
};

const account4 = {
   owner: 'Sarah Smith',
   movements: [430, 1000, 700, 50, 90],
   interestRate: 1,
   pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
// const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
// const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
// const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/**
 * Display deposit and withdrawal amount to the dashboard.
 */
const displayMovements = (movements) => {
   // "innerHTML" property replace HTML code with the new one.
   containerMovements.innerHTML = '';

   movements.forEach((movement, i) => {
      const type = movement > 0 ? 'deposit' : 'withdrawal';

      const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
         i + 1
      } ${type}</div>
            <div class="movements__value">${movement}€</div>
        </div>
      `;

      // "insertAdjacentHTML()" method insert/add HTML or XML code to a specified position.
      containerMovements.insertAdjacentHTML('afterbegin', html);
   });
};

/**
 * Display current balance to the dashboard.
 */
const calcDisplayBalance = (acc) => {
   acc.balance = acc.movements.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
   );

   labelBalance.textContent = `${acc.balance}€`;
};

/**
 * Display total deposits, withdrawals and interest amount summary
 */
const calcDisplaySummary = (acc) => {
   // Display deposits summary
   const totaldepositAmount = acc.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
   labelSumIn.textContent = `${totaldepositAmount}€`;

   // Display withdrawals summary
   const totalWithdrawalAmount = acc.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
   labelSumOut.textContent = `${Math.abs(totalWithdrawalAmount)}€`;

   // Display total interest amount
   const interest = acc.movements
      // filter out only deposit amount
      .filter((mov) => mov > 0)
      // calculate the interest for each deposit amount
      .map((deposit) => (deposit * acc.interestRate) / 100)
      // bank's rule: interest amount should be greater than one to calculate in the total interest amount
      .filter((interestAmount) => interestAmount >= 1)
      // calc total interest amount
      .reduce((acc, interestAmount) => acc + interestAmount, 0);
   labelSumInterest.textContent = `${interest}€`;
};

/**
 * Create username using account's owner's name
 * if name "Steven Thomas Williams" then username "stw"
 */
const createUserNames = (accs) => {
   accs.forEach((acc) => {
      acc.username = acc.owner
         .toLowerCase()
         .split(' ')
         .map((name) => name[0])
         .join('');
   });
};
createUserNames(accounts);

/**
 * Update UI
 */
const updateUI = (curAcc) => {
   // Display movements
   displayMovements(curAcc.movements);

   // Display balance
   calcDisplayBalance(curAcc);

   // Display summary
   calcDisplaySummary(curAcc);
};

/**
 * Implementing Login
 */
let currentAccount;

btnLogin.addEventListener('click', (e) => {
   // Prevent login form from submitting
   e.preventDefault();

   currentAccount = accounts.find(
      (acc) => acc.username === inputLoginUsername.value
   );

   if (currentAccount?.pin === Number(inputLoginPin.value)) {
      // Display UI and welcome message
      labelWelcome.textContent = `Welcome back, ${
         currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 1;

      // Clear input fields
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur(); // "blur" method removes focus from an element.
      inputLoginUsername.blur();

      // Update UI
      updateUI(currentAccount);
   } else {
      alert('Wrong username and password entered. Please check again!');
   }
});

/**
 * User Transfer Money
 */
btnTransfer.addEventListener('click', (e) => {
   e.preventDefault();

   const amount = Number(inputTransferAmount.value);
   const receiverAccount = accounts.find(
      (acc) => acc.username === inputTransferTo.value
   );

   if (
      amount > 0 &&
      receiverAccount &&
      currentAccount.balance >= amount &&
      receiverAccount?.username !== currentAccount.username
   ) {
      // Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAccount.movements.push(amount);

      // Update UI
      updateUI(currentAccount);

      // Clear input fields
      inputTransferAmount.value = inputTransferTo.value = '';
      inputTransferAmount.blur(); // "blur" method removes focus from an element.
      inputTransferTo.blur();
   } else {
      alert('Incorrect! Please check entered detaild again.');
   }
});

/**
 * User Requests Loan
 */
btnLoan.addEventListener('click', (e) => {
   e.preventDefault();

   const amount = Number(inputLoanAmount.value);

   // Any deposit > 10% of requested amount
   if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov >= amount * 0.1)
   ) {
      // Add positive movement to current user
      currentAccount.movements.push(amount);

      // Update UI
      updateUI(currentAccount);

      // Clear input fields
      inputLoanAmount.value = '';
      inputLoanAmount.blur(); // "blur" method removes focus from an element.
   } else {
      alert(
         `${
            currentAccount.owner.split(' ')[0]
         }, requested amount ${amount} is high. Please check!`
      );
   }
});

/**
 * Close Account
 */
btnClose.addEventListener('click', (e) => {
   e.preventDefault();

   // Check correct credentials
   if (
      inputCloseUsername.value === currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin
   ) {
      // Find index of the current account
      const index = accounts.findIndex(
         (acc) => acc.username === currentAccount.username
      );

      // Delete account
      console.log(accounts.splice(index, 1));

      // Log out user (Hide UI)
      containerApp.style.opacity = 0;

      // Update welcome message
      labelWelcome.textContent = 'Log in to get started';
   }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
   ['USD', 'United States dollar'],
   ['EUR', 'Euro'],
   ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

console.log(movements.sort());
