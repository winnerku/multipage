module.exports = {
    '/address/getAddress':{
        target:'http://localhost:8181/',
        changeOrigin:true,
        pathRewrite:{
            '^/address/getAddress':'/data/edite_address/getAddress.json'
        }
    },
    '/address/getThreeLayerBaseAddress':{
        target:'http://localhost:8181/',
        changeOrigin:true,
        pathRewrite:{
            '^/address/getThreeLayerBaseAddress':'/data/edite_address/getThreeLayerBaseAddress.json'
        }
    }
}