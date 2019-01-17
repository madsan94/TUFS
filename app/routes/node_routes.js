var validator = require("email-validator");
var fs = require("fs");
var mongoose = require('mongoose');
var Users = require('../Models/Users');
var Models = require('../Models/Models');
var Issues = require('../Models/Issues');

var jsonObj = {session: "none",
				role:"none",
				flag: "f",
				message: "none"};

function refreshJson(){
	jsonObj = {session: "none",
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
						jsonObj['flag']='s';
						jsonObj['message']="Got the Devices and Issues";
						jsonObj['session']=sess;
						jsonObj['models']=model_data;
						jsonObj['issues']=issue_data;
						res.send(jsonObj);
						console.log("yeah");
						
					}
				})
	}
	});
	
	}
	else{
		jsonObj['flag']='f'
		jsonObj["message"]="Invalid Email Address"
		res.send(jsonObj)
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
	jsonObj['flag']='f'
	jsonObj["message"]="Session Expired"
	res.send(jsonObj)
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
					jsonObj['flag']='f';
					jsonObj['message']="User Already Exists"
					res.send(jsonObj);
					}
			  else{
				  console.log(req.email)
					var sess=req.session
					sess.email=req.body.email
					sess.name=req.body.name
						
						jsonObj["session"]=sess
						jsonObj['flag']='s'
						jsonObj['message']="User Registered Succesfully"
						res.send(jsonObj)
					}
		});
		})
		
		// Login-Session homepage
		app.post('/login',(req,res)=>{
			refreshJson()
			jsonObj["check_vehicle"]='f'
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
				jsonObj['flag']='f'
				jsonObj["message"]="Invalid Username or Password"
		
				res.send(jsonObj)
			}
				else{
		
		
		
					Vehicle.find({email:sess.email},function(err,data){
						if(err){
							res.json(err)
						}
						else{
							if(data.length==0)
							{
								console.log("all right")
								sess.name=user[0].a_name;
								sess.email=user[0].a_email;
								jsonObj['flag']='s';
								jsonObj['message']="Logged In";
								jsonObj['session']=sess;
								jsonObj['check_vehicle']='f';
								res.send(jsonObj);
		
		
							}
							else{
								sess.name=user[0].a_name;
								sess.email=user[0].a_email;
								jsonObj['flag']='s';
								jsonObj['message']="Logged In";
								jsonObj['session']=sess;
								jsonObj['check_vehicle']='s';
								res.send(jsonObj);
								console.log("yeah");
							}
						}
					})
		
		}
		});
		
		}
		else{
			jsonObj['flag']='f'
			jsonObj["message"]="Invalid Email Address"
			res.send(jsonObj)
		}
		});
			



}



