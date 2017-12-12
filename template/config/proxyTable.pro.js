module.exports = {
    '/discount':{
        target:'http://172.17.2.148:8181/',
        changeOrigin:true,
        pathRewrite:{
            '^/discount':'/discount'//如果是接口多出来的一层目录，则设为空字符串，如：/liuyong/discount/getIndex
        }
    }
}