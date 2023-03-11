const sqlite3 = require('better-sqlite3');
const Database = require('better-sqlite3');

const path = require('path');
const { stringify } = require('querystring');
const internal = require('stream');

const dataPath = path.join(path.dirname(path.join(__dirname)),"\\data\\file.sqlite");

const infoDataDB = {
    productsColumns : [
        "id_product INTEGER PRIMARY KEY NOT NULL",
        "name varchar(200) NOT NULL UNIQUE",
        "skull varchar(20) NOT NULL UNIQUE",
        "price int(11)",
        "stock int(10) NOT NULL", 
        "description text(500)"
    ],
    
    clientColumns : [
        "id_client INTEGER PRIMARY KEY NOT NULL",
        "CI varchar(10) UNIQUE",
        "name_1 varchar(30)",
        "name_2 varchar(30)",
        "lastname_1 varchar(30)",
        "lastname_2 varchar(30)",
        "phone varchar(10)",
        "email varchar(100)"
    ],
    ticketsColumns : [
        "id_ticket INTEGER PRIMARY KEY NOT NULL",
        "id_ticket_client int(11) not null",
        "title  varchar(30)",
        "date  varchar(30)",
        "bill_info varchar(10)",
        "description text(500)",
        "CONSTRAINT fk_cliente_ticket FOREIGN KEY (id_ticket_client) "+
        "REFERENCES gyd_clients (id_client)"
    ],
    categoryColumns: [
        "id_category INTEGER PRIMARY KEY NOT NULL",
        "id_category_product int(11) not null",        
        "name varchar(20) UNIQUE",
        "CONSTRAINT fk_cliente_ticket FOREIGN KEY (id_category_product) "+
        "REFERENCES gyd_products (id_product)"
    ],
    productsTicketsColumns : [
        "id_pt_product INTEGER(11) not null",
        "id_pt_ticket INTEGER(11) not null",        
        "quantity INTEGER(11)",
        "CONSTRAINT fk_pt_product FOREIGN KEY (id_pt_product) "+
        "REFERENCES gyd_products (id_product)",
        "CONSTRAINT fk_pt_ticket FOREIGN KEY (id_pt_ticket) "+
        "REFERENCES gyd_tickets (id_ticket)",
        "PRIMARY KEY(id_pt_product,id_pt_ticket)"
    ],

    productsFields : [
        "id_product",
        "name",
        "skull",
        "price",
        "stock",
        "description"
    ],
    
    clientFields : [
        "id_client",
        "CI",
        "name_1",
        "name_2",
        "lastname_1",
        "lastname_2",
        "phone",
        "email"
    ],
    
    ticketsFields : [
        "id_ticket",
        "id_ticket_client",
        "title",
        "date",
        "bill_info",
        "description"
    ],
    categoryFields : [
        "id_category",
        "name",
        "id_category_product"
    ],
    productsTicketsFields: [
        "id_pt_product",
        "id_pt_ticket",        
        "quantity"
    ],
    clientAnon : {
        CI:"9999999999",
        name1:"Consumidor",
        name2:"Final",
        lastname1:"Consumidor",
        lastname2:"Final",
        phone:"9999999999",
        email:"@"
    },
    productExample : {
        name:  "Example",
        skull: "ABCD000",
        price: 10000,
        stock: 20,
        description: "An example product"
    }
}


function getFirstWord(array)
{
    let result=[];
    for(let element of array)
    {
        result.push(element.split(" ")[0])
    }
    return result;
}

class localDataBase
{
    constructor(path=dataPath)
    {
        this.path=path;
    }

    create()
    {
        const db =new Database(this.path);

        db.close();
    }
    // Columns es un array
    createTable(name,columns)
    {
        const db =new Database(this.path);

        db.exec("CREATE TABLE IF NOT EXISTS "+ name +" ("+columns.join()+")");

        db.close();
    }

    removeTable(name)
    {
        const db =new Database(this.path);

        db.exec("DROP TABLE "+ name );

        db.close();
    }

    insertValues(table,values,columns)
    {
        const db =new Database(this.path);

        let fields="";

        for(let el of values[0].split(",").slice(1))
        {
            fields+="?,";
        }

        fields+="?";

        const stmt = db.prepare("INSERT INTO "+table+" ("+columns.join(",")+") VALUES ("+fields+")");
        
        for (let row of values) {
            let rowInfo=row.split(",");
            stmt.run(rowInfo);
        }
         
        db.close();
    }

    updateRecord(table, column, value, id)
    {
        const db = sqlite3(this.path);

        const updateRecordSql = 
        ` UPDATE ${table}
          SET ${column} = ?
          WHERE id_product = ?
        `;
      
        db.prepare(updateRecordSql).run(value, id);

        db.close();
    };

    deleteRecord(table, id)
    {

        const db = sqlite3(this.path);
        const deleteRecordSql = 
        `
          DELETE FROM ${table}
          WHERE id_product = ?
        `;
      
        db.prepare(deleteRecordSql).run(id);
        db.close();

    };

    getAllValues(table)
    {
        const db =new Database(this.path);

        const stmt      = db.prepare("SELECT * FROM "+table);
        const dataFound = stmt.all();

        db.close();

        return dataFound;
    }

}

class clientsDB extends localDataBase
{
    constructor(path=dataPath)
    {
        super(path);
    }

    insert(data)
    {
        let info = [
            data.CI,
            data.name1,
            data.name2,
            data.lastname1,
            data.lastname2,
            data.phone,
            data.email
        ];  

        info = info.join(",");

        console.log(info)

        this.insertValues("gyd_clients",[info],infoDataDB.clientFields.slice(1))

    };
}

class productsDB extends localDataBase
{
    constructor(path=dataPath)
    {
        super(path);
    }

    //Products Functions:
    insert(data)
    {
        let ppp = data.price;

        ppp = Math.round(ppp * 100)
        ppp = ppp.toString().replace(".","");
    
        let info = [
            data.name,
            data.skull,
            ppp,
            data.stock,
            data.description
        ];  

        info = info.join(",");

        console.log(info);

        this.insertValues("gyd_products",[info],infoDataDB.productsFields.slice(1));

    };

    update(column,value,id)
    {
        this.updateRecord("gyd_products",column,value,id);
    };

    delete(id)
    {
        this.deleteRecord("gyd_products",id);
    };

    get()
    {
        const dataFound = this.getAllValues("gyd_products",infoDataDB.productsFields);
        return dataFound;
    };
}

class ticketsDB extends localDataBase
{
    constructor(path=dataPath)
    {
        super(path);
    }
    //Tickets Functions:
    insert(data)
    {
 
        let info = [
            data.clientID,
            data.title,
            data.date,
            data.bill_info,
            data.description
        ];  

        info = info.join(",");

        console.log(info);

        this.insertValues("gyd_tickets",[info],infoDataDB.ticketsFields.slice(1));

    };

    update(column,value,id)
    {
        this.updateRecord("gyd_tickets",column,value,id);
    };

    delete(id)
    {
        this.deleteRecord("gyd_tickets",id);
    };

    get()
    {
        const dataFound = this.getAllValues("gyd_tickets",infoDataDB.ticketsFields);
        return dataFound;
    };
}

class productsTicketsDB extends localDataBase
{
    //Products-Tickets Functions:
    insert(data)
    {
 
        let info = [
            data.productID,
            data.ticketID,
            data.quantity
        ];  

        info = info.join(",");

        console.log(info);

        this.insertValues("gyd_products_tickets",[info],infoDataDB.productsTicketsFields);

    };

    update(column,value,id)
    {
        this.updateRecord("gyd_products_tickets",column,value,id);
    };

    delete(id)
    {
        this.deleteRecord("gyd_products_tickets",id);
    };

    get()
    {
        const dataFound = this.getAllValues("gyd_products_tickets",infoDataDB.ticketsFields);
        return dataFound;
    };
}

class programDataBase extends localDataBase
{
    constructor(path=dataPath)
    {
        super(path);
        this.clients         = new clientsDB(dataPath);
        this.products        = new productsDB(dataPath);
        this.tickets         = new ticketsDB(dataPath);
        this.productsTickets = new productsTicketsDB(dataPath);
    }

}


const myDB = new localDataBase(dataPath);
const workDataBase = new programDataBase(dataPath);

if(true)
{
    myDB.create();
    myDB.createTable("gyd_products",infoDataDB.productsColumns);
    myDB.createTable("gyd_tickets",infoDataDB.ticketsColumns);
    myDB.createTable("gyd_clients",infoDataDB.clientColumns);
    myDB.createTable("gyd_categories",infoDataDB.categoryColumns);
    myDB.createTable("gyd_products_tickets",infoDataDB.productsTicketsColumns);
}

workDataBase.productsTickets.insert({productID:3,ticketID:2,quantity:3})

exports.programDataBase = programDataBase;