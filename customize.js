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
        
        this.scheduler = new Scheduler();
        
        this.scheduled = false;
        this.bookingInfo = false;
        this.timeMatrix = {};
        
        this.formData = {};
        this.currDate = this.scheduler.currMomentOb.format('YYYY-MM-DD');
        this.setData('date',this.currDate);
        this.initWorkCalendar();
        
}

jQuery.extend(Form.prototype,{
    
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
        
        this.updateWorkCalendar('video',this.currDate);
        return this;
    },
    
    //update the timeMatrix
    updateWorkCalendar: function(event,date,time,frombook){
        
        var instance = this;
        if(typeof frombook === 'undefined' || frombook === false){
            $("body").css("cursor", "progress");
        }
        setTimeout(function(){
            
            $('#timepicker').html('');
        
            instance.timeMatrix = instance.scheduler.getTimeMatrix(event,date,time);
            
            
            if(jQuery.isEmptyObject(instance.timeMatrix)){
                var row = "<div class='busyrow'><p>Sorry, all slot are busy. Please choose another date.</p></div>";
                $('#timepicker').html(row);
                return instance;
            }
            
            for(var timeSlot in instance.timeMatrix){
                
                
                var row = "<div class='timerow' value='"+timeSlot+"'><p>"+instance.timeMatrix[timeSlot]+"</p></div>";
            
                $('#timepicker').append(row);
            }
            $("body").css("cursor", "default");
            return instance;
            
            
        },1000)
        
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
        
        start_time = this.scheduler.getMomentOb(date+' '+time).format('LLL (z)')
        codeid = Math.floor((Math.random() * 900000) + 100000);

        addtionalFields = {
            '05413026b0f9bfd0bfcc5d6eef62f2ee': codeid,
            'e2620d472b63972d2fb4f8029e865a23': start_time
        }
        
        var instance = this;
        
        var res = this.scheduler.book('video',agentId,date,time,customerInfo,addtionalFields,function(){
            
            $("#clock").removeData('jcdData');
		    instance.getBookingInfo(instance.scheduler.lastToken,'token',true);
        });
        
        return this;
        
    },
    
    getBookingInfo : function(input,method,triggerCountDown){
        
        triggerCountDown = typeof triggerCountDown !=='undefined' ? triggerCountDown : false;
        var instance = this;
        
        switch(method){
            
            case 'code':
                this.scheduler.getBookingInfo(input,'code',function(bookingInfo){
                    
                    if(!!bookingInfo){
                        instance.scheduled = true;
                        instance.bookingInfo = bookingInfo;
                        res = triggerCountDown ? instance.initCountDown(bookingInfo) : false;
                        
                    }else{
                        instance.getBookingInfo(instance.scheduler.lastToken,'token',triggerCountDown);
                    }
                    
                });
                
            break;
            
            case 'token':
                
                this.scheduler.getBookingInfo(input,'token',function(bookingInfo){
                    instance.scheduled = true;
                    instance.bookingInfo = bookingInfo;
                    res = triggerCountDown ? instance.initCountDown(bookingInfo) : false;
                });
                
            break;
            
        }
        
        return instance;
    
    },
    
    initCountDown: function(bookingInfo){	
        
        var instance = this;
        if(!instance.scheduled) return;
        
        momentOb = this.scheduler.getMomentOb(bookingInfo.start_date_time,bookingInfo.timezone)
        ui_date_time = momentOb.format('LLL (z)');
        start_date_time = momentOb.tz(this.scheduler.defaultTimezone).format('YYYY-MM-DD HH:mm:ss');
        
        $('#clock').countdown(start_date_time, {elapse: false})
        
        .on('update.countdown', function(event) {
            
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
                    }
                    $('div#line2 span').text(ui_date_time);
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
                
            instance.initCall(bookingInfo.code);
        });
        
        return instance;
        
    },
    
    initCall : function(codeid){
        
        var instance = this;
        
        $('div#videodesk-post-content-schedule-countdown-message p').text('Launching the call...');
        
        if(!instance.bookingInfo){
            instance.getBookingInfo(codeid,'code',false);
        }
        
        if(typeof instance.bookingInfo.has_started !== 'undefined' && bookingInfo.has_started === '0'){
            
            
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
    params = window.location.search;
    params = params.substr(1).split('=');
    
    form.getBookingInfo(params[1],'code',true);
    
    
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
	    
	    form.setData('name',$('#form_name').val());
	    form.setData('email',$('#form_email').val());
	    form.setData('comment',$('#form_comment').val());
	    form.submit();
	    
	    
	    $('#schedule_call').slideToggle();
	    $('#schedule_confirm').show();
		$('#contact_title').text('Thank You!');
		document.getElementById('header').scrollIntoView();
		
	    form.updateWorkCalendar('video',form.formData.date,undefined,true);
		
	});	
	
	$('#cross-icon').click(function(){
	    $(this).hide();
        $('#service_select').hide();
		$('#schedule_call').hide();
		$('#schedule_confirm').hide();
		$('#category_select').slideToggle();
		$('#contact_title').text('Contact Us');
	});	
	
    $("#timezonepicker select").timezones();
    $('#timezonepicker select').val(form.scheduler.timezone);
    $('#timezonepicker select').change(function(){
        form.scheduler.timezone = $(this).val();
        form.updateWorkCalendar('video',form.formData.date);
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
        className: 'vdk_scheduler',
        onGenerate : function(currentTime,input){
            $(this).find('.xdsoft_weekend').addClass('xdsoft_disabled');
        },
        onSelectDate:function(ct,$i){
            newDate = ct.dateFormat('Y-m-d');
            form.setData('date',newDate);
            form.updateWorkCalendar('video',newDate);
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