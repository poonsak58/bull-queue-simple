require('dotenv').config()
const express = require('express');

const app = express();
const { createNewOrder, ordersQueue } = require('./queues/order-queue')

app.use(express.json())

// Add Bull Dashboard.
const { ExpressAdapter } = require('@bull-board/express');
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin')

const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')

createBullBoard({
    queues: [new BullAdapter(ordersQueue)],
    serverAdapter,
})

app.use('/admin', serverAdapter.getRouter())

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        data: "server is working"
    })
})

app.post("/order", async (req, res) => {
    await createNewOrder(req.body)

    res.json({
        status: "ok",
        data: {
            msg: "Order processed successfully!",
            order: req.body
        }
    })
})

app.listen(3000, () => console.log('Server up and running! http://127.0.0.1:3000'))