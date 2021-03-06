var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');


var app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 }
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
app.use('/test', testRouter);
app.get('/testSession', function (req, res) {
 
    // set
    req.session.email = 'test@domain.com';
 
    // get
    var temp = req.session.email;
 
 
    res.send("hello" + temp);
 
});

  
 /* // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });



app.get('/form', function(req,res,next){
	res.render('form' , {customerorders: {} });
});


app.post('/form', function(req,res,next){
	con.query('INSERT INTO customerorders SET ?', req.body, function(err,rs){
		res.redirect('/select');
});
		
});

*/ 

app.post('/deleteOrder', function (req, res) {
   
   var id = req.body.id
  
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
  con.query("DELETE FROM customerorders WHERE id="+id+";", function (err, result, fields) {
    if (err) throw err;
    res.send("status updated");

  });
});
  
  
}); 



app.post('/edit', function (req, res) {
   
   var id = req.body.id
  
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
  con.query("UPDATE customerorders SET orderstatus='DELIVERED' WHERE id="+id+";", function (err, result, fields) {
    if (err) throw err;
    res.send("status updated");

  });
});
  
  
}); 



 
app.get('/getDriverData', function (req, res) {
   
  req.session.driver = 1
  
  req.session.email = ''
  
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
  con.query("SELECT id, orderby, orderstatus FROM customerorders;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);

// hold the data that we going to send back.
var output = '';	
	 
	for(var i=0; i< result.length; i++){ 
	    output = output +`
	 
	 
	 <table>
	 <tr>
	 <td>ID</td>
	 <td>Customer name:</td>
	 <td>Order status</td>
	 <td>Options</td>
	 </tr>
	  
	 <tr>
	 <td>`+result[i].id+`</td>
	 <td>`+result[i].orderby+`</td>
	 <td>`+ result[i].orderstatus +`</td>
	 <td>
	 <button onclick="delivered(`+result[i].id+`)">Change for Delivered</button><br>
	 <button onclick="deleteOrder(`+result[i].id+`)">Delete</button><br>	
	 
	 </td>
	 </tr>

	 
	 </table>
	
    `
	    
	
    }
	
	
	
     // return the output variable
    res.send(output);   
  });
});
  
  
}); 
 
	
app.get('/getManagerData', function (req, res) {
   
  req.session.manager = 1
  
  req.session.email = ''
  
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
  con.query("SELECT id, orderby, items FROM customerorders;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
	
	var runningTotal = 0;
	     
    // looping over the records
    for(var i=0; i< result.length; i++){
        output = output +`
	
    <table>
	 <tr>
	 <td>ID</td>
	 <td>Customer name:</td>
	 <td>Order status</td>
	 <td>Options</td>
	 </tr>
	  
	 <tr>
	 <td>`+result[i].id+`</td>
	 <td>`+result[i].orderby+`</td>
	 <td>`+ result[i].items +`</td>
	 <td>
	 
	 
	 
	 <button onclick="deleteOrder(`+result[i].id+`)">Delete</button><br>	
	 
	 </td>
	 </tr>

	 
	 </table>
	
    `

	    
	//calculate the total cost 
	var items = result[i].items;
	
	//breaking into three pieces
	var singleTransaction = items.split(',');
	
	//loop over all the items in a single transaction
	for (var x=0; x<singleTransaction.length; x++){
		console.log(singleTransaction[x]);
		
		var singleProduct = singleTransaction[x].split('-');
		var cost = Number(singleProduct[1])* Number(singleProduct[2]);
		console.log(cost);
		
		//add to running total
		runningTotal = Number(runningTotal) + Number(cost);
		
	}	
		
		console.log('----------------------Next transaction')
    }
	
	output = output + `<h2><span style="background-color:#ba0c52 ;color:white;">Total order cost : ` + runningTotal+ `</span></h2>`;
	
     // return the output variable
    res.send(output);   
  });
});
  
  
});



app.post('/getRangeData', function (req, res) {
   
  //1 , 7 or 30 
  var range= req.body.range;
  
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

var sql="SELECT id, orderby,items FROM customerorders WHERE DATEDIFF(NOW(), `datestamp`) < "+range


console.log("range is" + range);
console.log(sql);


  con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
	
	var runningTotal = 0;
	     
    // looping over the records
    for(var i=0; i< result.length; i++){
        output = output +`
	
    <table>
	 <tr>
	 <td>ID</td>
	 <td>Customer name:</td>
	 <td>Order status</td>
	 <td>Options</td>
	 </tr>
	  
	 <tr>
	 <td>`+result[i].id+`</td>
	 <td>`+result[i].orderby+`</td>
	 <td>`+ result[i].items +`</td>
	 <td>
	 
	 
	 
	 <button onclick="deleteOrder(`+result[i].id+`)">Delete</button><br>	
	 
	 </td>
	 </tr>

	 
	 </table>
	
    `

	    
	//calculate the total cost 
	var items = result[i].items;
	
	//breaking into three pieces
	var singleTransaction = items.split(',');
	
	//loop over all the items in a single transaction
	for (var x=0; x<singleTransaction.length; x++){
		console.log(singleTransaction[x]);
		
		var singleProduct = singleTransaction[x].split('-');
		var cost = Number(singleProduct[1])* Number(singleProduct[2]);
		console.log(cost);
		
		//add to running total
		runningTotal = Number(runningTotal) + Number(cost);
		
	}	
		
		console.log('----------------------Next transaction')
    }
	
	output = output + `<h2><span style="background-color:#ba0c52 ;color:white;">Total order cost : ` + runningTotal+ `</span></h2>`;
	     
        
    res.send(output);
        
    
  });
});
  
  
});

app.post('/checkTheLogin', function (req, res) {
	 
   // catching the variables
  var username = req.body.username;  
  var pass = req.body.password;
  
  
  //setting username into session
   req.session.username = username;
   req.session.validSession = true;
   
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
	
  
  req.session.customer = 1
  
  req.session.email = ''	
      
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
   <br>
   <div class="boxed">
    Price: `+result[i].cost+`$
	</div>
	<div class="content"> 
   <select id="`+result[i].productname+`_qty" name="select-native-2" id="select-native-2" data-mini="true">
        <option value="1">1</option>
		<option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </select>
	
    <p><button id="addtocart" onclick="addToCart('`+result[i].productname+`_qty', `+result[i].cost+`)"> Add To Cart </button></p>
	<p><button id="deleteProduct" onclick="deleteProduct('`+result[i].productname+`_qty')">Delete product </button></p>
    
	</div>
	</div>
	
	
    `;}
        
    res.send(output);
        
    
  });
});
  
  
});

app.post('/putInDatabase', function (req, res) {
  
  // catching the variables
  var username = req.body.username;
  var email = req.body.email;
  var pass = req.body.password;
  
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
app.get('/putInSession', function (req, res) {

      var cart = req.body.cart;
      
      
      req.session.cart = cart;
      
      res.send("all ok");


});

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
  var name = req.body.name;
  var surname=req.body.surname;
  var address = req.body.address;
  var city = req.body.city;
  

  
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
  var sql = "INSERT INTO customerorders (orderby, items, name, surname, address, city ) VALUES ('"+orderby+"', '"+items+"', '"+name+"', '"+surname+"', '"+address+"','"+city+"' );";
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
