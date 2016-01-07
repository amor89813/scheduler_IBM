(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['socialLinks'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- Share Block -->\r\n<!-- title : ";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " -->\r\n<!-- fullHref : ";
  if (helper = helpers.fullHref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fullHref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " -->\r\n\r\n<!-- Facebook -->\r\n<div class=\"fb-like\" data-send=\"false\" data-layout=\"box_count\" data-width=\"60\" data-show-faces=\"false\" data-href=\"";
  if (helper = helpers.fullHref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fullHref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></div>\r\n\r\n<!-- Linked In -->\r\n<script type=\"in/share\" data-counter=\"top\" data-url=\"";
  if (helper = helpers.fullHref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fullHref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></script>\r\n\r\n<!-- Google Plus -->\r\n<g:plusone action=\"share\" annotation=\"bubble\" size=\"tall\" height=\"60\" href=\"";
  if (helper = helpers.fullHref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fullHref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></g:plusone>\r\n\r\n<!-- Twitter -->\r\n<a href=\"https://twitter.com/share?url=";
  if (helper = helpers.fullHref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fullHref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "&text=";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"twitter-share-button\" data-size=\"medium\" data-count=\"vertical\">Tweet</a>\r\n\r\n<!-- End Share Block -->";
  return buffer;
  });
})();