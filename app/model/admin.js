const crypto = require('crypto');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AdminSchema = new Schema({
	username: String,
	name:{
		first: String,
		last: String
	},
	email: String,
	password: String,
	salt: String,
	image: String,
	role: String,
	permissions: []
},{timestamps:true});

const Admin = module.exports = mongoose.model('Admin', AdminSchema, 'admins');

module.exports.login = async function(username,password){
	let doc = await Admin.findOne({username:username.toLowerCase()}).exec();
	if(doc){
		const hash = crypto.pbkdf2Sync(password, doc.salt, 2048, 32, 'sha512').toString('hex');
		if(hash === doc.password){
			Log.log('Admin login erfolgreich "'+doc.username+'"');
			return {
				_id:doc._id,
				username: doc.username,
				name:doc.name,
				email: doc.email,
				image: doc.image,
			}
		}
		else {
			Log.log('Admin login fehlgeschlagen "'+doc.username+'"');
			return false;
		}
	}
	else {
		Log.log('Admin login fehlgeschlagen - unbekannter Benutzer "'+username+'"');
		return false;
	}
}
module.exports.createAdmin = async function(username,password,email,firstName,lastName,image,role){
	const salt = crypto.randomBytes(16).toString('hex');
	const encryptedPassword = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
	let data  = {
		username: username,
		name:{
			first: firstName,
			last: lastName
		},
		email: email,
		password: encryptedPassword,
		salt: salt,
		image: image,
		role: role,
		permissions: []
	}
	let admin = await Admin.create(data);
	return admin._id;
}