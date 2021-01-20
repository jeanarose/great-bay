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
              VALUES (?, ?, ?);`,
        [item, category, bid],
        (err, data) => {
          if (err) throw err;
          init();
        }
      );
    });
}

function bidOnItem() {
  connection.query("SELECT * FROM auctions", (err, data) => {
    if (err) throw err;
    const arrayOfItems = data.map((item) => {
      return { item: item.item, value: item.id };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "selection",
          message: "Which item would you like to bid on?",
          choices: arrayOfItems,
        },
        {
          type: "input",
          name: "newBid",
          message: "How much would you like to bid?",
        },
      ])
      .then(({ newBid, selection }) => {
        console.log(selection);
        console.log(newBid);
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === selection) {
            console.log("Current Bid: ", data[i].bid);
            console.log("Your Bid: ", newBid);
            if (data[i].bid < newBid) {
              // Update the item
              console.log("Your bid is good!");
              connection.query(
                "UPDATE auctions SET bid = ? WHERE id = ?;",
                [newBid, selection],
                (err, data) => {
                  if (err) throw err;
                  console.log("Your bid was successfully registered!");
                  init();
                }
              );
            } else {
              // Alert the user that their bid is not sufficient
              console.log("Your bid is too low!");
              init();
            }
            break;
          }
        }
      });
  });
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
      } else if (action === "BID") {
        bidOnItem();
      } else {
        exit();
      }
    });
}

function exit() {
  connection.end();
}
