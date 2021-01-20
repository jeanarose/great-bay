const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "moose",
  database: "greatBay_DB",
});
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id: ${connection.threadId}`);
  init();
});

function postItemForAuction() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the item?",
        name: "item",
      },
      {
        type: "input",
        message: "What is the item's category?",
        name: "category",
      },
      {
        type: "input",
        message: "What is the item's starting bid?",
        name: "bid",
      },
    ])
    .then(({ item, category, bid }) => {
      connection.query(
        `INSERT INTO auctions (item, category, bid)
              VALUES (?, ?, ?);`, [item, category, bid],
        (err, data) => {
          if (err) throw err;
          console.log(data);
          init();
        }
      );
    });
}

function bidOnItem() {
  connection.query("SELECT * FROM auctions", (err, data))
}

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: ["POST", "BID", "EXIT"],
        name: "action",
      },
    ])
    .then(({ action }) => {
      if (action === "POST") {
        postItemForAuction();
      } else if(action === "BID"){
        bidOnItem();
      } else {
        exit();
      }
    });
}

function exit() {
  connection.end();
}
