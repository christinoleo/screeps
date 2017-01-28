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


 class CreepUpgrader extends MyCreep{
	getNearestContainerWithEnergy(){
		return this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (container) => {
						return container.structureType == STRUCTURE_CONTAINER && container.store[RESOURCE_ENERGY] > 0;
					}
			});
	}

	getNearbyCreepsWithEnergy(){
		return this.creep.pos.findInRange(FIND_CREEPS, 1, {
					filter: (creep) => {
						return creep.carry.energy > 0 && creep.memory.role != 'builder' && creep.memory.role != 'upgrader';
					}
			});
	}

	getNearbyConstructionSites(){
		return this.creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	}

	act(){
		if(!this.destiny){
			this.destiny = this.spawn.id;
		}
		
		// repair nerby stuff
 		var repairTargets = this.creep.pos.findInRange(this.myspawn.structures, 1);
		if (repairTargets.length > 0)
			this.creep.repair(repairTargets[0]);
		
		if(this.isEnergyFull() && this.action != MyCreep.ACTION.DELIVER){
			//do stuff
			this.destiny = this.room.controller.id;
			this.action = MyCreep.ACTION.DELIVER;
			
		} else if (this.isEnergyEmpty() || this.action == MyCreep.ACTION.NOTHING){
			// get more energy
			var creeps = this.getNearbyCreepsWithEnergy();
			if(creeps.length > 0){
				this.destiny = creeps[0].id;
				this.action = MyCreep.ACTION.WITHDRAW;
			} else if(this.action != MyCreep.ACTION.PICKUP){
				var container = this.getNearestContainerWithEnergy();
				if(container){
					this.destiny = container.id;
					this.action = MyCreep.ACTION.PICKUP;
				} else {
					this.destiny = this.spawn.id;
					this.action = MyCreep.ACTION.PICKUP;
				}
			}

		}

		return this.doAction();
	}
}

module.exports = CreepUpgrader;

