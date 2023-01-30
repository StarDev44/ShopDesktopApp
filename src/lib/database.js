const sqlite3 = require('sqlite3');
const path = require('path');

const dataPath = path.join(path.dirname(path.join(__dirname)),"\\data\\file.sqlite");

const db =new sqlite3.Database(dataPath,sqlite3.OPEN_READWRITE);

db.close();

class localDataBase
{
    consruct(path=dataPath)
    {
        this.path=path;
    }
}

function createDatabase(dataPath_)
{
    const db =new sqlite3.Database(dataPath_);

    db.serialize(() => {
        db.run("CREATE TABLE lorem (info TEXT)");
    
        const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        for (let i = 0; i < 10; i++) {
            stmt.run("Ipsum " + i);
        }
        stmt.finalize();
    
        db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
            console.log(row.id + ": " + row.info);
        });
    });

    db.close();
}


