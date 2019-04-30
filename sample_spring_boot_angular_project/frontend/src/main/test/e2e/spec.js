describe('userDashboardCchromeontroller', function () {

    var loginUrl = browser.baseUrl + '/login/';
    browser.get(loginUrl);
    browser.driver.findElement(by.id('email')).sendKeys('fnx@ukr.net');
    browser.driver.findElement(by.id('password')).sendKeys('123123');
    browser.driver.findElement(by.css('.log-in-btn')).click();
    browser.sleep(1000);


    browser.getCurrentUrl().then(function (url) {
        if(url === loginUrl){
            console.error('You did not login');
            console.error('read protractor documentation please');
        }
    })



});