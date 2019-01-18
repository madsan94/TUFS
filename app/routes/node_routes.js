var validator = require("email-validator");
var fs = require("fs");
var mongoose = require('mongoose');
var Users = require('../Models/Users');
var Models = require('../Models/Models');
var Issues = require('../Models/Issues');
var uniqid = require('uniqid');
var Order = require('../Models/Order')

var json = {session: "none",
				role:"none",
				flag: "f",
				message: "none"};

function refreshJson(){
	Response = {session: "none",
			   flag: "f",
			   message: "none"};
}

module.exports = function(app, db) {
app.get('/', (req, res)=> {
	console.log(res.status)
		res.render('index.html');
	});

	
// Models and Issues
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
		
		// Login-Session homepage
		app.post('/login',(req,res)=>{
			refreshJson()
			Response["check_vehicle"]='f'
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
app.post('/orders',(req,res)=>{//{type,device,price,issue}
		refreshJson()
		console.log(req.body.device)
		var sess=req.session;
		//type: POST -> Post a Order
		//type: GET  -> Get all orders based on the role
		type=req.body.type
		Order_type=req.body.device
		if(type=='POST'){
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



