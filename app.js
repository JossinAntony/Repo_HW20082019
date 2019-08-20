const Express = require('express');
var bodyParser =require('body-parser');
const Mongoose=require('mongoose');   //db connection
var Request = require('request');

var app = new Express();
app.set('view engine', 'ejs');

app.use(Express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true})); // parse data from sunmission form <form></form>  in page

Mongoose.connect("mongodb://localhost:27017/collegedb"); //connect the db
//create a model (MVC), arguemnts: collection name, schema, 

const StudentModel = Mongoose.model("studentdetails",
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

app.post('/read',(req,res)=>{
    var details = req.body;
    //console.log(details);
    //res.send({details});
    //res.render('read',{details});
    var student = new StudentModel(details);
    var result=student.save((error, data)=>{
        if(error){
            throw error;
            res.send('error');
        }else{
            res.send('user created' + data);
        }
        });
});

app.get('/getStudentData',(req,res)=>{ // this is an API, this can bve tested at postman http://localhost:3080/getStudentData, should returndata
    var display = StudentModel.find((error, data)=>{
        if (error){
            throw error;
        }else{
            res.send(data);
        }
    });
});

const getDataApi = "http://localhost:3080/getStudentData"; // this is the api link

app.get('/viewstudents',(req,res)=>{
    // need an npm module 'request' to call the api url=> npm install request --save
    Request(getDataApi, (error, response, body)=>{
        if(error){
            throw error;
        }else{
            var data = JSON.parse(body);
            res.render('viewstudents',{'data':data});
        }
    });
});

app.listen(process.env.PORT || 3080,()=>{
    console.log("Server running at http://localhost:3080")
});