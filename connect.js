const http = require('http')

function Connect() {
    // 定义一个用来记录有多少次的请求
    this.middlewares = []
}

Connect.prototype.use = function(middleware) {
    // 记录请求
    this.middlewares.push(middleware)
    // console.log('this.middlewares', this.middlewares)
}

Connect.prototype.listen = function () {
    // 创建一个可以提供http服务的应用
    const server = http.createServer(function(req, res) {
        let index = -1;
        function next() {
            ++index
            let middlewareUse = this.middlewares[index]
            middlewareUse && middlewareUse(req, res, next.bind(this))
        }
        next.call(this)
    }.bind(this))
    // 试用apply + arguments 
    server.listen.apply(server,arguments)
}

const app = new Connect()  

app.use(function(req, res, next) {
   
    res.write('1start')

    next()
    res.write('1end')
    
})

app.use(function(req, res, next) {
    res.write('2start')
    res.end('结束了')
})

// 监听一个指定的端口
app.listen(2080,'127.0.0.1',function() {
    console.log('server is runing 2080');
    
})