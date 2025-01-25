import { createServer } from 'node:http';
import express from 'express';
import { Server as SocketServer } from 'socket.io';

const app = express(); // <-- Création de l'application express
const server = createServer(app); // <-- Création du serveur HTTP    
const io = new SocketServer(server); // <-- Création du serveur de socket

// On définie un middleware pour gérer les fichiers statics
app.use(express.static('public')); 

// On définie des routes
app.get('/', (_, res) => { 
	res.redirect('/index.html'); // <-- Redirection vers la page index.html
});

// On démarre le serveur sur le port 3000
server.listen(3000, () => {
	console.log('Server started on port 3000');
});

////////////// WebSocket //////////////

io.on('connection', (socket) => { // <-- Quand un client se CONNECTE   
	console.log('ICI', socket.id);
    
    socket.on('user_message_send', () =>{
		console.log()
	})
	io.emit("system_message",{
		content: `Quelqu'un arrive voici son id ${socket.id}`
	})
		socket.on("user_message_send",({content})=>{
			for(const[id,sock]of io.sockets.sockets){
			sock.emit("user_message",({
				author: socket.id,
				content: content,
				time: new Date().toLocaleTimeString(),
				isMe: id === socket.id
			}))
		}
	})
	const typingUsers = new Set();
	socket.on('typing_start',()=>{
		typingUsers.add(socket.id)
		io.emit("typing",Array.from(typingUsers)))
		socket.on('typing_stop',()=>{
			io.emit("typing",([
			]))
		})
	})
	socket.on('disconnect', ({content}) => { // <-- Quand un client se DECONNECTE
		io.emit('system_message',({
			content: `Quelqu'un part voici son id ${socket.id}`
		}))
		console.log('Disconnected', socket.id);
	});
});