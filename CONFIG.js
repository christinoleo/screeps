/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Config');
 * mod.thing == 'a thing'; // true
 */

const CreeperTypes = {
	harvester:0,
	carrier:1,
	builder:2,
	upgrader:3,
	soldier:4,
	shooter:5,
	healer:6
};

var BodyParts = [
	"tough",
	"work",
	"carry",
	"move",
	"attack",
	"ranged_attack",
	"heal",
	"claim"
];

var CreeperPopulation = [
		{//harvester
			weight: 0.20,
			max: 4,
			minExtensions: 0,
			minLevel:0,
			skillWeights:[0,6,2,3,0,0,0,0]
		},
		{//carrier
			weight: 0.30,
			max: 8,
			minExtensions: 0,
			minLevel:0,
			skillWeights:[0,0,3,2,0,0,0,0]
		},
		{//builder
			weight: 0.20,
			max: 8,
			minExtensions: 0,
			minLevel:2,
			skillWeights:[0,6,2,3,0,0,0,0]
		},
		{//upgrader
			weight: 0.0000000001,
			max: 1,
			minExtensions: 0,
			minLevel:0,
			skillWeights:[0,6,2,3,0,0,0,0]
		},
		{//soldier
			weight: 0.15,
			max: 1,
			minExtensions: 2,
			minLevel:2,
			skillWeights:[1,0,0,1,2,0,0,0]
		},
		{//shooter
			weight: 0.10,
			max: 1,
			minExtensions: 5,
			minLevel:2,
			skillWeights:[3,0,0,4,0,5,0,0]
		},
		{//healer
			weight: 0.05,
			max: 1,
			minExtensions: 2,
			minLevel:5,
			skillWeights:[0,0,0,4,0,0,1,0]
		}
];

var CreeperMaxWeight = 1; 

var CreeperMaxPopPerRoom = 13;


const CREEP_ACTION = {
	GATHER:1,
	DELIVER:2
};

module.exports = {CreeperTypes, CreeperPopulation, CreeperMaxPopPerRoom, BodyParts, CreeperMaxWeight, CREEP_ACTION

};