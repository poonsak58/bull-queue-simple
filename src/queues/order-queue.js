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
        // NOTE: Highest priority is 1, and lower the larger integer you use.
        priority: getJobPriority(order),
        attempts: 2,
    })
}

const getJobPriority = (order) => {
    if (!order.price) return 3
    return (order > 100) ? 1 : 2
}

module.exports = {
    createNewOrder,
    ordersQueue
}