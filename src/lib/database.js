const sqlite3 = require('sqlite3');
const path = require('path');

const dataPath = path.join(path.dirname(path.join(__dirname)),"\\data\\file.sqlite");

const db =new sqlite3.Database(dataPath,sqlite3.OPEN_READWRITE);

db.close();

class localDataBase
{
    constructor(path=dataPath)
    {
        this.path=path;
    }

    create()
    {
        const db =new sqlite3.Database(this.path);

        db.close();
    }

    createTable(name)
    {
        const db =new sqlite3.Database(this.path);

        db.serialize(() => {

            db.run("CREATE TABLE "+ name +" (info TEXT)");

        });

        db.close();
    }

    insertValues(table,values)
    {
        const db =new sqlite3.Database(this.path);

        db.serialize(() => {
            
            const stmt = db.prepare("INSERT INTO "+table+" VALUES (?)");
            
            for (let row in values) {
                stmt.run(row);
            }
            stmt.finalize();
        
        });

        db.close();
    }

    getAllValues(table)
    {
        const db =new sqlite3.Database(this.path);

        db.serialize(() => {
                    
            db.each("SELECT rowid AS id, info FROM "+table, (err, row) => {
                console.log(row.id + ": " + row.info);
            });
        });

        db.close();
    }

}


const myDB = new localDataBase(dataPath);

// myDB.createTable("prueba");

myDB.insertValues("prueba",["Row1","Row2","Row1"])

myDB.getAllValues("prueba")