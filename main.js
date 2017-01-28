

var MyCreep = require('MyCreep');
var CreepHarvester = require('CreepHarvester');
var CreepCarrier = require('CreepCarrier');
var CreepBuilder = require('CreepBuilder');
var CreepUpgrader = require('CreepUpgrader');
var CreepSoldier = require('CreepSoldier');
var CreepShooter = require('CreepShooter');
var MySpawn = require('MySpawn');

module.exports.loop = function () {

	// error checking
	for(var name in Memory.creeps) {
		if(!Game.creeps[name]) {
			if(Memory.creeps[name].role == 'harvester'){
				Memory.resource[Memory.creeps[name].destiny]--;
			}
			delete Memory.creeps[name];
			console.log('Clearing non-existing creep memory:', name);
		}
	}

	if(!Memory.resource) Memory.resource = {};

	var rooms = {};

 	for(var n in Game.spawns) {
		var s = Game.spawns[n];
		// this.spawns.push(s);
		if(!rooms[s.room.name]){
			rooms[s.room.name] = [s.room, s, new MySpawn(s)];
		}
	}

	//set up max creeps per resource
	if(!Memory.maxResource) {
		Memory.maxResource = {};
		for(var roomname in rooms){
			var r = rooms[roomname][0];
			var sources = r.find(FIND_SOURCES);
			for(var i in sources){
				var source = sources[i];
				Memory.maxResource[source.id] = 3;
			}
		}
	}

	for(var r in rooms){
		var room = rooms[r];
		// var source = room[0].find(FIND_SOURCES);


		//tower
		var towers = room[0].find(FIND_MY_STRUCTURES, {filter:{structureType:STRUCTURE_TOWER}});
		for(var t in towers){
			var tower = towers[t];
			var hostile =  tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if(hostile){
				towers[t].attack(hostile);
			} else if(towers[t].energy > towers[t].energyCapacity/3){
				var repair = tower.pos.findClosestByRange(FIND_STRUCTURES, {
										filter: function(object) {
											return object.hits < object.hitsMax/4
												&& object.hitsMax - object.hits > REPAIR_POWER;
										}
									});
				if(repair){
					towers[t].repair(repair);
				}
			}
		}

		for(name in Game.creeps) {
			var creep = Game.creeps[name];
			if(creep.memory.role == 'harvester') {
				new CreepHarvester(Game.creeps[name], room[0], room[1], room[2]);
			}
			else if(creep.memory.role == 'carrier') {
				new CreepCarrier(Game.creeps[name], room[0], room[1], room[2]);
			}
			else if(creep.memory.role == 'builder') {
				new CreepBuilder(Game.creeps[name], room[0], room[1], room[2]);
			}
			else if(creep.memory.role == 'upgrader') {
				new CreepUpgrader(Game.creeps[name], room[0], room[1], room[2]);
			}
			else if(creep.memory.role == 'soldier') {
				new CreepSoldier(Game.creeps[name], room[0], room[1], room[2]);
			}
			else if(creep.memory.role == 'shooter') {
				new CreepShooter(Game.creeps[name], room[0], room[1], room[2]);
			}
		}
	}
	
};