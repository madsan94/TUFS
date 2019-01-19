var validator = require("email-validator");
var fs = require("fs");
const SendOtp = require('sendotp');
var mongoose = require('mongoose');
var Users = require('../Models/Users');
var Models = require('../Models/Models');
var Issues = require('../Models/Issues');
var otp = require('../Models/otp');
var uniqid = require('uniqid');
var Order = require('../Models/Order')
const sendOtp = new SendOtp('257484AxC4Y6P715c431733', 'Otp for your order in Alam Solutions is {{otp}}, please do not share it with anybody');


//Generate OTP Function
function GenerateOtp(){
	return(Math.floor(100000 + Math.random() * 900000))

}

function RemoveOTP(){

	otp.remove({number:req.body.number},function(err, data) {
		if(err)
		console.log(err)
		else
			console.log(data)
		})
//Save Number with null otp
var otp =new otp(opt_data_updated)			
otp.save(function(err, data) {
		if(err)
		console.log(err)
		else
			console.log(data)
		})	
	
}
//Response JSON
var Response = {session: "none",
				role:"none",
				flag: "f",
				message: "none"};

//Function which refreshes the Response
function refreshJson(){
	Response = {session: "none",
			   flag: "f",
			   message: "none"};
}

//HOME
module.exports = function(app, db) {
app.get('/', (req, res)=> {
	console.log(res.status)
		res.render('index.html');
	});

	
// Models and Issues
// Request Params{device}
//Respond with Models,Issues and respective Price 
	app.post('/models',(req,res)=>{
	refreshJson()
	console.log(req.body.device)
	var sess=req.session;
	device=req.body.device
	if(device){
	Models.find({Device:device}, function(err,model_data){
			if(err){
			res.json(err);}
			else{
		Issues.find({Device:device},function(err,issue_data){
					if(err){
						res.json(err)
					}
					else{
						Response['flag']='s';
						Response['message']="Got the Devices and Issues";
						Response['session']=sess;
						Response['models']=model_data;
						Response['issues']=issue_data;
						res.send(Response);
						console.log("yeah");
						
					}
				})
	}
	});
	
	}
	else{
		Response['flag']='f'
		Response["message"]="Invalid Device"
		res.send(Response)
	}
	});
//===========================================================================================	
//Forget password
app.post('/change_password',(req,res)=>{
		refreshJson()
		sess=req.body.session
		if(sess.email){
		var change={ $set: { a_password:req.body.password } };
		Users.update({a_email:sess.email},change, function(err, data) {
	if(err)
	res.jsos(err)
	else
		res.json(data)
	})
	}
	else{
	Response['flag']='f'
	Response["message"]="Session Expired"
	res.send(Response)
	}
	})
	app.get('/', (req, res)=> {
		console.log(res.status)
			res.render('index.html');
		});
//=====================================================================================
//SIGNUP	
app.post('/signup', (req, res) => {
		refreshJson()
		console.log(req.body)
		var user_data = {
		a_name: req.body.name,
		a_email: req.body.email,
		a_password:req.body.password,
		a_role: req.body.role
			};
		
		var user = new Users(user_data);
		user.save( function(error, data){
			if(error){
					Response['flag']='f';
					Response['message']="User Already Exists"
					res.send(Response);
					}
			  else{
				  console.log(req.email)
					var sess=req.session
					sess.email=req.body.email
					sess.name=req.body.name
						
						Response["session"]=sess
						Response['flag']='s'
						Response['message']="User Registered Succesfully"
						res.send(Response)
					}
		});
		})

app.post('/send_otp',(req,res)=>{
	refreshJson()
	var otp=GenerateOtp()
	mobile_number=req.body.number
	//var otp=new otp(otp_data) 
	
	sendOtp.send(mobile_number,otp, function (error, data) {
		if(error){
			console.log(error)
			sendOtp.retry(contactNumber, false, callback);
		}
		else{
			console.log(data)
			Response['flag']='s'
			Response['message']='OTP Generated Succesfully'
			res.send(Response)
		}
	  });
	
})

app.post('/verify_otp',(req,res)=>{
	sendOtp.verify(req.body.number, req.body.otp, function (error, data) {
		console.log(data); // data object with keys 'message' and 'type'
		if(data.type == 'success') 
		{
			Response['flag']='s'
			Response['message']="User Verified Successfully"
		}
		if(data.type == 'error')
		{
			Response['flag']='f'
			Response['message']="User Not Verified"
		}
	  });
	})


//===========================================================================================		
// Login 
app.post('/login',(req,res)=>{
	refreshJson()
	console.log(req.body.email)
		var email_flag=validator.validate(req.body.email);
		var sess=req.session;
		sess.email=req.body.email
		console.log(sess.email)
		if(email_flag==true){
		console.log("ok")
		Users.find({a_email:sess.email,a_password:req.body.password}, function(err,user){
				if(err){
				res.json(err);}
				if(user.length==0){
					console.log(user)
				Response['flag']='f'
				Response["message"]="Invalid Username or Password"
		
				res.send(Response)
			}
				else{
					console.log("all right")
					sess.name=user[0].a_name;
					sess.email=user[0].a_email;
					Response['flag']='s';
					Response['message']="Logged In";
					Response['session']=sess;
					res.send(Response);
					}
		});
		
		}
		else{
			Response['flag']='f'
			Response["message"]="Invalid Email Address"
			res.send(Response)
		}
		});



//Takes an Order and Place and Order
//Request Params:{type,device,price,issue}-> while Posting 
//Request Params:{status:O/P/D} as per Ordered,Pending(assigned to staff),Done
//Can Request by Filters-> extra flexibiity for sorting 		
app.post('/orders',(req,res)=>{
		refreshJson()
		console.log(req.body.device)
		var sess=req.session;
		if(type=='POST'){
		//type: POST -> Post a Order
		//type: GET  -> Get all orders based on the role
		type=req.body.type
		Order_type=req.body.device	
		if(sess){
		order_number=uniqid()
		var order_data={
			Order_Number:order_number,
			User_Id:sess.email,
			Creation_Date:str(date.format(now, 'YYYY/MM/DD')),
			Status:'O',
			Assigned:"",
			Price:req.body.price,
			Issue:req.body.issue
			
		}	
		var order = new Order(order_data);
		order.save(function(error, data){
						 if(error){
							Response['flag']='f';
							Response['message']="Cannot Order Now"
								 res.json(json);
								 }
							 else{
								Response["session"]=sess
								Response['flag']='s'
								Response['Order_ID']=order_number
								Response['message']="Order Placed"
								res.send(Response)
								 }						
								})
			}
			else{
				Response['flag']='f'
				Response["message"]="Invalid Email Address"
				res.send(Response)
			}
		}
			});
			
			
			
						



}



