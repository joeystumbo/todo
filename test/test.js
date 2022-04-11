const assert = require("assert");
const fs = require("fs");

const reader = require('../libs/reader.js');
const writer = require('../libs/writer.js');

//Some dummy tests
//be sure of the I/O operations

function test_1(){
  //test writer
  const rows = writer.set_data([["xzxz3434", "ir de compras"],["xzxz3435", "ir al banco"]]);
  assert(fs.existsSync("./db.csv"), "the db file doesn't exist !");
}

function test_2(){
  //test read an load file products
  const db = reader.get_db();
  assert(Object.keys(db).length > 0, "YOU MUST BE ABLE TO LOAD DATA FROM db.csv FILE !");
}

if (require.main === module) {
  test_1();
  setTimeout(() => {console.log("-----------")}, 1000);
  test_2();
}



