/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Creep');
 * mod.thing == 'a thing'; // true
 */

 var CONFIG = require('CONFIG');
 var MyCreep = require('MyCreep'); 
 //Game.spawns.Spawn1.createCreep([WORK,WORK,MOVE,CARRY], 'builder' + Math.floor(Math.random()*1000), {role:'builder'});


 class CreepSoldier extends MyCreep{

 	hostileCreeps(){
 		return this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
 	}

	act(){
		if(!this.destiny){
			this.destiny = this.room.controller.id;
		}

		var hc = this.hostileCreeps();
		if(hc){
			this.destiny = hc.id;
			this.action = MyCreep.ACTION.ATTACK;
		} else {
			this.destiny = this.room.controller.id;
			this.action = MyCreep.MOVE;
		}

		return this.doAction();
	}
}

module.exports = CreepSoldier;

