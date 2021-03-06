import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
 
import { Rooms } from '../api/server.js';
 
import './room.html';

Template.room.helpers({
	// Calculates who is the opponent
	'getOpponent':function(currentUser){
		// Create empty array
		var opponents = [];
		// Get all rooms where the user is in
		var rooms = Rooms.find({users: currentUser}).fetch();
		// Loop through all rooms
		for (var i = 0; i < rooms.length; i++) {
			// Get user array which contains two values
			var users = rooms[i].users;
			// Delete the value of the current user so you know who the opponent is
			var index = users.indexOf(currentUser);
    		users.splice(index, 1);
    		// Get username with the userId
    		var user = Meteor.users.findOne({_id: users[0]});
        	var username = user.username;
        	// Push the username to opponents array
    		rooms[i].opponent = username;
		}
		return rooms;
	},
	'getOpponentId':function(currentRoom){
		// Find the right room
		var rooms = Rooms.findOne({_id: currentRoom});
		// Get user array which contains two values
		var users = rooms.users;
		// Delete the value of the current user so you know who the opponent is
		var index = users.indexOf(Meteor.userId());
		users.splice(index, 1);

		return users[0];
	},
	'ifActive':function(_id) {
		return this._id === Session.get('roomID');
	},
	'ifTurn': function() {
		var currentRoom = Rooms.findOne({_id: this._id});
		if (currentRoom.game[currentRoom.game.length - 1].players.turn == Meteor.userId()) {
			return true;
		}
	}
});