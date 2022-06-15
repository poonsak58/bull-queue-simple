require('dotenv').config()
const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()
const bodyParser = require('koa-bodyparser')
const { createNewOrder, ordersQueue } = require('./queues/order-queue')

router.get("/health", (ctx) => {
    ctx.body = {
        status: "ok",
        data: "server is working"
    }
})

router.post("/order", async (ctx) => {
    await createNewOrder(ctx.request.body)
    ctx.body = {
        status: "ok",
        data: {
            msg: "Order processed successfully!",
            order: ctx.request.body
        }
    }
})


// Add Bull Dashboard.
const { KoaAdapter } = require('@bull-board/koa')
const serverAdapter = new KoaAdapter()
serverAdapter.setBasePath('/admin')

const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')

createBullBoard({
    queues: [new BullAdapter(ordersQueue)],
    serverAdapter,
})


app.use(bodyParser()).use(router.routes()).use(router.allowedMethods()).use(serverAdapter.registerPlugin())

app.listen(3000, () => console.log('Server up and running! http://127.0.0.1:3000'))