

import mongodb  from 'mongodb';
let MongoClient = mongodb.MongoClient;

import express from 'express';
const uri = "mongodb+srv://test:test@cluster0.mdmzq.mongodb.net/?retryWrites=true&w=majority";
import xlsxFile  from 'read-excel-file/node';
 
const client = new MongoClient(uri,{
});

const app = express();
const PORT = 9191;

app.use(express.json());
app.use(express.urlencoded());

client.connect(err =>{
    if(err){
        console.log(err)
    }
    console.log("CONNECTED TO DB")
})

const db = client.db('test');
client.close();

// GETTING END POINTS
app.get('/getFood', async(req, res) => {
    console.log()
    try{
        const limitGiven = 100;
        const totalRecord = await (await db.collection('food').find({}).toArray()).length;
        const foods = await db.collection('food').find({}).limit(limitGiven).toArray();
        res.send({
            'status':200,
            'data': foods,
            'total':totalRecord
        })
    } catch(e){
        res.send({
            'status':500,
            'data': e
        })
    }
});

// i want : kya delete karna
// unique identified -- automically aata hai har ek doc ..
//_id 
// string part of the id -- i can manage to get from UI

//recieve id using --request.body
// requet.body.deleteId 
//db.collection('food').deleteOne({_id:mongodb.Object()})
//ORM - M


// connect to db
// c r d
app.get('/filterFood', async(req, res) => {
    console.log(req)
    const foods = await db.collection('food').find({'cuisine':'breakfast','cost':'200'}).toArray();
    res.send({
        'status':200,
        'data': foods
    })
});

app.post('/addFood',async(req,res)=>{
    console.log({...req.body})
    const result = await db.collection('food').insertOne({...req.body})
    res.send({
        'status':200,
        'message': 'Food item addded successfully',
        'resultWeGot':result
    })
});

app.post('/addFoods',async(req,res)=>{
    let result ='';
    const schema = {
        'name':{
            prop:'name',
            type:String
        },
        'cuisine':{
            prop:'cuisine',
            type:String
        },
        'cost':{
            prop:'cost',
            type:Number
        }
    }
    xlsxFile('./foods.xlsx',{ schema }).then((rows) => {
        //const result = await db.collection('food').insertOne({...rows}])
        console.log(rows.rows)
        result = db.collection('food').insertMany([...rows.rows])
        //rows.e(element => {
           // console.log(element)
            //const result = db.collection('food').insertOne({...element})
            //console.table(result);
       // });
        //const result = db.collection('food').insertMany([...rows])
        //console.table(rows);
    })

    //const result1 = ''//await db.collection('food').insertMany([{...req.body},{...req.body},{...req.body}])
    res.send({
        'status':200,
        'message': 'Food item addded successfully',
        'resultWeGot':result
    })
});


app.delete('/deleteFood',async(req,res)=>{
    const mongoObjectToDelete = mongodb.ObjectId(req.body.deleteId)
    const foodCollection = db.collection('food');
    const result = await foodCollection.deleteOne({_id: mongoObjectToDelete})
    console.log(result)
    if(result.acknowledged && result.deletedCount == 1){
        res.send({
            'status':200,
            'message': 'Food item deleted successfully'
        });
    } else {
        res.send({
            'status':500,
            'message': 'DELETE OPERATION FAILED'
        });
    }
    
});

app.delete('/deleteAllFood',async(req,res)=>{
    const foodCollection = db.collection('food');
    const result = await foodCollection.deleteMany({})
    if(result.acknowledged){
        res.send({
            'status':200,
            'message': 'All Food item deleted successfully',
            'result':result
        });
    } else {
        res.send({
            'status':500,
            'message': 'MULTIPLE DELETE OPERATION FAILED',
            'result':result
        });
    }
    
});

app.put('/updateFood',async(req,res)=>{

    const mongoObjectToUpdate = mongodb.ObjectId(req.body._id);
    console.error(req.body);
    // What to update with
    const foodCollection = db.collection('food');

    let updatedObject = {
        'name':req.body.name,
    }

    // If new value comes take it ... else please dont give the key itself such that i can keep the old values

    // add if item is [greater than 5 and less than 10]


    if(req.body.cuisine){
        updatedObject = {...updatedObject,'cuisine':req.body.cuisine} 
    }

    if(req.body.cost){
        updatedObject = {...updatedObject,'cost':req.body.cost} 
    } 

    const result = await foodCollection.updateOne(
        {_id: mongoObjectToUpdate},
        {$set: updatedObject
        }
    );
    
    console.log(result)
    if(result.acknowledged && result.modifiedCount == 1){
        res.send({
            'status':200,
            'message': 'Food item modified successfully'
        });
    } else {
        res.send({
            'status':500,
            'message': 'Modification operation failed'
        });
    }
});

// CALL A SERVER AND LISTEN
app.listen(PORT,function(err){
    if(err) console.error(err)
    console.log("Server is running in port",PORT)
});
