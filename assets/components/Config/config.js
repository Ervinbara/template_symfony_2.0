// src/config/config.js

const dev = {
    STRIPE_PUBLIC_KEY: "pk_test_51PhTvTKuzPUvarsT4RFUKX7BKF1IBavWFROrhpi1zo0jpXafWwSwV4oFYfdWpz8ckvMvH19i2ULzSgmY717bths700WxYSSvQU"
};

const prod = {
    STRIPE_PUBLIC_KEY: "pk_live_YOUR_PRODUCTION_KEY"
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default config;
