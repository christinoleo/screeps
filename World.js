
class World{
	constructor(){
		if(!Memory.rooms) {
			Memory.rooms = {};
		}

	}

	initRooms(){
		Memory.rooms = {};


	 	for(var n in Game.spawns) {
			var s = Game.spawns[n];
			if(!Memory.rooms[s.room.name]){
				Memory.rooms[s.room.name].name = s.room.name;
				Memory.rooms[s.room.name].spawn = s.id;
				Memory.rooms[s.room.name].controller = s.room.controller.id;
				initResources(s.room.name);
			}
		}
	}

	initResources(room){
		if(!Memory.rooms[room].resources) 
			Memory.rooms[room].resources = {};

		//set up max creeps per resource
		if(!Memory.rooms[room].maxResource) {
			Memory.rooms[room].maxResource = {};
			var sources = Game.rooms[room].find(FIND_SOURCES);
			for(var i in sources){
				var source = sources[i];
				Memory.rooms[room].maxResource[source.id] = 3;
				Memory.rooms[room].resources[source.id] = 0;
			}
		}

	}

	garbageCollection(){
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
	}
}


module.exports = World;