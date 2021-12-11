const express=require('express');
const app=express();
const http=require('http')
;const server=http.createServer(app);
const { Server }=require("socket.io");
const io=new Server(server);
/*const winston=require('winston');
const expressWinston=require('express-winston');*/
const port=5000; 
const session=require('express-session');
const passport=require('passport');
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('styles'));
app.use(express.static('images'));
app.use(express.static('commerce-photos'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use(express.static(__dirname+'/node_modules/validator'));

const index=require('./routes/index.js');
const admin=require('./routes/admin.js');
const customer=require('./routes/customer.js');

app.use('/', index);
app.use('/admin', admin);
app.use('/customer', customer);

io.on('connection', socket => {  
  console.log('a user connected');
  socket.on('disconnect', () => {    
    console.log('user disconnected');  
  });
  socket.on('new purchase', data => {
  	data.verificationStatus='Pendiente';
  	data.deliveryStatus=false;
    io.emit('new purchase', data);
  });
});

server.listen(port, () => {  
  console.log('Servidor iniciado');
});
