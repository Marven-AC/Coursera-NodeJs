// node application that interact with our mongodb server
const MongoClient = require('mongodb').MongoClient; // enable us to connect to the mongodb server
const assert = require('assert'); // to check for true and false
const dboper = require('./operations');

// 27017 port where mongodb is running
const url = 'mongodb://localhost:27017/';
const dbname = 'confusion';

MongoClient.connect(url).then((client) => {
    // assert to assure there is no error, checks error == null assert.strictEqual(err, null)

    console.log('Connected correctly to server');
    // connect to the db named confusion
    const db = client.db(dbname);

    dboper.insertDocument(db, { name: "Vadonut", description: "Test" }, 'dishes')
        .then((result) => {
            console.log('Insert Document:\n', result.ops);

            return dboper.findDocuments(db, 'dishes');
        })
        .then((docs) => {
            console.log("Found documents:\n", docs);

            return dboper.updateDocument(db, { name: 'Vadonut' }, { description: "Updated Test" }, 'dishes');
        })
        .then((result) => {
            console.log("Updated Documents:\n", result.result);

            return dboper.findDocuments(db, 'dishes');
        })
        .then((docs) => {
            console.log("Found documents:\n", docs);

            return db.dropCollection('dishes');
        })
        .then((result) => {
            console.log("Droped collection:", result);
            return client.close();
        })
        .catch((err) => console.log(err));
})
    .catch((err) => console.log(err));




/*
const collection = db.collection('dishes');

collection.insertOne({ "name": "Uthappizza", "descripiton": "test" }, (err, result) => {
    assert.strictEqual(err, null);

    console.log("After Insert:\n");
    console.log(result.ops); // .ops how many operation carried out successfully

    collection.find({}).toArray((err, docs) => {
        assert.strictEqual(err, null);
        console.log('Found: \n');
        console.log(docs); // docs all the document of the collection that match the criteria in this case all the documents will be returned

        db.dropCollection('dishes', (err, result) => {
            assert.strictEqual(err, null);

            client.close();
        });
    });
});
*/
