var _videodesk= _videodesk || {};
    _videodesk['firstname'] = '' ;
    _videodesk['lastname'] = '' ;
    _videodesk['company'] = '' ;
    _videodesk['email'] = '' ;
    _videodesk['phone'] = '' ;
    _videodesk['customer_lang'] = '' ;
    _videodesk['customer_id'] = '' ;
    _videodesk['customer_url'] = '' ;
    _videodesk['cart_id'] = '' ;
    _videodesk['cart_url'] = '' ;
    _videodesk['uid'] = '30d60514a02354652abc959524762378' ;
    _videodesk['lang'] = 'en' ;
    _videodesk['custom_fields'] = {} ;
    _videodesk['module_url'] = 'cacheyaou.videodesk.com' ;
    _videodesk['pusher_auth_url'] = 'cacheyaou.videodesk.com/pusher_auth.php' ;
        
(function() {
var videodesk = document.createElement('script'); videodesk.type = 'text/javascript'; videodesk.async = true;
videodesk.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'frontyaou.videodesk.com/js/videodesk.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(videodesk, s);
})();

/*window.agent_availability = false;
    
function _videodeskGetAvailability(availability){
    agent_availability = availability;
    console.log(availability);
}*/

function Form(){
        
        this.currTime = new Date();
        this.currDate = this.formatDate();
        
        this.scheduled = false;
        this.bookingInfo = false;
        
        this.formData = {};this.scheduler = new Scheduler();
        this.setData('date',this.currDate);
        this.initWorkCalendar();
        
}

jQuery.extend(Form.prototype,{
    
    formatDate : function(){
        return this.currTime.getFullYear() + '-' + this.strPad(this.currTime.getMonth() + 1) + '-' + this.strPad(this.currTime.getDate());
    },
    
    strPad : function(val){
        if (val > 9) {
        return val.toString();
    }
        return '0' + val;
    },
    
    timeConvert: function(time){
        
        time = time.split(':');
        
        if(time[0] > 12){
            
            time[0] = this.strPad(time[0]-12);
            return time[0] + ":" + time[1] + " PM";
        }
        else{
            return time[0] + ":" + time[1] + " AM";
        }
        
    },
    
    initWorkCalendar: function(){
        
        this.updateWorkCalendar(this.currDate,'video');
        return this;
    },
    
    //update the timeMatrix
    updateWorkCalendar: function(date,event){
        
        $('#timepicker').html('');
        
        var timeMatrix = this.scheduler.getTimeMatrixByDate(date,event);
        
        
        if(jQuery.isEmptyObject(timeMatrix)){
            var row = "<div class='busyrow'><p>Sorry, all slot are busy. Please choose another date.</p></div>";
            $('#timepicker').html(row);
            return this;
        }
        
        for(var timeSlot in timeMatrix){
            
            var time = this.timeConvert(timeSlot);
            var row = "<div class='timerow' value='"+timeSlot+"'><p> "+time+" | " + timeMatrix[timeSlot] +" available</p></div>";
        
            $('#timepicker').append(row);
        }
        
        return this;
    },
    
    setData : function(name,val){
        this.formData[name] = val;
        return this;
    },
    
    
    //validate all the data before sending submit the form
    validateForm: function(){
        
    },
    
    //submit the form using rpc client
    submit : function(){
        
        agentId = 5;     //hard code to bookmyself
        date = this.formData.date;
        time = this.formData.time;
        customerInfo = {
            'name': this.formData.name,
            'email':this.formData.email,
            'phone':'13478217702'
        };
        
        codeid = Math.floor((Math.random() * 900000) + 100000);

        addtionalFields = {
            '05413026b0f9bfd0bfcc5d6eef62f2ee': codeid
        }
        var res = this.scheduler.book('video',agentId,date,time,customerInfo,addtionalFields);
        
        this.scheduled = true;
        
        return this;
        
    },
    
    getBookingInfo : function(codeid,triggerCountDown){
        
        var instance = this;
        
        codeid = typeof codeid !== 'undefined' ? codeid : window.location.search;
        triggerCountDown = typeof triggerCountDown !=='undefined' ? triggerCountDown : false;
        if(!codeid.length) return;
        
        codeid = codeid.substr(1).split('=');
        
        $.post( "functions.php", {
    		    
    		    method : 'getBookingInfo',
    			code : codeid[1],
    	        })
    		    .done(function( data ) {
    		        if(data){
    		            
                        instance.bookingInfo = JSON.parse(data);
    		            instance.scheduled= true;
    		            if(triggerCountDown) {
    		                instance.initCountDown(instance.bookingInfo.start_date_time,instance.bookingInfo.token);    
    		            }
    		            
    		        }
    	});
        
        return instance;
    
    },
    
    initCountDown: function(start_date_time,codeid){	
        
        var instance = this;
        if(!instance.scheduled) return;
        
        $('#clock').countdown(start_date_time, {elapse: false}).on('update.countdown', function(event) {
            
            var $this = $(this);
            if (event.elapsed) {
                //$this.html(event.strftime('After end: <span>%H:%M:%S</span>'));
            } else {
                
                now = new Date();
                timeDiff = event.finalDate.getTime() - now.getTime();
                day = Math.floor(timeDiff / (1000 * 3600 * 24)); 
               
                if(timeDiff > 10 * 60 * 1000){
                    if(!document.getElementById('videodesk-post-header-schedule-timer') && document.getElementById('videodesk-header')){
                        _vdk.ui.rem('header');
                        _vdk.ui.set("post-header","schedule_timer");
                        $('div#line2 span').text(start_date_time);
                    }   
                }
                else {
                    if(!document.getElementById('videodesk-post-content-schedule-countdown-message')){
                        _vdk.ui.rem('post-header');
                        _vdk.ui.set('post-content','schedule_countdown');
                    }
                    
                    $('div#videodesk-post-content-schedule-countdown-message p').text(event.strftime('You conversation will start in: %M:%S'));
                }
                
                
                
                
            }
           
        }).on('finish.countdown', function(event){
                
            instance.initCall(codeid);
        });
        
        return instance;
        
    },
    
    initCall : function(codeid){
        
        var instance = this;
        
        $('div#videodesk-post-content-schedule-countdown-message p').text('Launching the call...');
        
        if(!instance.bookingInfo){
            instance.getBookingInfo(codeid);
        }
        
        if(instance.bookingInfo.has_started == '0'){
            //alert("get here");
            $.post( "functions.php", {
    		    
    		    method : 'startCall',
    			code : codeid,
    	        })
    		    .done(function( data ) {
    		        if(data){
        		        setTimeout(function(){
                            _vdk.setContextParameter('selected_agent', '624bd406a327e088e9ccd3592b79ac2a') ;
                            _vdk.makeCall('video',0,1);
                        },'2000');
    		            
    		        }
    	    });   
            
        }
    },
    
    
    
    
    
});


$(document).ready(function(){
  
    window.form = new Form();
    
    form.getBookingInfo(undefined,true);
    
    
    
	$('#category_select .genius-button').click(function(){
		$('#category_select').slideToggle();
		$('#service_select').show();
		category = $(this).find('.genius-button-message b').text();
		$('#contact_title').text(category);
	    $('#cross-icon').show();
	});

	$('#service_select .genius-button').click(function(){
		$('#service_select').slideToggle();
		$('#schedule_call').show();
		$('#contact_title').text('Schedule a call');
	});
	
	$('#book').click(function(){
	    
	    $('#schedule_call').slideToggle();
	    $('#schedule_confirm').show();
		$('#contact_title').text('Thank You!');
		document.getElementById('header').scrollIntoView();
		
	    form.setData('name',$('#form_name').val());
	    form.setData('email',$('#form_email').val());
	    form.setData('comment',$('#form_comment').val());
	    
	    form.submit();
	    form.updateWorkCalendar(form.formData.date,'video');
		
		start_date_time = form.formData.date +" "+ form.formData.time;
		
		form.initCountDown(start_date_time);
	});	
	
	$('#cross-icon').click(function(){
	    $(this).hide();
        $('#service_select').hide();
		$('#schedule_call').hide();
		$('#schedule_confirm').hide();
		$('#category_select').slideToggle();
		$('#contact_title').text('Contact Us');
	});	
	

	$('#datepicker').datetimepicker({
        dayOfWeekStart : 7,
        lang:'en',
        formatTime:'g:i A',
        timepicker : false,
        formatDate:'d.m.y',
        step:60,
        showSecond: true,
        ampm:true,
        inline:true,
        onGenerate : function(currentTime,input){
            $(this).find('.xdsoft_weekend').addClass('xdsoft_disabled');
        },
        onSelectDate:function(ct,$i){
            newDate = ct.dateFormat('Y-m-d');
            form.setData('date',newDate);
            form.updateWorkCalendar(newDate,'video');
        }
    })
    
    $(document).on('click','.timerow',function(){
        
        time = $(this).attr('value');
        form.setData('time',time);
        
        el = $(".timerow[name='selected']").find('p');
        el.css('color','#666');
        el.css('background-color','#f5f5f5');
        el.css('font-size','14px');
        $(this).attr('name','');

        
        if($(this).attr('name') !== 'selected'){
            el = $(this).find('p');
            el.css('color','white');
            el.css('background-color','#33aaff');
            el.css('font-size','15px');
            $(this).attr('name','selected');
        }
        
    })
    
    
    
    
    
    
})