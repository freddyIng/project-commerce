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
app.use(express.static('node_modules/react/umd'));
app.use(express.static('node_modules/react-dom/umd'));
app.use(express.static('src'));

const index=require('./routes/index.js');
const admin=require('./routes/admin.js');
const customer=require('./routes/customer.js');

app.use('/', index);
app.use('/admin', admin);
app.use('/customer', customer);

let customersOnline=new Map(), customersOnlineInverse=new Map();

io.on('connection', socket => {
  socket.on('set online customer', data=>{
    customersOnline.set(data.dni, socket.id);
    customersOnlineInverse.set(socket.id, data.dni);
  });
  socket.on('disconnect', () => {
    let dni=customersOnlineInverse.get(socket.id);
    customersOnline.delete(dni);
    customersOnlineInverse.delete(socket.id);     
  });
  socket.on('new purchase', data => {
  	data.verificationStatus='Pendiente';
  	data.deliveryStatus=false;
    io.emit('new purchase', data);
  });
  socket.on('change status purchase', data=>{
  	if (customersOnline.has(data.dni)){
  	  io.to(customersOnline.get(data.dni)).emit('change status purchase', data);
  	}
  });
});

server.listen(port, () => {  
  console.log('Servidor iniciado');
});
