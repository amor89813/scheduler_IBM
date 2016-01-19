function Scheduler(){
    
    var simplybook = new Simplybook();
    this.client = simplybook.client;
    this.agents = this.getAgentList();
    this.simplybookTimezone = 'America/New_York';
    
    this.defaultTimezone = jstz.determine().name();
    this.timezone = this.defaultTimezone;
    this.currMomentOb = this.getMomentOb();
    this.currDate = this.currMomentOb.format("YYYY-MM-DD");
    this.currTime = this.currMomentOb.format("HH:mm:ss");
    this.interval = 30 * 60* 1000;
    
    this.lastToken = this.getCookieByName('_vdk_scheduler_token');
    
    this.events = {
        'video' : '1',
        'text'  : '2'
    };
    
    this.generateToken();
    
    this.count = 1;
}

/** generate the time matrix for the front-end to use
 *  @param {string} event - name of the event for ex.'video' or 'chat'
 *  @param {string} date - date that customer select on the datetimepicker default to current date
 *  @param {string} time - start time to calculate the time matrix, default to 
 */
Scheduler.prototype.getTimeMatrix = function(event,date,time){
    
    date = typeof date !== 'undefined' ? date : this.currDate;
    hour = this.getMomentOb().format('HH');
    hour = Number(hour)+1;
    time = typeof time !== 'undefined' ? time : (date === this.currDate ? hour+':00:00' : '10:00:00');
    
    start_time_moment = this.getMomentOb(date + " " + time);
    end_time_moment = this.getMomentOb(start_time_moment.format('YYYY-MM-DD 23:59:59'));
    
    start_time = start_time_moment.tz(this.simplybookTimezone).unix();
    end_time = end_time_moment.tz(this.simplybookTimezone).unix();
    
    console.log(date);
    console.log(time);
    var timeMatrix = {};
    
    for(t = start_time; t <= end_time; t=t+this.interval/1000){
        m = moment.unix(t);
        temp_time = m.tz(this.simplybookTimezone).format('YYYY-MM-DD HH:mm:ss');
        console.log(temp_time);
        agents = this.getAvailableAgentsByTime(event,temp_time);
        if(!agents.length) continue;
        temp_time = m.tz(this.timezone);
        timeMatrix[temp_time.format('HH:mm:ss')] = temp_time.format('hh:mm A (z)') + " ( " + agents.length + " agents available)";
        
    }
    
    return timeMatrix;
}

Scheduler.prototype.getBookingInfo = function(input,index,callback){
    
    if(typeof input === 'undefined' || typeof index === 'undefined'){
        //alert error
    }
    
    var instance = this;
    
    switch(index) {
       case 'code':
           $.post( "functions.php", {
            		    
                method : 'getBookingInfo',
                code : input,
                index: 'code',
            })
            .done(function( data ) {
                if(data){
                    
                    bookingInfo = JSON.parse(data);
                    if(!!bookingInfo && typeof bookingInfo.token != 'undefined' && bookingInfo.token.length > 0)
                    {
                        instance.lastToken = bookingInfo.token;
                    }
                    if(typeof callback === 'function') {
                        callback(bookingInfo);
                    }
                    
                }
            });
            break;
        
        case 'token':
            
            $.post( "functions.php", {
            		    
                method : 'getBookingInfo',
                token : input,
                index: 'token',
            })
            .done(function( data ) {
                if(data){
                    
                    bookingInfo = JSON.parse(data);
                    if(!!bookingInfo && typeof bookingInfo.token != 'undefined' && bookingInfo.token.length > 0)
                    {
                        instance.lastToken = bookingInfo.token;
                    }
                    if(typeof callback === 'function') {
                        callback(bookingInfo);
                    }
                    
                }
            });
        
        default : break;
   }
    
    
    return this;

}

Scheduler.prototype.getAvailableAgentsByTime = function(event,time){
    return this.client.getAvailableUnits(this.events[event],time,this.count);
}

Scheduler.prototype.getAvailableHoursByAgent = function(agentId,date,event){
    
    //
}

Scheduler.prototype.getWorkCalendarByAgent = function(agentId,year,month){
    
}

Scheduler.prototype.getAgentList = function(){
    return this.client.getUnitList();
}

Scheduler.prototype.book = function(event,agentId,date,time,customerInfo,addtionalFields,callback){
    
    
    
    simplybook_moment = this.getMomentOb(date +" "+ time,this.timezone).tz(this.simplybookTimezone);
    simplybook_date = simplybook_moment.format('YYYY-MM-DD');
    simplybook_time = simplybook_moment.format('HH:mm:ss');
    
    this.client.book(this.events[event],agentId,simplybook_date,simplybook_time,customerInfo,addtionalFields);
    var instance = this;
    
    $.post( "functions.php", {
		    
		    method : 'book',
			unit: agentId,
			event: instance.events[event],
			name: customerInfo['name'],
			email: customerInfo['email'],
			phone: customerInfo['phone'],
			time : (date + " " + time),
			codeid: addtionalFields['05413026b0f9bfd0bfcc5d6eef62f2ee'],
			token : instance.token,
			timezone : instance.timezone,
	        })
		    .done(function( data ) {
		        
		        start_time = new Date(date + " " + time);
		        end_time = start_time.setTime(start_time.getTime() + this.interval);
		        instance.setCookie('_vdk_scheduler_token',instance.token,{expires : end_time});
		        instance.lastToken = instance.token;
		        //update the token to avoid duplicate booking
		        instance.generateToken();
		        if(typeof callback === 'function'){
		            callback(data);
		        }
    });

    return this;
    
    
}

Scheduler.prototype.cancel = function(){
    
}


Scheduler.prototype.getCookieByName = function(name){
    
    if(typeof document.cookie === 'undefined' || document.cookie == '') return undefined;
    cookies = document.cookie.split('; ');
    for(var i = 0; i<cookies.length; i++){
        cookie = cookies[i].split('=');
        if(cookie[0] == name){
            return cookie[1];
        }
    }
    
    return undefined;
    
}

Scheduler.prototype.setCookie = function(name,value,options){
    
    //using jQuery function for now, can create our own function
    $.cookie(name,value,options);
    
}

Scheduler.prototype.removeCookie = function(name){
    $.removeCookie(name)
}

Scheduler.prototype.generateToken = function(start_time){


    time = typeof start_time !== 'undefined' ? start_time : new Date();
    browser  = this.detectBrowser();
    
    var instance = this;
    
    $.post( "functions.php", {
		    
		    time : time,
		    browser : browser,
		    timezone : this.defaultTimezone,
		    method: 'generateToken'
	        })
		    .done(function( data ) {
		        instance.token = data;
    });
    
    return instance.token;
}

Scheduler.prototype.updateToken = function(token){
    
    $.post( "functions.php", {
		    
		    new_token : this.token,
		    old_token : token,
		    method: 'updateToken',
	        })
		    .done(function( data ) {
		        //
    });
    
    return this;
}

Scheduler.prototype.detectBrowser = function(){
    
    if(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0){
        return "opera";
    }
    else if(typeof InstallTrigger !== 'undefined'){
        return 'firefox';
    }
    else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0){
        return 'safari';   
    }
    else if (!!window.chrome){
        return 'chrome';
    }
    else if(!!document.documentMode){
        return 'IE';
    }
    
}


Scheduler.prototype.getMomentOb = function(time,timezone){
    curr = new Date();
    time = typeof time !== 'undefined' ? time : curr.toISOString();
    timezone = typeof timezone !== 'undefined' ? timezone : this.timezone;
    return moment.tz(time,timezone);
    
}

Scheduler.prototype.loadExtraScripts = function(extraScripts){
    
    if(typeof extraScripts === 'undefined' || !extraScripts.length) return;
    for(key in extraScripts){
        
        head= document.getElementsByTagName('head')[0];
        script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= extraScripts[key];
        head.appendChild(script);

    }
}

function Simplybook(){
	
	this.options = {
		'api_url': 'http://user-api.simplybook.me',
        'api_login': 'videodesk',
        'api_key': 'fdbfb24dd3ff2cf95bf4f4c49a86628eb3448ae673a5569ff0d6ef6e98cdb328'
	};
    
    this.addtionalFields = {
        addtional_field_1 : '05413026b0f9bfd0bfcc5d6eef62f2ee',
        addtional_field_2 : 'e2620d472b63972d2fb4f8029e865a23',
    };
    
	this.client = null;
	this.initClient();
	
}

Simplybook.prototype.initClient = function(){
	
	var loginClient = new JSONRpcClient({
            'url': this.options.api_url + '/login',
            'onerror': function (error) {
            	console.log(error);
            }
       	});

    var token = loginClient.getToken(this.options.api_login, this.options.api_key);

    this.client = new JSONRpcClient({
            'url': this.options.api_url,
            'headers': {
                'X-Company-Login': this.options.api_login,
                'X-Token': token
            },
            'onerror': function (error) {
            	console.log(error);
            }
	});

	return this;
}

Simplybook.prototype.getParam = function(){
	
	if(typeof this[name] === 'undefined'){
    
        //error_message
        return;
   	}

   	return this[name];
}

Simplybook.prototype.error = function(error){
	alert(error);
}







