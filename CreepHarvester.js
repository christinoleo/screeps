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
 //Game.spawns.Spawn1.createCreep([WORK,WORK,MOVE,CARRY], 'harvester' + Math.floor(Math.random()*1000), {role:'harvester'});


 class CreepHarvester extends MyCreep{
 	act(){
 		var repairTargets = this.creep.pos.findInRange(this.myspawn.structures, 1);
		if (repairTargets.length > 0)
			this.creep.repair(repairTargets[0]);


 		if(!this.destiny || Memory.resource[this.destiny] > Memory.maxResource[this.destiny]){
 		    var harvest_destiny = this.getNearestHarvest();
 		    if(harvest_destiny){
     			if(Memory.resource[this.destiny] > Memory.maxResource[this.destiny]) Memory.resource[this.destiny]--;
     			this.destiny = harvest_destiny.id;
     			if(!Memory.resource[this.destiny]) Memory.resource[this.destiny] = 1;
     			else Memory.resource[this.destiny]++;
 		    }
 		}

 		this.resource = Game.getObjectById(this.destiny);
 		
 		if(this.isEnergyFull()){
 			if(this.myspawn.population['carrier'] == 0) this.deliver(this.spawn);
 			else this.drop();
 		} else this.harvest(this.resource);
 	}
}

module.exports = CreepHarvester;

