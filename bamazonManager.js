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
		Inquirer.prompt([
			{
			  name: 'operation',
			  message: 'What would you like to do?',
			  type: 'list',
			  choices: [
				  {
				  	name: "View Products for Sale",
				  	value : "view-prod"
				  },
				  {
				  	name: 'View Low Inventory',
				  	value : "low-inv"
				  },	
				  {
				  	name: "Add to Inventory",
				  	value : "add-inv"
				  },
				  {
				  	name: 'Add New Product',
				  	value : "add-prod"
				  }	    
			  ]
			} 
		]).then(data => {
							
				if( ! data.operation ){
					console.log("Whoah, something failed.");
					return;	
				} 

				if( data.operation === "view-prod" ){
					console.log("Product List:");
					console.log("==============");
					connection.query("SELECT * FROM products")
						.then( res => console.log(JSON.stringify(res, null, 23)))
						.then(() => connection.end() );
				}

				if( data.operation === "low-inv" ){
					// grab a list of all of our records - we'll need them!					console.log("Product List:");
					
					console.log("List of Products with Low Inventory:");
					console.log("======================================");

					connection.query("SELECT * FROM products WHERE stock_quantity < 5")
						.then( res => console.log(JSON.stringify(res, null, 23)))
						.then(() => connection.end() );
				}

				if( data.operation === "add-inv" ) {
					const questions = [
						{
							type : "text",
							name : "prodId",
							message: "Product-Id of the item you would like to add?"
						},
						{
							type : "text",
							name : "numUnits",
							message : "How many units?"
						}	
					];	
					Inquirer.prompt(questions).then( response => {
						const update = "UPDATE products SET stock_quantity=? WHERE item_id=? ";
					
						connection.query(update, [response.numUnits, response.prodId])
							.then( () => console.log("Record Updated.") )
							.then( () => musicConnection.end() );
					});
				}

				if( data.operation === "add-prod" ) {
					console.log("You have chosen to add a new product.")
					const questions = [
						{
							type : "text",
							name : "prodId",
							message: "Item_Id?"
						},
						{
							type : "text",
							name : "prodName",
							message : "Product_Name?"
						},
						{
							type : "text",
							name : "dept",
							message: "Department_Name?"
						},
						{
							type : "text",
							name : "price",
							message: "Price?"
						},
						{
							type : "text",
							name : "numUnits",
							message: "Number of Units?"
						},	
					];	

					Inquirer.prompt(questions).then( response => {
						const addProd = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity ) VALUES (?, ?, ?, ?, ?)";
					
						connection.query(addProd, [response.prodId, response.prodName, response.dept, response.price, response.numUnits])
							.then( () => console.log("Record Updated.") )
							.then( () => musicConnection.end() );
					});
				}
		});
});

