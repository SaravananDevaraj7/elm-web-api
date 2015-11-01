var expect = require('chai').expect;

module.exports = function (browser) {
    describe("The Window example", function () {
        beforeEach(function (done) {
            browser.url('http://localhost:8080/window.html', done);
        });

        // Don't test alerts etc. under Safari, because Selenium can't
        // manage alerts with Safari.
        var describeAlert = 
            (browser.desiredCapabilities.browserName == 'safari')
                ? describe.skip
                : describe;
                        
        describeAlert("alert", function () {
            it("should open", function () {
                return browser
                    .click("#alert-button")
                    .pause(10)
                    .alertText().then(function (text) {
                        expect(text).to.equal("Hello world!");
                    }).alertAccept();
            });
        });
            
        describeAlert("confirm", function () {
            it("should recognize acceptance", function () {
                return browser
                    .click("#confirm-button")
                    .pause(10)
                    .alertText().then(function (text) {
                        expect(text).to.equal("Do you agree?");
                    }).alertAccept()
                    .waitUntil(function () {
                        return this.getText("#message").then(function (text) {
                            return text.indexOf("Pressed OK") >= 0;
                        });
                    }, 1000, 100);
            });

            it("should recognize rejection", function () {
                return browser
                    .click("#confirm-button")
                    .pause(10)
                    .alertText().then(function (text) {
                        expect(text).to.equal("Do you agree?");
                    }).alertDismiss()
                    .waitUntil(function () {
                        return this.getText("#message").then(function (text) {
                            return text.indexOf("Pressed cancel") >= 0;
                        });
                    }, 1000, 100);
            });
        });

        describeAlert("prompt", function () {
            it("should recognize dismissal", function () {
                return browser
                    .click("#prompt-button")
                    .pause(10)
                    .alertText().then(function (text) {
                        expect(text).to.equal("What is your favourite colour?");
                    }).alertDismiss()
                    .waitUntil(function () {
                        return this.getText("#message").then(function (text) {
                            return text.indexOf("User canceled.") >= 0;
                        });
                    }, 1000, 100);
            });
            
            it("should return default when accepted", function () {
                return browser
                    .click("#prompt-button")
                    .pause(10)
                    .alertText().then(function (text) {
                        expect(text).to.equal("What is your favourite colour?");
                    }).alertAccept()
                    .waitUntil(function () {
                        return this.getText("#message").then(function (text) {
                            return text.indexOf("Got response: Blue") >= 0;
                        });
                    }, 1000, 100);
            });
            
            it("should interpret empty string as dismissal", function () {
                return browser
                    .click("#prompt-button")
                    .pause(10)
                    .alertText("")
                    .alertAccept()
                    .waitUntil(function () {
                        return this.getText("#message").then(function (text) {
                            return text.indexOf("User canceled.") >= 0;
                        });
                    }, 1000, 100);
            });
            
            it("should return entered text if entered", function () {
                return browser
                    .click("#prompt-button")
                    .pause(10)
                    .alertText("Red")
                    .alertAccept()
                    .waitUntil(function () {
                        return this.getText("#message").then(function (text) {
                            return text.indexOf("Got response: Red") >= 0;
                        });
                    }, 1000, 100);
            });
        });
    });
};