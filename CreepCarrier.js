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
 //Game.spawns.Spawn1.createCreep([MOVE,MOVE,CARRY,MOVE,CARRY], 'carrier' + Math.floor(Math.random()*1000), {role:'carrier'});

 class CreepCarrier extends MyCreep{
	getNearestContainer(){
		return this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (container) => {
						return container.structureType == STRUCTURE_CONTAINER;// && container.store < container.storeCapacity;
					}
			});
	}

	getNearestExtension(){
		return this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (container) => {
						return container.structureType == STRUCTURE_EXTENSION && container.energy < container.energyCapacity;
					}
			});
	}
	
	getNearestTower(){
		return this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (tower) => {
						return tower.structureType == STRUCTURE_TOWER && tower.energy < tower.energyCapacity/2;// && container.store < container.storeCapacity;
					}
			});
	}

	getNearestStructureWithoutEnergy(){
		return this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) 
							&& structure.energy < structure.energyCapacity) || 
						(structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < structure.storeCapacity);
					}
			});
	}

	getNearestHarvester(){
		return this.creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter : (source) => {
										return source.memory.role == 'harvester'}});
	}

	getNearestContainerWithEnergy(){
		return this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (container) => {
						return container.structureType == STRUCTURE_CONTAINER && container.store > 0;
					}
			});
	}

 	act(){
 		if(!this.destiny) this.destiny = this.spawn.id;
 		if(!this.action) this.action = MyCreep.ACTION.NOTHING;

 		if(this.isEnergyHalfFull() && this.action != MyCreep.ACTION.DELIVER){

 			this.action = MyCreep.ACTION.DELIVER;
 			if(this.spawn.energy < this.spawn.energyCapacity){
 				this.destiny = this.spawn.id;
 			}
 			else {
    			//tower
     		    var target = this.getNearestExtension();
 		        // if(target) console.log(target, this.creep.name);
 		        //or container
 				if(!target) target = this.getNearestTower();
     		    if(!target) target = this.getNearestContainer();
 					// console.log('deliver to ' + target);
 				if(target){
 					this.action = MyCreep.ACTION.DELIVER;
 					this.destiny = target.id;
 				} else {
 					this.action = MyCreep.ACTION.MOVE;
 					this.destiny = this.spawn.id;
 				}
 			}
 		} else if(!this.isEnergyHalfFull() && this.action != MyCreep.ACTION.PICKUP){
 			if(this.room.energyAvailable < this.room.energyCapacityAvailable * 0.5){
 				var container = this.getNearestContainerWithEnergy();
 				if(container){
		 			this.action = MyCreep.ACTION.PICKUP;
		 			this.destiny = container.id;
 				}
 			}
 			if(this.action != MyCreep.ACTION.PICKUP && this.getNearestPickup() != MyCreep.ACTION.NOTHING){
	 			this.action = MyCreep.ACTION.PICKUP;
	 		} else if(this.action != MyCreep.ACTION.MOVE){
	 			this.action = MyCreep.ACTION.MOVE;
	 			this.destiny = this.getNearestHarvester().id;
	 		}
 		}

 		return this.doAction();
 	}
}

module.exports = CreepCarrier;

