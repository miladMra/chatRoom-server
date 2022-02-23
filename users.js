const users =[]
const addUser = ({id,name,room})=>{
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find((user)=>user.name===name && user.room===room)
    if(existingUser){
        return {error:'Username is taken'}
    }
    const user = {id,name,room}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const indexUser = users.findIndex((user)=>user.id===id)
    if(indexUser!==-1){
        return users.splice(indexUser,1)[0]
    }
    return{error:'کاربر موردنظر یافت نشد'}
}

const getUser = (id)=>{
  const userLogged = users.find((user)=>user.id===id)
  return userLogged
}


const getAllUser = (room)=>users.filter(user=>user.room===room)

module.exports = {addUser,removeUser,getUser,getAllUser}