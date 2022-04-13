const assert = require("assert");
const fs = require("fs");
const http = require('http')

const writer = require('../libs/writer.js');
const reader = require('../libs/reader.js');

//Some dummy tests
//be sure of the I/O operations

function test_1(){
  //test writer
  console.log('\x1b[36m%s\x1b[0m', "test_1: writter");
  const rows = writer.set_data([["xzxz3434", "ir de compras"],["xzxz3435", "ir al banco"]]);
  assert(fs.existsSync("./db.csv"), "the db file doesn't exist !");
}

function test_2(){
  //test read an load file
  console.log('\x1b[36m%s\x1b[0m', "test_2: reader");
  const db = reader.get_db();
  assert(Object.keys(db).length > 0, "YOU MUST BE ABLE TO LOAD DATA FROM db.csv FILE !");
}

function test_3(){
  //test http requests
  console.log('\x1b[36m%s\x1b[0m', "test_3: http request");
  const options = [{
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    assert_code: 301
  },{
    hostname: 'localhost',
    port: 3000,
    path: '/get_all',
    method: 'GET',
    assert_code: 200
  },{
    hostname: 'localhost',
    port: 3000,
    path: '/add',
    method: 'GET',
    assert_code: 200
  },{
    hostname: 'localhost',
    port: 3000,
    path: '/remove',
    method: 'GET',
    assert_code: 200
  }];

  for(let i = 0; i < options.length; ++i){
    const req = http.request(options[i], res => {
      console.log(res.statusCode, options[i].assert_code, options[i].path );
      assert(res.statusCode == options[i].assert_code, "unexpected response code..");
    });

    req.on('error', error => {
      console.error(error)
    })

    req.end();
  }
  
}


if (require.main === module) {
  test_1();
  //fake sleep due to I/O read write operation race conditions
  setTimeout(() => {
    test_2()}, 1000);

  test_3();
  
}



