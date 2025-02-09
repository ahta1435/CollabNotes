const sessionIdToUserMap = new Map();

function getUser(sessionId) {
    return sessionIdToUserMap.get(sessionId);
}

function setUser(user,sessionId) {
   sessionIdToUserMap.set(sessionId,user);
}

module.exports = {
    setUser,
    getUser
}