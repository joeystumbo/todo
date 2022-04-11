const fs = require('fs');

  const DB_FILE = "./db.csv";

  //Writer class
  //# -----------------
  //this class will create a new file with the new data
  class Writer {
    constructor(path, data) {
      this.path = path;
      this.data = data;
    }
  
    /**
    * create the file and write it with the right data
    * @return {int} total sum of lines written
    */
    serialize() {
      if(!fs.existsSync(this.path)){
        console.error("db file doesn't exist...")
      }
      let rows = 0;
      let writeStream = fs.createWriteStream(this.path);
      writeStream.write("id, message\n");

      this.data.forEach((element, index) => {
        let newLine = []
        for(index in ['id', 'message']){
          newLine.push(element[index]);
        }
        
        //....
        writeStream.write(newLine.join(',')+ '\n');
        rows+=1;
      });

      writeStream.end();
      return rows;
    }

}

//EXPORTED WRAPPER
/**
* serialize data and write it, holding the parameters used to write the file
* @param {list} a list of data entries.
* @return {int} total sum of lines written
*/
const writer = function(data){

  let adapter = new Writer(DB_FILE, data);

  //shallow or deep copy ????
  return adapter.serialize();
}

exports.set_data = writer;