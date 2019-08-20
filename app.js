const Express = require('express');
var bodyParser =require('body-parser');
const Mongoose=require('mongoose');   //db connection working with mongodb: 1. mdb
var Request = require('request');     //11. mdb include request module

var app = new Express();
app.set('view engine', 'ejs');

app.use(Express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true})); // parse data from sunmission form <form></form>  in page

//Mongoose.connect("mongodb://localhost:27017/collegedb"); //connect the db   2. mdb
Mongoose.connect('mongodb+srv://jossin:jossin@cluster0-arjkd.mongodb.net/test?retryWrites=true&w=majority');
//create a model (MVC), arguemnts: collection name, schema, 

const StudentModel = Mongoose.model("studentdetails",         // 3.mdb define the student model (including the schema) (the model in MVC)
{uname:String,
urollno:String,
uadmno:String, 
ucollege:String});

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/index',(req,res)=>{
    res.render('index');
});

app.post('/read',(req,res)=>{                       // 4. mdb adding astudent action called as 'read' (as defined in <form></form> in index page                                                                submission forum) ACTION: inserting & saving data in database
    var details = req.body;
    //console.log(details);
    //res.send({details});
    //res.render('read',{details});
    var student = new StudentModel(details);        // 5.mdb- define the instance of model created
    var result=student.save((error, data)=>{         // 6.mdb save the data, handle error, display a message
        if(error){
            throw error;
            res.send('error');
        }else{
            res.send('user created' + data);
        }
        });
});

app.get('/getStudentData',(req,res)=>{ //7. mdb this is an API to retieve data from database, this can be tested at postman http://localhost:3080/getStudentData, should return 'data',  can also be tested in browser
    var display = StudentModel.find((error, data)=>{  // 8.mdb database.find() call
        if (error){
            throw error;
        }else{
            res.send(data);
        }
    });
});

const getDataApi = "http://localhost:3080/getStudentData"; //9. mdb  this is the api link, accessing the api

app.get('/viewstudents',(req,res)=>{                        //10. mdb using the api
    // need an npm module 'request' to call the api url=> npm install request --save
    Request(getDataApi, (error, response, body)=>{          //12.mdb API link, other stuff
        if(error){
            throw error;
        }else{
            var data = JSON.parse(body);                     //13.mdb parse body, render required view, send data; further processing at view page.
            res.render('viewstudents',{'data':data});
        }
    });
});

app.get('/searchstudent',(req,res)=>{
    res.render('searchstudent');
});

// Define an API to retrieve info of a single student from admno
app.get('/getAstudentAPI/:admno',(req, res)=>{
    var admnNo = req.params.admno; //could equally use var admnNo=req.query.admno; but this cahnges teh Request(apicall), see the UIview function using the API
    StudentModel.find({uadmno:admnNo}, (error, data)=>{
        if(error){
            throw error;
        }else{
            res.send(data);
        }
    });
});

//create the apilink
const callSingleStudentAPI = "http://localhost:3080/getAstudentAPI";

//define a UIView for searching student- route it
app.post('/searchSingle',(req,res)=>{
    var item = req.body.uniqadmn
    Request(callSingleStudentAPI+"/"+ item, (error,response,body)=>{ //Request(callSingleStudentAPI+"/?uniqadmn="+ item, (error,response,body)=>{ //if req.query is used in API definition 
        if(error){
            throw error;
        }else{
            var data = JSON.parse(body);     
            //console.log(data);            
            //res.send(data);
            res.render('viewsinglestudent',{'data':data});
            
        }
    });
});




app.listen(process.env.PORT || 3080,()=>{
    console.log("Server running at http://localhost:3080")
});