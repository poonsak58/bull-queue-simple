const ordersProcess = async (job, done) => {
    console.log(job.data)
    job.progress(100) // report progress 1%-100%

    done() // call done when finished

    // done(null, { transactionHash: '0x9kj4jfj9f94kkkdwerwer' }) // or pass value a result
    // done(new Error('error transcoding'));
}

module.exports = {
    ordersProcess
}