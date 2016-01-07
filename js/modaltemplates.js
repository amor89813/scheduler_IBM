(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['demoModal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n		<div data-field-name=\""
    + escapeExpression(((stack1 = (depth0 && depth0.fieldName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\r\n			 ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isRequired), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			 ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.validationType)),stack1 == null || stack1 === false ? stack1 : stack1.isNumber), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			 ";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.validationType)),stack1 == null || stack1 === false ? stack1 : stack1.regex)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			 >\r\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isVisible), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			    ";
  stack1 = (helper = helpers.inputForType || (depth0 && depth0.inputForType),options={hash:{},data:data},helper ? helper.call(depth0, depth0, options) : helperMissing.call(depth0, "inputForType", depth0, options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n                \r\n			<span class=\"error\" style=\"display: none\">"
    + escapeExpression(((stack1 = (depth0 && depth0.validationMessage)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n		</div>\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return " \r\n		 		data-validate-required=\"true\" \r\n			 ";
  }

function program4(depth0,data) {
  
  
  return "\r\n		 		data-validate-number=\"true\" \r\n			 ";
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n		 		data-validate-regex=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.validationType)),stack1 == null || stack1 === false ? stack1 : stack1.regex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\r\n			 ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n				<label\r\n				";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.fieldStyle)),stack1 == null || stack1 === false ? stack1 : stack1.labelFontSize), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n				    "
    + escapeExpression(((stack1 = (depth0 && depth0.fieldFriendlyName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n				    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isRequired), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n                </label>\r\n			";
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n				style=\"font-size:"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fieldStyle)),stack1 == null || stack1 === false ? stack1 : stack1.labelFontSize)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "px;\"\r\n				";
  return buffer;
  }

function program11(depth0,data) {
  
  
  return "*";
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n		<a class=\"notUser\" data-bb=\"clearStorage\">Not "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.userFirstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "? Click here!</a>\r\n	";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n		";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.userEmail), {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	";
  return buffer;
  }
function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n			<a class=\"notUser\" data-bb=\"clearStorage\">Not "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.userEmail)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "? Click here!</a>\r\n		";
  return buffer;
  }

function program18(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.buttonText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program20(depth0,data) {
  
  
  return "Watch Now";
  }

  buffer += "ï»¿<div data-bb=\"register\">\r\n  <div class=\"desc\">\r\n    \r\n  </div>\r\n  <div class=\"formBox\">\r\n    \r\n    <div class=\"form\">\r\n\r\n      <div class=\"userNotFound\" style=\"color:red;display:none;\">\r\n        We couldn't find any user with that email address.\r\n      </div>\r\n\r\n      <div>\r\n        ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.introText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      </div>\r\n	<span class=\"emailAjaxIndicator\"><img src=\"/img/ajaxSpinnerSmall.gif\" height=\"20\" />Please Wait...</span>\r\n	";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.fields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	<input type=\"hidden\" name=\"engageCampaignId\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-campaignid'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n	<input type=\"hidden\" name=\"engageCampaignStatus\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-campaignstatus'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n	<input type=\"hidden\" name=\"leadsource\" data-name=\"leadsource\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-leadsource'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n	<input type=\"hidden\" name=\"promocode\" data-name=\"promocode\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-promocode'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n	<br />\r\n	";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.userFirstName), {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	<br />\r\n	<input type=\"submit\" class=\"formSubmit\" value=\"";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.buttonText), {hash:{},inverse:self.program(20, program20, data),fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"/>\r\n	<span class=\"fieldAjaxIndicator\"><img src=\"/img/ajaxSpinnerSmall.gif\" height=\"20\" />Please Wait...</span>\r\n</div>\r\n\r\n  </div>\r\n\r\n<div class=\"login formBox\" style=\"display:none;\">\r\n  ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.introText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  <label>Email</label>\r\n  <input type=\"text\" data-bind=\"emailAddress\" />\r\n  <input type=\"submit\" value=\"Log In\" />\r\n  <a href=\"#\" class=\"cancelEmailEntry\">Cancel</a>\r\n</div>\r\n\r\n</div>\r\n\r\n<div data-bb=\"vimeo\" style=\"display:none;\">\r\n    <iframe class=\"demoModalFrame\" id=\"demoVimeoModalFrame\" scrolling=\"no\"></iframe>\r\n</div>\r\n\r\n<div data-bb=\"iframe\" style=\"display:none;\">\r\n    <iframe class=\"demoModalFrame\" scrolling=\"no\"></iframe>\r\n</div>\r\n</div>";
  return buffer;
  });
templates['downloadComplete'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"downloadCompleteWrap\">\r\n<div id=\"iframeDiv\"></div>\r\n<em>You are downloading:</em>\r\n<h4 id=\"hTitle\" class=\"resourceTitle\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-title'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h4>\r\n\r\n<!--[if IE 8]>\r\n    <div class=\"ie8bar\">\r\n        <p>Internet Explorer 8 Users: If your whitepaper download does not start, please right-click the bar at the top of your browser to allow the download and try again.</p>\r\n        <img src=\"/img/ie8bar.png\" />\r\n    </div>\r\n    <br />\r\n    <br />\r\n    <br />\r\n<![endif]-->\r\n\r\n<div class=\"forceDownload\">\r\n    <button class=\"btnPill\" data-bb=\"altDownload\">Click here if your download hasn't started</button>\r\n</div>\r\n<!-- xform social icons -->\r\n<div class=\"xformSocial\">\r\n    <p>\r\n        I just downloaded <strong>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-title'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong> and I would like to share it!\r\n    </p>\r\n\r\n    <div class=\"addthis_toolbox addthis_default_style addthis_32x32_style\">\r\n        <ul>\r\n            <li><a href=\"#\" class=\"share facebook\" target=\"_blank\" rel=\"nofollow\"></a></li>\r\n            <li><a href=\"#\" class=\"share linkedin\" target=\"_blank\" rel=\"nofollow\"></a></li>\r\n            <li><a href=\"#\" class=\"share google\" target=\"_blank\" rel=\"nofollow\"></a></li>\r\n            <!-- <li><a href=\"#\" class=\"share yahoomail\" target=\"_blank\" rel=\"nofollow\"></a></li> -->\r\n            <li><a href=\"#\" class=\"share twitter\" target=\"_blank\" rel=\"nofollow\"></a></li>\r\n        </ul>\r\n    </div>\r\n    \r\n</div>\r\n<!-- end xform social icons -->\r\n</div>\r\n";
  return buffer;
  });
templates['downloadModal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "ï»¿";
  });
templates['emailEntry'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"desc\">\r\n    <h1 id=\"dlHeader\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.formTitle)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ":</h1>\r\n    <img id=\"imgThumbnail\" src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-thumb'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n    ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.sidebarText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    <p class=\"resourceTitle\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-title'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n</div>\r\n<div class=\"formBox\">\r\n	";
  stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.introText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	<label>Email</label>\r\n	<input type=\"text\" data-bind=\"emailAddress\" />\r\n	<input type=\"submit\" value=\"Log In\" />\r\n	<a href=\"#\" class=\"cancelEmailEntry\">Cancel</a>\r\n</div>";
  return buffer;
  });
templates['genericModal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function";


  buffer += "<div class=\"genericModalInner\">\r\n	";
  stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });
templates['registerFields'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n	<div data-field-name=\""
    + escapeExpression(((stack1 = (depth0 && depth0.fieldName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\r\n		 ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isRequired), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		 ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.validationType)),stack1 == null || stack1 === false ? stack1 : stack1.isNumber), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		 ";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 && depth0.validationType)),stack1 == null || stack1 === false ? stack1 : stack1.regex)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		 >\r\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isVisible), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		";
  stack1 = (helper = helpers.inputForType || (depth0 && depth0.inputForType),options={hash:{},data:data},helper ? helper.call(depth0, depth0, options) : helperMissing.call(depth0, "inputForType", depth0, options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        <span class=\"error\" style=\"display: none\">"
    + escapeExpression(((stack1 = (depth0 && depth0.validationMessage)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n	</div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " \r\n		    data-validate-required=\"true\"\r\n            data-validation-message=\""
    + escapeExpression(((stack1 = (depth0 && depth0.validationMessage)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\r\n		 ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\r\n		 	data-validate-number=\"true\" \r\n		 ";
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n		 	data-validate-regex=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.validationType)),stack1 == null || stack1 === false ? stack1 : stack1.regex)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"\r\n		 ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n			<label\r\n			";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.fieldStyle)),stack1 == null || stack1 === false ? stack1 : stack1.labelFontSize), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\r\n			    "
    + escapeExpression(((stack1 = (depth0 && depth0.fieldFriendlyName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n			    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isRequired), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</label>\r\n		";
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n			style=\"font-size:"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fieldStyle)),stack1 == null || stack1 === false ? stack1 : stack1.labelFontSize)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "px;\"\r\n			";
  return buffer;
  }

function program11(depth0,data) {
  
  
  return "*";
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<a class=\"notUser\" data-bb=\"clearStorage\">Not "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.userFirstName)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "? Click here!</a>\r\n";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.userEmail), {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }
function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n		<a class=\"notUser\" data-bb=\"clearStorage\">Not "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.userEmail)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "? Click here!</a>\r\n	";
  return buffer;
  }

function program18(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.buttonText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program20(depth0,data) {
  
  
  return "Get the Whitepaper";
  }

  buffer += "ï»¿<span class=\"emailAjaxIndicator\"><img src=\"/img/ajaxSpinnerSmall.gif\" height=\"20\" />Please Wait...</span>\r\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.fields), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<input type=\"hidden\" name=\"engageCampaignId\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-campaignid'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n<input type=\"hidden\" name=\"engageCampaignStatus\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-campaignstatus'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n<input type=\"hidden\" name=\"leadsource\" data-name=\"leadsource\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-leadsource'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n<input type=\"hidden\" name=\"promocode\" data-name=\"promocode\" value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-promocode'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n<br />\r\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.userFirstName), {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<br />\r\n<input type=\"submit\" class=\"formSubmit\" value=\"";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.fieldData)),stack1 == null || stack1 === false ? stack1 : stack1.buttonText), {hash:{},inverse:self.program(20, program20, data),fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"/>\r\n<span class=\"fieldAjaxIndicator\"><img src=\"/img/ajaxSpinnerSmall.gif\" height=\"20\" />Please Wait...</span>\r\n";
  return buffer;
  });
templates['registerForm'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"desc\">\r\n    <h1 id=\"dlHeader\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.formTitle)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ":</h1>\r\n    <img id=\"imgThumbnail\" src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-thumb'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n    ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.sidebarText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    <p class=\"resourceTitle\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-title'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n</div>\r\n<div class=\"formBox\">\r\n    <div>\r\n        ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.introText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </div>\r\n  <div class=\"userNotFound\" style=\"color:red;display:none;\">\r\n    We couldn't find any user with that email address.\r\n  </div>\r\n    <div class=\"registerFieldsWrap\"></div>\r\n    <br />\r\n    <!-- xform social icons -->\r\n    <div class=\"xformSocial\" id=\"engage-form\">\r\n        <p>Log into your preferred social media account to instantly download this whitepaper.</p>\r\n\r\n        <ul class=\"socialSignIn\">\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-facebook\">\r\n                    <img ID=\"Image2\" src=\"/img/facebook_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-linkedin\">\r\n                    <img ID=\"Image3\" src=\"/img/linkedin_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-google\">\r\n                    <img ID=\"Image4\" src=\"/img/google_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-twitter\">\r\n                    <img ID=\"Image6\" src=\"/img/twitter_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-salesforce\">\r\n                    <img ID=\"Image7\" src=\"/img/salesforce_xform.png\" /></a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <!-- end xform social icons -->\r\n</div>";
  return buffer;
  });
templates['vimeoForm'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"desc\">\r\n    <h1 id=\"dlHeader\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.formTitle)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ":</h1>\r\n    <img id=\"imgThumbnail\" src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-thumb'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n    ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.sidebarText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    <p class=\"resourceTitle\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.downloadInfo)),stack1 == null || stack1 === false ? stack1 : stack1['data-title'])),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n</div>\r\n<div class=\"formBox\">\r\n    <div>\r\n        ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.formData)),stack1 == null || stack1 === false ? stack1 : stack1.template)),stack1 == null || stack1 === false ? stack1 : stack1.introText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </div>\r\n  <div class=\"userNotFound\" style=\"color:red;display:none;\">\r\n    We couldn't find any user with that email address.\r\n  </div>\r\n    <div class=\"registerFieldsWrap\"></div>\r\n    <br />\r\n    <!-- xform social icons -->\r\n    <div class=\"xformSocial\" id=\"engage-form\">\r\n        <p>Log into your preferred social media account to instantly download this whitepaper.</p>\r\n\r\n        <ul id=\"socialSignIn\">\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-facebook\">\r\n                    <img ID=\"Image2\" src=\"/img/facebook_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-linkedin\">\r\n                    <img ID=\"Image3\" src=\"/img/linkedin_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-google\">\r\n                    <img ID=\"Image4\" src=\"/img/google_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-yahoo\">\r\n                    <img ID=\"Image5\" src=\"/img/yahoo_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-twitter\">\r\n                    <img ID=\"Image6\" src=\"/img/twitter_xform.png\" /></a>\r\n            </li>\r\n            <li>\r\n                <a href=\"#\" data-target=\"janrain-salesforce\">\r\n                    <img ID=\"Image7\" src=\"/img/salesforce_xform.png\" /></a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <!-- end xform social icons -->\r\n</div>";
  return buffer;
  });
templates['watchVimeo'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"modal videoPreview\">\r\n    <iframe width=\"700\" height=\"394\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen\r\n	 src=\"http://player.vimeo.com/video/";
  if (helper = helpers.vimeoId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.vimeoId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "?api=1\"></iframe> \r\n</div>";
  return buffer;
  });
templates['webinarList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n		<a class=\"btnPill\" href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.webinarLink)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_blank\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.buttonText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n	";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n		<span class=\"btnPill launchVimeo\" data-vimeo=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.vimeoId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.buttonText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n	";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<div class=\"rating pnlRatingClass\" pageGuidAttr="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.pageGuid)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ">\r\n		<ol class=\"starList\">\r\n			<li class=\"starOne\">1</li>\r\n			<li class=\"starTwo\">2</li>\r\n			<li class=\"starThree\">3</li>\r\n			<li class=\"starFour\">4</li>\r\n			<li class=\"starFive\">5</li>\r\n		</ol>\r\n		<span class=\"numComments\"></span>\r\n	</div>\r\n	";
  return buffer;
  }

  buffer += "ï»¿<figure>\r\n	<img src="
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.thumbnailUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " />\r\n</figure>\r\n\r\n<div class=\"btnPillWrapper\">\r\n	";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.isUpcoming), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\r\n\r\n<div class=\"copy\">\r\n	<time>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.publishDate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</time>\r\n	<h3>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3>\r\n	";
  stack1 = ((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.summaryText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n	<a class=\"btnDetail\" href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.pageLink)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">Details</a>\r\n\r\n	";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.showRating), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });
templates['whitepaperList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "ï»¿<figure>\r\n    <img src=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.thumbnailUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\r\n</figure>\r\n\r\n<div class=\"btnPillWrapper\">\r\n    <span class=\"btnPill launchDownload\" data-pageid=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.pageId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-thumb=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.thumbnailUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-title=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" \r\n	data-url=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.pageLink)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-file=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.filePath)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-campaignid=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.engageCampaignId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-leadsource=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.leadSource)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-promocode=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.promoCode)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.buttonText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n</div>\r\n\r\n<div class=\"copy\">\r\n    <time>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.publishDate)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</time>\r\n    <h3>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3>\r\n    ";
  stack1 = ((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.summaryText)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n    <a class=\"btnDetail\" href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.pageLink)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">Details</a>\r\n    <div class=\"rating pnlRatingClass\" pageGuidAttr=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.pageGuid)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n        <ol class=\"starList\">\r\n            <li class=\"starOne\">1</li>\r\n            <li class=\"starTwo\">2</li>\r\n            <li class=\"starThree\">3</li>\r\n            <li class=\"starFour\">4</li>\r\n            <li class=\"starFive\">5</li>\r\n        </ol>\r\n        <span class=\"numComments\"></span>\r\n    </div>\r\n</div>";
  return buffer;
  });
})();