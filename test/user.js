describe('User', function(){

	var sequelize = require('../sequelize');
	var User = sequelize.model('User');

	it('should create the user "axel.dolce@gmail.com" with password "incorrect".', function(done){
		
		User.create({
			username : 'axel.dolce@gmail.com',
			password : 'incorrect'
		}).then(function(user){

			if (user.passwordEquals('incorrect')) { done(); }

		}).catch(function(err){
			done(new Error(err));
		});

	});

	it('should change "axel.dolce@gmail.com" password to "correct".', function(done){
		
		User.find({
			where : { username : 'axel.dolce@gmail.com' }
		}).then(function(user){

			user.set('password', 'correct');
			return user.save();

		}).then(function(user){

			if (user.passwordEquals('correct')) { done(); }

		}).catch(function(err){
			done(new Error(err));
		});

	});

	it('should delete user "axel.dolce@gmail.com".', function(done){

		User.destroy({
			where : { username : 'axel.dolce@gmail.com' }
		}).then(function(){
			done();
		}).catch(function(err){
			done(new Error(err));
		});

	});

});