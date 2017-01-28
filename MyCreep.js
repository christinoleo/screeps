/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Creep');
 * mod.thing == 'a thing'; // true
 */

// var Config = require('Config');


class MyCreep{

	constructor(creep, room, spawn, myspawn){
		MyCreep.ACTION = {
			NOTHING:-1,
			MOVE:0,
			DELIVER:1,
			HARVEST:2,
			PICKUP:3,
			BUILD:4,
			REPAIR:5,
			WITHDRAW:6,
			DEFEND:7,
			ATTACK:8,
			SHOOT:9
		};

		this.room = room;
		this.spawn = spawn;
		this.creep = creep;
		this.myspawn = myspawn;

		this.role = this.load('role');
		this.id = creep.id;

		this.destiny = this.load('destiny');
		this.action = this.load('action');
		if(!this.action) this.action = MyCreep.ACTION.NOTHING;

		var res = this.act();
		if(res == MyCreep.ACTION.NOTHING) this.action = res;
		this.save('destiny', this.destiny);
		this.save('action', this.action);
	}

	act(){}

	save(key, value){
		this.creep.memory[key] = value;
	}

	load(key){
		return this.creep.memory[key];
	}

	getNearestStructure(find_flag, structures){
		return this.creep.pos.findClosestByRange(find_flag, {
					filter: (structure) => {
						return structures.indexOf(structure.structureType) != -1;
					}
			});
	}

	getNearestStructureWithEnergy(find_flag, structures){
		return this.creep.pos.findClosestByRange(find_flag, {
					filter: (structure) => {
						return structures.indexOf(structure.structureType) != -1 &&
							structure.energy == structure.energyCapacity;
					}
			});
	}

	getNearestHarvest(){
		return this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {filter : (source) => {
										return !Memory.resource[source.id] || 
											(Memory.resource[source.id] < Memory.maxResource[source.id])}});
	}

	say(text){
		this.creep.say(text);
	}

	isEnergyFull(){
		return this.creep.carry.energy == this.creep.carryCapacity;
	}

	isEnergyEmpty(){
		return this.creep.carry.energy == 0;
	}

	isEnergyHalfFull(){
		return this.creep.carry.energy > this.creep.carryCapacity * 0.5;
	}

	goToNearestHarvest(){
		var target = this.getNearestHarvest();
		if(target){
			this.destiny = target;
			this.creep.moveTo(target);
			return MyCreep.ACTION.MOVE;
		} else return MyCreep.ACTION.NOTHING;
	}

	harvest(gameObject){
		if(gameObject instanceof Source){
			if(this.creep.harvest(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.HARVEST;
		}
		return MyCreep.ACTION.NOTHING;
	}

	deliver(gameObject){
		if(gameObject instanceof Source){
			if(this.creep.harvest(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.DELIVER;
		} else if (gameObject instanceof StructureController){
			if(this.creep.transfer(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.DELIVER;
		} else if (gameObject instanceof StructureSpawn){
			if(this.creep.transfer(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.NOTHING;
		} else if (gameObject instanceof StructureStorage){
			if(this.creep.transfer(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.NOTHING;
		} else if (gameObject instanceof StructureTower){
			if(this.creep.transfer(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.NOTHING;
		} else if (gameObject instanceof StructureExtension){
			if(this.creep.transfer(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.NOTHING;
		} else if (gameObject instanceof StructureContainer){
			if(this.creep.transfer(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.NOTHING;
		} else if (gameObject instanceof ConstructionSite){
			if(this.creep.build(gameObject) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.DELIVER;
		} else if (gameObject instanceof Creep){
			if(this.creep.transfer(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.NOTHING;
		} else return MyCreep.ACTION.NOTHING;
	}

	deliverNearby(){
		// repair/build nerby stuff
		var buildTargets = this.creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
		if(buildTargets.length > 0){
			this.creep.build(buildTargets[0]);
			return MyCreep.ACTION.BUILD;
		}

		var repairTargets = this.creep.pos.findInRange(FIND_STRUCTURES, 1, {
			filter: function(object) {
				return object.hits < object.hitsMax && object.hitsMax - object.hits > REPAIR_POWER;
			}
		});

		if (repairTargets.length > 0){
			// repairTargets.sort(function (a,b) {return (a.hits - b.hits)});
			this.creep.repair(repairTargets[0]);
			return MyCreep.ACTION.REPAIR;
		}

		return MyCreep.ACTION.NOTHING;
	}

	drop(){
		this.creep.drop(RESOURCE_ENERGY);
		return MyCreep.ACTION.NOTHING;
	}

	getNearestPickup(){
		var target = this.creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
		if(target) {
			this.destiny = target.id;
			this.action = MyCreep.ACTION.PICKUP;
			return MyCreep.ACTION.PICKUP;
		} else {
			// target = this.creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			// 		filter: (creep) => {
			// 			return creep.memory.role == 'harvest';
			// 		});
			// if(target){
			// 	this.destiny = target;
			// 	this.action = ACTION.PICKUP;
			// 	return ACTION.PICKUP;
			// }
		}
		return MyCreep.ACTION.NOTHING;
	}

	pickup(gameObject){
		if(gameObject instanceof Resource){
			if(this.creep.pickup(gameObject) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.PICKUP;
		} else if(gameObject instanceof Creep){
			if(gameObject.transfer(this.creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				// this.creep.moveTo(gameObject);
				return MyCreep.ACTION.NOTHING;
			} else return MyCreep.ACTION.PICKUP;
		}else if(gameObject instanceof StructureContainer || gameObject instanceof StructureSpawn){
			if(this.creep.withdraw(gameObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.PICKUP;
		}
		return MyCreep.ACTION.NOTHING;
	}

	attack(gameObject){
		if(this.creep.attack(gameObject) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(gameObject);
				return MyCreep.ACTION.MOVE;
		} else return MyCreep.ACTION.ATTACK;
	}

	shoot(gameObject, action){
			if(this.creep.rangedAttack(gameObject) == ERR_NOT_IN_RANGE) {
					this.creep.moveTo(gameObject);
					return MyCreep.ACTION.MOVE;
			} else return MyCreep.ACTION.ATTACK;
	}

	defend(gameObject, action){
			if(this.creep.attack(gameObject) == ERR_NOT_IN_RANGE) {
				return MyCreep.ACTION.NOTHING;
			} else return MyCreep.ACTION.ATTACK;
	}

	doAction(){
		this.room.createConstructionSite(this.creep.pos, STRUCTURE_ROAD);
		switch(this.action){
			case MyCreep.ACTION.MOVE:
				return this.creep.moveTo(Game.getObjectById(this.destiny));
			case MyCreep.ACTION.BUILD:
			case MyCreep.ACTION.REPAIR:
			case MyCreep.ACTION.DELIVER:
				return this.deliver(Game.getObjectById(this.destiny));
			case MyCreep.ACTION.HARVEST:
				return this.harvest(Game.getObjectById(this.destiny));
			case MyCreep.ACTION.PICKUP:
			case MyCreep.ACTION.WITHDRAW:
				return this.pickup(Game.getObjectById(this.destiny));
			case MyCreep.ACTION.ATTACK:
				return this.attack(Game.getObjectById(this.destiny));
			case MyCreep.ACTION.SHOOT:
				return this.shoot(Game.getObjectById(this.destiny));
			case MyCreep.ACTION.DEFEND:
				return this.defend(Game.getObjectById(this.destiny));
		}
	}

}

module.exports = MyCreep;

