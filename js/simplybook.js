function Scheduler(){
    
    var simplybook = new Simplybook();
    this.client = simplybook.client;
    this.agents = this.getAgentList();
    
    this.events = {
        'video' : '1',
        'text'  : '2'
    };
    
    this.count = 1;
}

Scheduler.prototype.getTimeMatrixByDate = function(date,event){
    
    var timeMatrix = {};
    
    for(var agentId in this.agents){
       
       var temp = this.client.getStartTimeMatrix(date,date,this.events[event],agentId,this.count);
       for(var key in temp){
           temp = temp[key];
       }
       
       for(var i=0; i<temp.length; i++){
          
          if(temp[i] in timeMatrix){
             timeMatrix[temp[i]]++;
          }
          else{
              timeMatrix[temp[i]] = 1;
          }
       }
    }
    
    return timeMatrix;
}

Scheduler.prototype.getAvailableAgentsByTime = function(time,event){
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

Scheduler.prototype.book = function(event,agentId,date,time,customerInfo,addtionalFields){
    
    this.client.book(this.events[event],agentId,date,time,customerInfo,addtionalFields);
    
    $.post( "functions.php", {
		    
		    method : 'book',
			unit: agentId,
			event: this.events[event],
			name: customerInfo['name'],
			email: customerInfo['email'],
			phone: customerInfo['phone'],
			time : (date + " " + time),
			codeid: addtionalFields['05413026b0f9bfd0bfcc5d6eef62f2ee']
	        })
		    .done(function( data ) {
		        //alert(data);
    });
    return this;
    
    
}

Scheduler.prototype.cancel = function(){
    
}


function Simplybook(){
	
	this.options = {
		'api_url': 'http://user-api.simplybook.me',
        'api_login': 'videodesk',
        'api_key': 'fdbfb24dd3ff2cf95bf4f4c49a86628eb3448ae673a5569ff0d6ef6e98cdb328'
	};

	this.client = null;
	this.initClient();
	
}

Simplybook.prototype.initClient = function(){
	
	var loginClient = new JSONRpcClient({
            'url': this.options.api_url + '/login',
            'onerror': function (error) {
            	alert(error);
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
            	alert(error);
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







