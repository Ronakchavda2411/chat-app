const notFound = (req,res,next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err,req,res,next) => {
    const statsCode = res.statusCode === 200 ? 500 : res?.statusCode
    res.status(statsCode)
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV === "production" ? null : err.stack
    })
    
}
module.exports = {notFound,errorHandler}