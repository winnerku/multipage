module.exports = {
	'/coupon/aviCouponNum':{
        target:'http://localhost:8181/',
        changeOrigin:true,
        pathRewrite:{
            '^/coupon/aviCouponNum':'/data/coupon/aviCouponNum.json'

        }
    },
    '/coupon/schedule':{
        target:'http://localhost:8181/',
        changeOrigin:true,
        pathRewrite:{
            '^/coupon/schedule':'/data/coupon/schedule.json'

        }
    },
    '/coupon/userClaimCoupon':{
        target:'http://localhost:8181/',
        changeOrigin:true,
        pathRewrite:{
            '^/coupon/userClaimCoupon':'/data/coupon/userClaimCoupon.json'

        }
    },
    '/coupon/userCouponStatus':{
        target:'http://localhost:8181/',
        changeOrigin:true,
        pathRewrite:{
            '^/coupon/userCouponStatus':'/data/coupon/userCouponStatus.json'

        }
    },
    '/coupon/info':{
        target:'http://localhost:8181/',
        changeOrigin:true,
        pathRewrite:{
            '^/coupon/info':'/data/coupon/info.json'

        }
    }
}