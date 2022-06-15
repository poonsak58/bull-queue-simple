const Queue = require('bull')
const { ordersProcess } = require('./orders-queue-consumer')

const {
    REDIS_URL,
    REDIS_PORT,
    REDIS_PASSWORD,
    REDIS_DB,
} = process.env

// Our job queue
const ordersQueue = new Queue('orders', {
    redis: {
        port: REDIS_PORT, host: REDIS_URL, password: REDIS_PASSWORD, db: Number(REDIS_DB) || 0
    }
})

ordersQueue.process(ordersProcess)

const createNewOrder = (order) => {
    ordersQueue.add(order, {
        // leave empty opts for now
    })
}

module.exports = {
    createNewOrder
}