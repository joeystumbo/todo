const fs = require('fs');

  const DB_FILE = "./db.csv";
  //Reader class
  //# -----------------
  //this class will be used to read and parse de csv file
  class Reader {
    constructor(path) {
      this.path = path;
      this.db = {};
      this.dataArray = [];
      this.__read_file();
  }

  // Private Method
  // read the file in a SYNC way and fill the dataArray struct
  __read_file(){
    if(!fs.existsSync(this.path)){
      let writeStream = fs.createWriteStream(this.path);
      writeStream.write("id, message\n");
      writeStream.end();
    }
    //then...
    try{
      let data =fs.readFileSync(this.path, 'utf8');
      this.dataArray = data.split(/\r?\n/);
    }catch (err) {
      // Here you get the error fi soemthig goes wrong with the file
      console.error("Can't read the file...", err);
    }
  }

  // Method
  //# deserialize: take data from the file and fill a dictionary
  deserialize() {
    let column_id, column_msg;
    //skip the first line because it is the column name
    for(let i = 1; i < this.dataArray.length; ++i){
      [column_id, column_msg] = this.dataArray[i].split(",");
      if(String(column_id).length > 0){
        this.db[String(column_id)] = {"msg": column_msg};
      }
    }

    return this.db;
  }

  // Method
  //# get the data
  get() {
    return this.deserialize();
  }
}


//EXPORTED WRAPPER
/**
* given a file, read it contents and create a dictionary
* @return {dict} the object holding the structured data
*/
const reader = function(){
  let data = new Reader(DB_FILE);
  //shallow or deep copy, let make it shallow but, take care of these.
  return data.get();
}

exports.get_db = reader;