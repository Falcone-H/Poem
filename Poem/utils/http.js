import {config} from '../config.js'

class http {
  constructor(){
    
  }
  request(params){
    if(!params.method){
      params.method = 'GET'
    }
    wx.request({
      url: config.baseUrl+ params.url,
      data:params.data,
      header:{
        'appkey':config.appkey,
        'content-type':'application/json'
      },
      method:params.method,
      success:(res)=>{
        let statusCode = res.statusCode.toString();
        if(statusCode.startsWith('2')){
          params.success && params.success(res.data)
        }else{
          
        }
      },
      fail:(err)=>{
        
      }
    })  
  }
}

export {http}