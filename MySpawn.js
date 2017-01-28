
var CONFIG = require('CONFIG');


class MySpawn{
	badStructures(){
		return this.room.find(FIND_STRUCTURES, {
			filter: function(object) {
				return object.hits < object.hitsMax/2
					&& object.hitsMax - object.hits > REPAIR_POWER;
			}
		});
	}

	constructor(spawn){
		this.spawn = spawn;
		this.room = spawn.room;
		this.populationSize = Object.keys(Game.creeps).length;
		this.structures = this.badStructures();


		this.population = {};
		this.maxWeight = 0;
		for(var name in CONFIG.CreeperTypes){
			this.population[name] = 0;
		}

		for(var name in Game.creeps){
		    // console.log(this.population);
			var creep = Game.creeps[name];
			this.population[Game.creeps[name].memory.role]++;
			if(this.population[Game.creeps[name].memory.role] == 1)
				this.maxWeight += CONFIG.CreeperPopulation[CONFIG.CreeperTypes[Game.creeps[name].memory.role]].weight;
		}

 		// if(!this.population['harvester'] || this.population['harvester'] == 0){
			// var type = 'harvester';
 		// 	var skills = this.generateSkill(0);
			// console.log('Urgent!! Creating ' + type + ' with ' + skills);

			// var error = spawn.createCreep(skills, type + Math.floor((Math.random()*1000)), {role: type, type: type});
 		// } else
 		 if(this.checkIfPopulate()){

			this.extensions = this.room.find(FIND_MY_STRUCTURES, {filter : {structureType: STRUCTURE_EXTENSION}});

			for(var type in CONFIG.CreeperTypes){
				// console.log(this.checkIfCreateCreep(type));
				if(this.checkIfCreateCreep(type)){
					var skills = this.generateSkill(CONFIG.CreeperTypes[type]);
					console.log('Creating ' + type + ' with ' + skills);

					var error = spawn.createCreep(skills, type + Math.floor((Math.random()*1000)), {role: type, type: type});
					if(error < OK)console.log('error creating creep! ' + error + skills);
					return;
				}
			}
		}
		else if(true){
			this.extensions = this.room.find(FIND_MY_STRUCTURES, {filter : {structureType: STRUCTURE_EXTENSION}});
			for(var type in CONFIG.CreeperTypes){
				// console.log(this.checkIfCreateCreep(type));
				if(this.checkIfCreateCreep(type)){
					var skills = this.generateSkill(CONFIG.CreeperTypes[type]);
					console.log('Next to create:' + type + ' with ' + skills);
					return;
				}
			}
		}
	}

	checkIfPopulate(){
		if(this.spawn && this.room.energyAvailable == this.room.energyCapacityAvailable){
 			if(this.populationSize < CONFIG.CreeperMaxPopPerRoom){
		 		// console.log('Populate!');
		 		return true;
		 	} 
		 	// else console.log('Max reached');
	 	} 
	 	// else console.log('Not enough energy');
	 	return false;
	}

	checkIfCreateCreep(type){
		// console.log(type);
		var typeNum = CONFIG.CreeperTypes[type];
		var config = CONFIG.CreeperPopulation[typeNum];
		if(!this.population[type]) this.population[type] = 0;

		// console.log(this.population[type] >= config.max, this.room.controller.level < config.minLevel,
		// 	this.extensions.length, config.minExtensions > this.extensions.length,
		// 	config.weight/this.maxWeight < this.population[type]/this.populationSize,
		// 	type, config.weight, 
		// 	this.maxWeight, 
		// 	this.population[type], 
		// 	this.populationSize, 
		// 	config.weight/this.maxWeight, this.population[type]/this.populationSize);

		if(this.population[type] >= config.max) return false;
		if(this.room.controller.level < config.minLevel) return false;
		if(config.minExtensions > this.extensions.length) return false;
		if(config.weight/this.maxWeight < this.population[type]/this.populationSize) return false;
		return true;

	}

 	generateSkill(type){
  		// console.log(type + ' ' + skills);
		var config = CONFIG.CreeperPopulation[type];

 		var total_skill = 0;
 		for(var skill_weight_id = 0; skill_weight_id < 8; skill_weight_id++){
 			total_skill += config.skillWeights[skill_weight_id];
  		}

 		var energy_required = 0;
 		for(var i = 0; i < 8; i++){
 			energy_required += config.skillWeights[i]/total_skill * BODYPART_COST[CONFIG.BodyParts[i]];
 		}
 		// energy_required = Math.floor(energy_required);
 		var size = this.room.energyAvailable / energy_required;

 		var skills = [];
 		var total_cost = 0;
 		for(skill_weight_id = 0; skill_weight_id < 8; skill_weight_id++){
 			// var num_of_inputs = Math.floor(Math.round(300 * config.skillWeights[skill_weight_id]/ total_skill) / BODYPART_COST[CONFIG.BodyParts[skill_weight_id]]);

 			var num_of_inputs = Math.round(config.skillWeights[skill_weight_id] * size / total_skill);
 			var new_total_cost = total_cost + num_of_inputs*BODYPART_COST[CONFIG.BodyParts[skill_weight_id]]
 			if(new_total_cost > this.room.energyAvailable) {
				num_of_inputs--;
				total_cost += num_of_inputs*BODYPART_COST[CONFIG.BodyParts[skill_weight_id]];
			} else total_cost = new_total_cost;
 			for(i = 0; i < num_of_inputs; i++) skills.push(CONFIG.BodyParts[skill_weight_id]);
  		}

  		// console.log(total_cost, this.room.energyAvailable, energy_required, size, total_skill, 5*size/total_skill);
 		return skills;
 	}
}


module.exports = MySpawn;