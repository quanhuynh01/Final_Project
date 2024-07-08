const initializeFacebookSDK = () => {
    return new Promise((resolve) => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '3543426225949548', // Thay YOUR_APP_ID bằng App ID của bạn
                cookie: true,
                xfbml: true,
                version: 'v12.0' // Đảm bảo rằng phiên bản là hợp lệ
            });
            window.FB.AppEvents.logPageView();
            resolve(window.FB);
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
};

export default initializeFacebookSDK;
