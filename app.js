var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge:50000 }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/getDriverData', function (req, res) {
	
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });

  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT orderby, orderstatus FROM customerorders;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
 
 // hold the data that we going to send back.
var outp = ''; 

  // looping over the records
 for(var i=0; i< result.length; i++){
	 outp=outp+`

<tr> 
   <td>"`+result[i].orderby+`"</td>
   <td>"`+result[i].orderstatus+`"</td>  
   <td>empty</td>  	
</tr>
</div>
	
	`;
    }
    
     // return the output variable
    res.send(outp);   
  });
});

});
	
	
app.get('/getManagerData', function (req, res) {
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
   
   
// hold the data that we going to send back.
var output = '';


  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT orderby, items, pictures FROM customerorders;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
   
    
    // looping over the records
    for(var i=0; i< result.length; i++){
        output = output +`
		
	<div class="column">
    <div class="container">
	 <img src="`+result[i].pictures+`">
    <div class="bottom-left">`+result[i].orderby+`</div>
   </div>
	<div class="content"> 
 
	<p><textarea name="message" rows="3" cols="20">`+ result[i].items +`</textarea></p>
    
	</div>
	</div>
	
	
    `}
	    
    
     // return the output variable
    res.send(output);   
  });
});
  
  
});

app.post('/checkTheLogin', function (req, res) {
	 
   // catching the variables
  var username = req.body.username;  
  var pass = req.body.password;
  
   req.session.username=username;
   req.session.validSession=true;
   
   var sessionTime = req.session.cookie.maxAge /1000;
   console.log("Time left" + sessionTime);
   
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
  
  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM users WHERE username = '"+username+"' AND PASSWORD = '"+pass+"' LIMIT 1;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    // return the account type back
    res.send(result[0].acctype);
    
  });
});
 
  
});

/*app.get('/getImage', function (req, res) {
   

  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
  
  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT picture FROM products WHERE id = 15", function (err, result, fields) {
    if (err) throw err;
   
    res.send(result[0].picture);   
    
    
  });
});
   
  
});
*/

app.get('/getProducts', function (req, res) {
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
    con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * from products", function (err, result, fields) {
    if (err) throw err;
   
    
    var output = '';
    for(var i=0; i < result.length; i++){
        

       output = output + `
       
      	 

    <div class="column">
    <div class="container">
	 <img src="`+result[i].picturepath+`">
    <div class="bottom-left">`+result[i].productname+`</div>
   </div>
	<div class="content"> 
   <select id="`+result[i].productname+`" name="select-native-2" id="select-native-2" data-mini="true">
        <option value=""></option>
		<option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
    </select></h1>
    <p><button id="addtocart" onclick="addToCart('`+result[i].productname+` `+result[i].qty+`')"> Add To Cart </button></p>
	<p><button id="deleteProduct" onclick="deleteProduct('`+result[i].productname+` `+result[i].qty+`')">Delete product </button></p>
    
	</div>
	</div>
	
	
    `}
        
    res.send(output);
        
    
  });
});
  
  
});





app.post('/putInSession', function (req, res) {

      var cart = req.body.cart;
      
      
      req.session.cart = cart;
      
      res.send("all ok");


});


app.post('/putInDatabase', function (req, res) {
  
  // catching the variables
  var username = req.body.username;
  var email = req.body.email;
  var pass = req.body.password;
  var acctype = req.body.acctype;
  
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');

  
 // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO users (username, email, password, acctype) VALUES ('"+username+"', '"+email+"', '"+pass+"', 'customer');";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
  res.send('Data went to the database');
  
  
})

app.get('/checkIfTimeLeft', function (req, res) {  
  var sessionTime = req.session.cookie.maxAge /1000;
   console.log(sessionTime);
  if(sessionTime < 10) {
	res.send('Time expired');  
	  
  } else {
	  
	 res.send('ok'); 
  }
  	
});


app.post('/completeCheckout', function (req, res) {
	

  // catching the variables
  var orderby = req.body.orderby;
  var items = req.body.items;
  

  
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');

  
 // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO customerorders (orderby, items) VALUES ('"+orderby+"', '"+items+"');";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
  res.send('Data went to the database');
  
  
})










// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
