require('dotenv').config()
const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()
const bodyParser = require('koa-bodyparser')
const { createNewOrder } = require('./queues/order-queue')

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

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => console.log('Server up and running!'))