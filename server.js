
const express=require('express');
const app=express();
/*const winston=require('winston');
const expressWinston=require('express-winston');*/
const port=5000; 
const session=require('express-session');
const passport=require('passport');
app.use(session({ secret: "secret", resave: false, saveUninitialized: true })); 
/*This approach doesn work
app.use('/admin', session({ secret: "123456", resave: false, saveUninitialized: true, name: 'admin-id'}));
app.use('/customer', session({ secret: "ererefeg", resave: false, saveUninitialized: true , name: 'customer-id'}));*/
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static('styles'));
app.use(express.static('images'));
app.use(express.static('commerce-photos'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

const index=require('./routes/index.js');
const signin=require('./routes/signin.js');
const admin=require('./routes/admin.js');
const customer=require('./routes/customer.js');

app.use('/', index);
app.use('/signin', signin);
app.use('/admin', admin);
app.use('/customer', customer);

app.listen(port, (req, res)=>{
  console.log('Sevidor iniciado');
});