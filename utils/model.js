const fs = require('fs')
const path = require('path')



function read(filename){
    let data = fs.readFileSync((path.resolve('database',filename+'.json')))
    return JSON.parse(data)

}

function write(filename,data){
     fs.writeFileSync(path.resolve('database',filename+'.json'),JSON.stringify(data,null,4))
    return true

}

module.exports ={
    read,
    write
}