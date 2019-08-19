const Express = require('express');
var bodyParser =require('body-parser');

var app = new Express();
app.set('view engine', 'ejs');
app.use(Express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/read',(req,res)=>{
    var details = req.body;
    //console.log(details);
    res.render('read',{details});
});

app.listen(process.env.PORT || 3080,()=>{
    console.log("Server running at http://localhost:3080")
});