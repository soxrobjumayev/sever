
const http = require('http')
const crypto = require('crypto')
const fs = require('fs')

const path = require('path')
const { read,write } = require('./utils/model.js')
const Express = require('./lib/expres')




function httpServer(req, res) {
    const app = new Express(req, res)


    app.get('/yangilik', (req, res) => {
        let {age,title} =req.query
        let yangilikla = read('yangilik').filter(yangilik => delete yangilik.userkod)
       let filterage= yangilikla.filter(yangilik => yangilik.age == age)
    //    let filterat= yangilikla.filter(yangilik => yangilik.title == title)

     
      

       if(filterage.length){
       return res.end(JSON.stringify(filterage))

       }
    
        res.end(JSON.stringify(yangilikla))
    })

    app.post('/qoshish', (req, res) => {
        let str = ''
        req.on('data', chunk => str += chunk)
        req.on('end', () => {
            let yangilikla = read('yangilik')
            let { title, body, userkod,age } = JSON.parse(str)

            try {
                if (!(title.trim() && title.length > 3)) {
                    throw new Error('xato')
                }

                if (!(userkod.trim() && userkod.length > 4)) {
                    throw new Error('xato')

                }
                userkod = crypto.createHash('sha256').update(userkod).digest('hex')
            let newyengilik = { newId:yangilikla.at(-1)?.newId+1 || 1, title, body, userkod ,age}
            yangilikla.push(newyengilik)



            write('yangilik', yangilikla)
            delete newyengilik.userkod
            res.writeHead(201, { 'Content-Type': 'application/json'})
            res.end(JSON.stringify({status:201,message:'ok',data:newyengilik}))
        } catch (error) {
            console.log(error);
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ status: 400, message: error.message }))

            }

        });
    })

    app.post('/signin', async(req,res)=>{
        let {title,userkod} = await req.body
        let users = read('yangilik')
      try{
        userkod = crypto.createHash('sha256').update(userkod).digest('hex')
        let user =users.find(user => user.title == title && user.userkod ==  userkod)
        if(!user){
            throw new Error('xato')
        }
        res.writeHead(200, { 'Content-Type': 'application/json'})
        res.end(JSON.stringify({status:200,message:'ok'}))
      }catch(error){
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 400, message: error.message }))
      }
    })

}


const server = http.createServer(httpServer)
server.listen(5000, () => console.log('servddr ok'))
