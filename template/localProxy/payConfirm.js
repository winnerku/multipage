module.exports = {
    '/order/payChannels': {
        target: 'http://localhost:8181/',
        changeOrigin: true,
        pathRewrite: {
            '^/order/payChannels': '/data/pay_confirm/payChannels.json'
        }
    },
    '/order/payAmount': {
        target: 'http://localhost:8181/',
        changeOrigin: true,
        pathRewrite: {
            '^/order/payAmount': '/data/pay_confirm/payAmount.json'
        }
    },
    '/order/pay': {
        target: 'http://localhost:8181/',
        changeOrigin: true,
        pathRewrite: {
            '^/order/pay': '/data/pay_confirm/pay.json'
        }
    },
    '/order/quickConfirm': {
        target: 'http://localhost:8181/',
        changeOrigin: true,
        pathRewrite: {
            '^/order/quickConfirm': '/data/pay_confirm/quickConfirm.json'
        }
    },
    '/order/payStatus': {
        target: 'http://localhost:8181/',
        changeOrigin: true,
        pathRewrite: {
            '^/order/payStatus': '/data/pay_confirm/payStatus.json'
        }
    }
}