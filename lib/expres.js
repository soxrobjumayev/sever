const { rejects } = require("assert")
const { resolve } = require("path")
const url = require('url')
const querystring = require('querystring')

class Express{
    constructor(req,res){
        this.req = req,
        this.res = res
        
       if(this.req.method != 'GET'){
        this.req.body = new Promise((resolve,reject)=>{
           
            let str = ''
            req.on('data',(chunk) => (str += chunk));
            req.on('end',() => {
                
                resolve(JSON.parse(str))
            });

    })
       }

        
    }

    get(route,callback){
        
    let {pathname,query}= url.parse(this.req.url);
    this.req.query = querystring.parse(query) 
        if(pathname == route && this.req.method == "GET"){
            callback(this.req,this.res)
        }
    }

    post(route,callback){
        if(this.req.url == route && this.req.method == "POST"){
            callback(this.req,this.res)
        }
    }
}

module.exports= Express