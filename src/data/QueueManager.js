export default class QueueManager {
    constructor(socket) {
        this.socket = socket
    }
    joinQueue(privacy, gameId) {
        this.socket.send(JSON.stringify({ type: "join_queue", queue: privacy, gameId }))
    }
    leaveQueue() {
        this.socket.send(JSON.stringify({ type: "leave_queue" }))
    }
}