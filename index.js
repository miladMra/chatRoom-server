const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const routers = require('./router')
const app = express()
const {addUser,removeUser,getUser,getAllUser} = require('./users')
const port = process.env.APP_PORT || 5000
const server = http.createServer(app)
const io = socketio(server,{
    cors: {
      origin: '*',
    }
  })
io.on('connection',(socket)=>{
    console.log('We have a new connection')
    socket.on('join',({name,room},callback)=>{
 
     const {error,user}= addUser({id:socket.id,name,room})
     if(error) return callback(error)
     socket.emit('message',{user:'admin',text:`${user.name} welcome to the room ${user.room}`})
     socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} has join`})
     socket.join(user.room)
     io.to(user.room).emit('roomData',{room:user.room,users:getAllUser(user.room)})
     callback()
        // const error = true
        // if(error){
        //   callback({error:'error'})
        // }
    })
    socket.on('sendMessage',(message,callback)=>{
      const user = getUser(socket.id)
      io.to(user.room).emit('message',{user:user.name,text:message})
      io.to(user.room).emit('roomData',{room:user.room,users:getAllUser(user.room)})
      callback()
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
          io.to(user.room).emit('message',{user:'admin' , text:`${user.name} has left!!`})
        }
    })
})
app.use(routers)
server.listen(port,()=>{console.log(`server has start on port ${port}`)})