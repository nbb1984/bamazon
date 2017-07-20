const MySQL = require('mysql');
const Inquirer = require('inquirer');
const bluebird = require ('bluebird');
const connection = MySQL.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "IDKwImd07",
	database: "bamazon"
});

connection.connect(function(err){
	// Handle the error if there is one!

	connection.query( "SELECT * FROM products", function(err, res){
		const question =
			{
			    type: "text",
			    name: "itemId",
			    message: "What is the product ID of the product you would like to buy?"
			}
		if (err) throw err; 
		console.log(JSON.stringify(res, null, 23));

		Inquirer.prompt(question).then(function(data) {
				connection.query( "SELECT * FROM products WHERE item_id= ? ", [data.itemId], function(err, res){
					if (err) throw err; 
					console.log(res);
					const unitsQuestion = {
					    type: "text",
					    name: "numUnits",
					    message: "How many units would you like to buy?"
					}

					Inquirer.prompt(unitsQuestion).then(function(answer){
						connection.query( "SELECT stock_quantity FROM products WHERE item_id= ? ", [data.itemId], function(err, res){
							if (err) throw err;
							//var ansInt = number[0].stock_quantity;
							//console.log(ansInt)
							var numUnits = answer.numUnits;
							var stockQuantity = res[0].stock_quantity;
							var newStockQuantity = stockQuantity - numUnits;
							if (stockQuantity < answer.numUnits) {
								console.log("Insufficient Quantity!");
							} else {
								connection.query("UPDATE products SET stock_quantity=? WHERE item_id=? ", [newStockQuantity, data.itemId], function(err) {
									if (err) throw err;
									connection.query("SELECT price FROM products WHERE item_id= ?", [data.itemId], function(err, result) {
										var priceTotal = result[0].price * numUnits;
										console.log("Your total cost: $" + priceTotal);
										connection.end(function(err){
											if (err) throw err;
										});		
									});			
								});
							}			
						});
					});
				});
		});
	});
});


