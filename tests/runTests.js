var fs = require("fs");
var easyimg = require("easyimage");
var baseurl = "http://localhost:9999";

module.exports = {
	"test elementHasChildren": function(browser) {
		return browser
			.url(baseurl+"/children")
			.assert.elementHasChildren(".myclass")
			.assert.elementHasChildren(".myclass", "li")
			.end();
	},

	"test elementHasNoChildren": function(browser) {
		return browser
			.url(baseurl+"/nochildren")
			.assert.elementHasNoChildren(".myclass")
			.assert.elementHasNoChildren(".text")
			.end();
	},

	"test saveElementScreenshot": function(browser) {
		var imageFileName = "test.png";

		return browser
			.url(baseurl+"/saveElementScreenshot")
			.saveElementScreenshot(".jumbotron", imageFileName)
			.perform(function(client, done) {
				easyimg.info(imageFileName).then(function(imageInfo) {
					client.assert.equal(imageInfo.height == 235, true, "saveElementScreenshot works");
					fs.unlinkSync(imageFileName);
					done();
				});
			})
			.end();
	},

	"test waitForJqueryElement": function(browser) {
		browser.globals.waitForConditionTimeout = 5000;
		
		return browser
			.url(baseurl+"/waitForJqueryElement")
			.waitForJqueryElement(".myclass:eq(2) > #div:visible", function() {
				client.assert.equal(true, true, "waitForJqueryElement works");
			})
			.end();
	},

	"test waitForAttribute": function(browser) {
		browser.globals.waitForConditionTimeout = 5000;
		
		return browser
			.url(baseurl+"/waitForAttribute")
			.waitForAttribute("#div", "class", function (divclass) {
				return divclass === "myclass";
			})
			.end();
	},

	"test waitForText": function(browser) {
		browser.globals.waitForConditionTimeout = 5000;
		
		return browser
			.url(baseurl+"/waitForText")
			.waitForText("#div", function (text) {
				return text === "something else";
			})
			.end();
	},

	"test waitForTitle": function(browser) {
		browser.globals.waitForConditionTimeout = 5000;
		
		return browser
			.url(baseurl+"/waitForTitle")
			.waitForTitle(function(title) {
				return title === "something else";
			})
			.end();
	},

	"test urlMatch": function(browser) {
		return browser
			.url(baseurl+"/urlMatch")
			.assert.urlMatch(/tch$/)
			.assert.urlMatch(/\/[a-zA-z]+$/)
			.end();
	},

	"test jqueryElementPresent": function(browser) {
		return browser
			.url(baseurl+"/jqueryElementPresent")
			.assert.jqueryElementPresent(".myclass:has(button)")
			.end();
	},

	"test jqueryElementNotPresent": function(browser) {
		return browser
			.url(baseurl+"/jqueryElementPresent")
			.assert.jqueryElementNotPresent(".noclass")
			.end();
	},

	"test jqueryClick": function(browser) {
		return browser
			.url(baseurl+"/jqueryClick")
			.jqueryClick("div:eq(2) button")
			.assert.visible("#div")
			.jqueryClick("a")
			.pause(1000)
			.assert.urlMatch(/github/)
			.end();
	},

	"test jqueryElement": function(browser) {
		return browser
			.url(baseurl+"/jqueryElement")
			.jqueryElement(".myclass:has(button)", function(element) {
				this.assert.equal(!!element, true, "jqueryElement: element found");
			})
			.jqueryElement(".nonexistingclass:eq(10)", function(element) {
				this.assert.equal(!element, true, "jqueryElement: element not found");
			})
			.end();
	},

	"test setSelect2Data": function(browser) {
		return browser
			.url(baseurl+"/setSelect2Data")
			.setSelect2Data("#select2", {id:1, text:"ciao"})
			.assert.value("input[name=select2]", "1")
			.end();
	},

	"test setSelect2Value": function(browser) {
		return browser
			.url(baseurl+"/setSelect2Value")
			.setSelect2Value("#select2", "1")
			.assert.value("input[name=select2]", "1")
			.end();
	},

	"test setValueAndTrigger": function(browser) {
		return browser
			.url(baseurl+"/setValueAndTrigger")
			.setValueAndTrigger("#textinput", "1")
			.pause(200)
			.assert.visible("#div")
			.end();
	},
	
	"Single View Compare": function(browser) {
	        var imageFile = "bs-docs-masthead.png";
	        var path = "./test/bootstrap";
	        var element = ".bs-docs-masthead";
	
	        return browser
	            .url('http://getbootstrap.com/')
	            .waitForElementVisible('body', 1000)
	            .verify.jqueryElementPresent(element)
	            .resizeWindow(1024, 600)
	            .pause(1000)
	            .saveElementScreenshot(element, path+'/results/'+imageFile)
	            .verify.compareScreenshot(imageFile, path)
	            .end();
    	},
    	
    	"Multiple View Compare": function(browser) {
	        var imageFileName = "bs-docs-masthead_";
	        var imageFileExt = ".png";
	        var path = "./test/bootstrap_multiple";
	        var element = ".bs-docs-masthead";
	
	        var env = [
	            {device: "tablet_landscape", width: "1024", height: "768"},
	            {device: "tablet_portrait", width: "768", height: "1024"},
	            {device: "phone", width: "320", height: "480"}
	        ];
	
	        browser
	            .url('http://getbootstrap.com/')
	            .waitForElementVisible('body', 1000)
	            .verify.jqueryElementPresent(element);
	
	        for (var k in env){
	            browser.resizeWindow(env[k].width, env[k].height)
	                .pause(1000)
	                .saveElementScreenshot(element, path+'/results/'+imageFileName+env[k].device+imageFileExt )
	                .verify.compareScreenshot(imageFileName+env[k].device+imageFileExt, path);
	        }
	        browser.end();
	    }
};
