const rooms = [];

const getRooms = () => {
  return rooms;
}

const addRoom = (room) => {
  rooms.push(room)
  return room;
}

module.exports = {
  getRooms,
  addRoom
}