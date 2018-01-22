'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');

var units = require(path.join(base, 'data/unitsDB.js'));
var cooldowns = require(path.join(base, 'data/cooldownsDB.js'));
var details = require(path.join(base, 'data/detailsDB.js'));
var notes = require(path.join(base, 'data/notesDB.js'));
var drops = require(path.join(base, 'data/dropsDB.js'));
var evolutions = require(path.join(base, 'data/evolutionsDB.js'));
var aliases = require(path.join(base, 'data/aliasesDB.js'));

function getStats(id) {
	if (units[id - 1] && units[id - 1][0]) {
		var normal_stars = '⭐⭐⭐⭐⭐⭐️';
		var super_stars = '🌟🌟🌟🌟🌟🌟';
		var unit = units[id - 1];
		var stars = unit[3];
		var stars_plus = false;
		if (typeof stars !== 'number') {
			stars = parseInt(stars[0]);
			stars_plus = true;
		}
		var unit_stars;
		if (stars_plus) {
			unit_stars = (stars === 6) ? super_stars + '\u2795' : normal_stars.substr(0, stars) + '\u2795';
		} else {
			unit_stars = (stars === 6) ? super_stars : normal_stars.substr(0, stars);
		}
		var unit_incomplete = (unit.indexOf(null) > -1),
		unit_name = unit[0],
		unit_type = unit[1],
		unit_class = (Array.isArray(unit[2])) ? unit[2].join(', ') : unit[2],
		unit_cost = unit[4],
		unit_combo = unit[5],
		unit_slots = unit[6],
		unit_max = unit[7],
		unit_exp = unit[8] && unit[8].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
		unit_max_hp = unit[12],
		unit_max_atk = unit[13],
		unit_max_rcv = unit[14],
		response = (unit_incomplete === true) ? '<b>Note:</b> This unit is not yet released or incomplete! The information provided may not be accurate and is subject to change.\n\n' : '';
		unit_type = (unit_type === 'STR') ? '\u2764\uFE0F STR' : unit_type;
		unit_type = (unit_type === 'QCK') ? '\uD83D\uDC99 QCK' : unit_type;
		unit_type = (unit_type === 'DEX') ? '\uD83D\uDC9A DEX' : unit_type;
		unit_type = (unit_type === 'PSY') ? '\uD83D\uDC9B PSY' : unit_type;
		unit_type = (unit_type === 'INT') ? '\uD83D\uDC9C INT' : unit_type;
		var unit_details = details[id];
		var addSocket = 0;
		var addHP = 0;
		var addATK = 0;
		var addRCV = 0;
		if(unit_details && unit_details.hasOwnProperty('limit') && Array.isArray(unit_details.limit)){
			
			unit_details.limit.forEach(function(desc,index){
				if(desc.description.includes("Aquire 1 additional Socket slot")){
					addSocket += 1;
				}
				else if (desc.description.includes("Boosts base HP by ")){
					addHP = desc.description.substr(desc.description.lastIndexOf(" ")+1);
				}
				else if (desc.description.includes("Boosts base ATK by ")){
					addATK = desc.description.substr(desc.description.lastIndexOf(" ")+1);
				}
				else if (desc.description.includes("Boosts base RCV by ")){
					addRCV = desc.description.substr(desc.description.lastIndexOf(" ")+1);
				}
			});
		}
		response += '<b>U N I T   # ' + id.toString().split('').join(' ') + '</b>\n\n';
		response += '<b>' + unit_name + '</b>\n\n';
		response += '<b>D E T A I L S</b>\n\n';
		response += '<code>STARS </code>' + unit_stars + '\n';
		response += '<code>CLASS </code>' + unit_class + '\n';
		response += '<code> TYPE </code>' + unit_type + '\n';
		response += '<code>  MAX </code>' + unit_max + ' (' + unit_exp + ' EXP)\n';
		response += '<code>   HP </code>' + unit_max_hp;
		response += addHP !== 0 ? " (+"+addHP+")" +'\n' :'\n';
		response += '<code>  ATK </code>' + unit_max_atk;
		response += addATK !== 0 ? " (+"+addATK+")" +'\n' :'\n';
		response += '<code>  RCV </code>' + unit_max_rcv;
		response += addRCV !== 0 ? " (+"+addRCV+")" +'\n' :'\n';
		response += '<code> COST </code>' + unit_cost + '\n';
		response += '<code>COMBO </code>' + unit_combo + '\n';
		response += '<code>SLOTS </code>' + unit_slots;
		response += addSocket !== 0 ? " (+"+addSocket+")" +'\n\n' :'\n\n';
		return response;
	}
	return false;
}

function getDetail(id, detail) {
	var unit_details = details[id];
	if (detail === 'captain') {
		var unit_captain = unit_details && unit_details.captain || '';
		if (unit_captain != '' && unit_captain.hasOwnProperty('japan')) {
			unit_captain = unit_captain.japan + ' ' + unit_captain.global;
		}
		else if(unit_captain != '' && unit_captain.hasOwnProperty('base')) {
			unit_captain = unit_captain.base;
		}
		return unit_captain.replaceEntities() || false;
	}
	if (detail === 'sailor') {
		var unit_sailor = unit_details && unit_details.sailor || '';
		if (unit_sailor != '' && unit_sailor.hasOwnProperty('japan')) {
			unit_sailor = unit_sailor.japan + ' ' + unit_sailor.global;
		}
		else if (unit_sailor != '' && unit_sailor.hasOwnProperty('base')) {
			unit_sailor = unit_sailor.base;
		}
		return unit_sailor.replaceEntities() || false;
	}
	if (detail === 'special') {
		var unit_special = unit_details && unit_details.special || '';
		if (unit_special && unit_special.hasOwnProperty('japan')) {
			unit_special = unit_special.japan + ' ' + unit_special.global;
		}
		return unit_special.replaceEntities() || false;
	}
}

function getCaptainAbility(id) {
	var unit_details = details[id],
	unit_captain = unit_details && unit_details.captain;

	if(unit_captain && unit_captain.hasOwnProperty('base')){
		var unit_details = details[id],
		unit_captain = unit_details && unit_details.captain,
		unit_captain_base = unit_captain && unit_captain.hasOwnProperty('base') && unit_captain.base,
		unit_captain_level6 = unit_captain && unit_captain.hasOwnProperty('level6') && unit_captain.level6,
		unit_captain_level5 = unit_captain && unit_captain.hasOwnProperty('level5') && unit_captain.level5,
		unit_captain_level4 = unit_captain && unit_captain.hasOwnProperty('level4') && unit_captain.level4,
		unit_captain_level3 = unit_captain && unit_captain.hasOwnProperty('level3') && unit_captain.level3,
		unit_captain_level2 = unit_captain && unit_captain.hasOwnProperty('level2') && unit_captain.level2,
		unit_captain_level1 = unit_captain && unit_captain.hasOwnProperty('level1') && unit_captain.level1,
		unit_captain_japan = unit_captain && unit_captain.hasOwnProperty('japan') && unit_captain.japan,
		unit_captain_global = unit_captain && unit_captain.hasOwnProperty('global') && unit_captain.global,
		response;
		response = '<b>Captain Ability[LB]:</b>\n';
		response += (unit_captain_base !== false) ? '<code>Base:</code> ' + unit_captain_base.replaceEntities() + '\n' : unit_captain.replaceEntities() + '\n\n';
		response += (unit_captain_level6 !== false) ? '<code>Limit Break 6:</code> ' + unit_captain_level6.replaceEntities() + '\n\n' : 
		(unit_captain_level5 !== false) ? '<code>Limit Break 5:</code> ' + unit_captain_level5.replaceEntities() + '\n\n' : 
		(unit_captain_level4 !== false) ? '<code>Limit Break 4:</code> ' + unit_captain_level4.replaceEntities() + '\n\n' : 
		(unit_captain_level3 !== false) ? '<code>Limit Break 3:</code> ' + unit_captain_level3.replaceEntities() + '\n\n' : 
		(unit_captain_level2 !== false) ? '<code>Limit Break 2:</code> ' + unit_captain_level2.replaceEntities() + '\n\n' :
		(unit_captain_level1 !== false) ? '<code>Limit Break 1:</code> ' + unit_captain_level1.replaceEntities() + '\n\n' : 
		(unit_captain_japan !== false) ? '<code>Japan:</code> ' + unit_captain_japan.replaceEntities() + '\n' + '<code>Global:</code> ' + unit_captain_global.replaceEntities() + '\n\n' :
		unit_captain.replaceEntities() + '\n\n';
		return response;
	}
	else{
		var unit_details = details[id],
		unit_captain = unit_details && unit_details.captain,
		unit_captain_japan = unit_captain && unit_captain.hasOwnProperty('japan') && unit_captain.japan,
		unit_captain_global = unit_captain && unit_captain.hasOwnProperty('global') && unit_captain.global,
		response;
		if (unit_captain) {
			response = '<b>Captain Ability:</b>\n';
			response += (unit_captain_japan !== false) ? '<code>Japan:</code> ' + unit_captain_japan.replaceEntities() + '\n' + '<code>Global:</code> ' + unit_captain_global.replaceEntities() + '\n\n' : unit_captain.replaceEntities() + '\n\n';
			return response;
		}
	}
	return false;
}

function getSpecialAbility(id) {
	var unit_details = details[id],
	unit_special_name = unit_details && unit_details.specialName,
	unit_special = unit_details && unit_details.special,
	unit_special_japan = unit_special && unit_special.hasOwnProperty('japan') && unit_special.japan,
	unit_special_global = unit_special && unit_special.hasOwnProperty('global') && unit_special.global,
	response;
	if (unit_special) {
		response = '<b>Special:</b>\n';
		response += '<i>' + unit_special_name + '</i>\n';
		if (Array.isArray(unit_special)) {
			unit_special.forEach(function(special, index) {
				response += '<b>Stage ' + (index + 1) + '</b> - ' + (Array.isArray(special.cooldown) ? special.cooldown[0] + ' (' + special.cooldown[1] + ')' : special.cooldown) + ' turns:\n' + special.description.replaceEntities() + '\n';
			});
			response += '\n';
		} else {
			response += (unit_special_japan !== false) ? '<code>Japan:</code> ' + unit_special_japan.replaceEntities() + '\n' + '<code>Global:</code> ' + unit_special_global.replaceEntities() + '\n\n' : unit_special.replaceEntities() + '\n\n';
		}
		return response;
	}
	return false;
}

function getNotes(note) {
	if (note) {
		return '<i>Notes:\n' + note.trim().replace(/#\{(.+?)\}/g, function(x, y) {
			var tokens = y.trim().split(/:/);
			if (!tokens.length || !notes.hasOwnProperty(tokens[0].trim())) {
				return x;
			}
			return notes[tokens[0].trim()].replace(/#(\d+)/g, function(a, b) {
				return (tokens[parseInt(b)] || '').trim();
			});
		}).replaceEntities() + '</i>\n\n';
	}
	return false;
}

function getCooldowns(id) {
	var unit_cooldown = cooldowns[id - 1],
	unit_cooldown_min = Array.isArray(unit_cooldown) && unit_cooldown[0],
	unit_cooldown_max = Array.isArray(unit_cooldown) && unit_cooldown[1];
	var minusCD = 0;
	var unit_details = details[id];
	if(unit_details && unit_details.hasOwnProperty('limit') && Array.isArray(unit_details.limit)){
		unit_details.limit.forEach(function(desc,index){
			if (desc.description.includes("Reduce base Special Cooldown by ")){
				minusCD += parseInt(desc.description.replace(/\D/g,'').replace(/\s/,''));
			}
		});
	}

	if (unit_cooldown) {
		var response =  (unit_cooldown_min && (unit_cooldown_min !== unit_cooldown_max)) ? 'Cooldown: ' + unit_cooldown_min + ' (' + unit_cooldown_max + ')' : 'Cooldown: ' + (unit_cooldown_min || unit_cooldown);
		response += (unit_cooldown_min && (unit_cooldown_min !== unit_cooldown_max) && minusCD !== 0) ? " (LB: "+ (unit_cooldown_max - minusCD) +")\n\n" : "\n\n";
		return response;
	}
	return false;
}

function getSailorAbility(id) {
	var unit_details = details[id],
	unit_sailor = unit_details && unit_details.sailor;

	if(unit_sailor && unit_sailor.hasOwnProperty('base')){
		var unit_details = details[id],
		unit_sailor = unit_details && unit_details.sailor,
		unit_sailor_base = unit_sailor && unit_sailor.hasOwnProperty('base') && unit_sailor.base,
		unit_sailor_level6 = unit_sailor && unit_sailor.hasOwnProperty('level6') && unit_sailor.level6,
		unit_sailor_level5 = unit_sailor && unit_sailor.hasOwnProperty('level5') && unit_sailor.level5,
		unit_sailor_level4 = unit_sailor && unit_sailor.hasOwnProperty('level4') && unit_sailor.level4,
		unit_sailor_level3 = unit_sailor && unit_sailor.hasOwnProperty('level3') && unit_sailor.level3,
		unit_sailor_level2 = unit_sailor && unit_sailor.hasOwnProperty('level2') && unit_sailor.level2,
		unit_sailor_level1 = unit_sailor && unit_sailor.hasOwnProperty('level1') && unit_sailor.level1,
		unit_sailor_japan = unit_sailor && unit_sailor.hasOwnProperty('japan') && unit_sailor.japan,
		unit_sailor_global = unit_sailor && unit_sailor.hasOwnProperty('global') && unit_sailor.global,
		response;

		response = '<b>Sailor[LB]:</b>\n';
		response += (unit_sailor_base !== false) ? '<code>Base:</code> ' + unit_sailor_base.replaceEntities() + '\n' : unit_sailor.replaceEntities() + '\n\n';
		response += (unit_sailor_level1 !== false) ? '<code>Limit Break 1:</code> ' + unit_sailor_level1.replaceEntities() + '\n' : '';
		response += (unit_sailor_level2 !== false) ? '<code>Limit Break 2:</code> ' + unit_sailor_level2.replaceEntities() + '\n' : '' ;
		response += (unit_sailor_level3 !== false) ? '<code>Limit Break 3:</code> ' + unit_sailor_level3.replaceEntities() + '\n' : '' ; 
		response += (unit_sailor_level4 !== false) ? '<code>Limit Break 4:</code> ' + unit_sailor_level4.replaceEntities() + '\n' : '' ; 
		response += (unit_sailor_level5 !== false) ? '<code>Limit Break 5:</code> ' + unit_sailor_level5.replaceEntities() + '\n' : '' ;
		response += (unit_sailor_level6 !== false) ? '<code>Limit Break 6:</code> ' + unit_sailor_level6.replaceEntities() + '\n' : '' ;
		response += '\n';
		response += (unit_sailor_japan !== false) ? '<code>Japan:</code> ' + unit_sailor_japan.replaceEntities() + '\n' + '<code>Global:</code> ' + unit_sailor_global.replaceEntities() + '\n\n' : '';
		return response;
	}
	else{
		var unit_details = details[id],
		unit_sailor = unit_details && unit_details.sailor,
		unit_sailor_japan = unit_sailor && unit_sailor.hasOwnProperty('japan') && unit_sailor.japan,
		unit_sailor_global = unit_sailor && unit_sailor.hasOwnProperty('global') && unit_sailor.global,
		response;
		if (unit_sailor) {
			response = '<b>Sailor:</b>\n';
			response += (unit_sailor_japan !== false) ? '<code>Japan:</code> ' + unit_sailor_japan.replaceEntities() + '\n' + '<code>Global:</code> ' + unit_sailor_global.replaceEntities() + '\n\n' : unit_sailor.replaceEntities() + '\n\n';
			return response;
		}
	}
	return false;
}


function getPotential(id) {
	var unit_details = details[id],
	unit_potential = unit_details && unit_details.potential,
	response;

	if(unit_potential){
		
		response = '<b>Potential:</b>\n';

		unit_potential.forEach(function(potential){
			response += (unit_potential) ? '\t<code>'+potential.Name.replaceEntities() +'</code>\n' :'';
			var desc = potential.description;
			desc.forEach(function(liv,index,array){
				if(index === array.length - 1)
					response += liv ? '\t\t<i>'+liv.replaceEntities() +'</i>\n':''; 
			});
			response+='\n'
		});

		return response;
	}
	return false;
}

function getEvolutions(id, type) {
	var unit_evolutions = evolutions[id],
	unit_evolution = unit_evolutions && unit_evolutions.evolution,
	unit_evolvers = unit_evolutions && unit_evolutions.evolvers,
	unit_evolution_paths = [],
	unit_devolutions = [],
	space = '\u2007\u2007\u2007\u2007',
	response;
	if (unit_evolutions) {
		if (Array.isArray(unit_evolution)) {
			unit_evolution.forEach(function(evolution, evolver) {
				unit_evolution_paths.push([evolution, unit_evolvers[evolver]]);
			});
		} else {
			unit_evolution_paths.push([unit_evolution, unit_evolvers]);
		}
		response = '<b>E V O L U T I O N S</b>\n\n';
		unit_evolution_paths.forEach(function(evolution) {
			response += (type === 'inline') ? '<code>' + space.slice(0, space.length - evolution[0].toString().length) + '</code>' + evolution[0] + '<code>\u2007</code><b>' + units[evolution[0] - 1][0] + '</b>\n' : '<code>' + space.slice(0, space.length - evolution[0].toString().length) + '</code>/' + evolution[0] + '<code>\u2007</code><b>' + units[evolution[0] - 1][0] + '</b>\n';
			evolution[1].forEach(function(ID) {
				response += (type === 'inline') ? '<code>' + space.slice(0, space.length - ID.toString().length) + '</code>' + ID + '<code>\u2007</code>' + units[ID - 1][0] + '\n' : '<code>' + space.slice(0, space.length - ID.toString().length) + '</code>/' + ID + '<code>\u2007</code>' + units[ID - 1][0] + '\n';
			});
			response += '\n';
		});
	}
	Object.keys(evolutions).forEach(function(key) {
		var devolutions = Array.isArray(evolutions[key].evolution) ? evolutions[key].evolution : [evolutions[key].evolution];
		if (devolutions.indexOf(id) > -1) {
			unit_devolutions.push(key);
		}
	});
	if (unit_devolutions[0]) {
		response = response ? response + '<b>D E V O L U T I O N S</b>\n\n' : '<b>D E V O L U T I O N S</b>\n\n';
		unit_devolutions.forEach(function(devolution) {
			response += (type === 'inline') ? '<code>' + space.slice(0, space.length - devolution.toString().length) + '</code>' + devolution + '<code>\u2007</code><b>' + units[devolution - 1][0] + '</b>\n' : '<code>' + space.slice(0, space.length - devolution.toString().length) + '</code>/' + devolution + '<code>\u2007</code><b>' + units[devolution - 1][0] + '</b>\n';
		});
		response += '\n';
	}
	if (unit_evolutions || unit_devolutions) {
		return response;
	}
	return false;
}

function getDrops(id) {
	var island_types = Object.getOwnPropertyNames(drops),
	drop_lists = [
	[],
	[]
	],
	drop_result = [
	[],
	[]
	],
	response;
	island_types.forEach(function(islands) {
		if (drops[islands]) {
			drops[islands].forEach(function(island, index) {
				var stages = Object.getOwnPropertyNames(drops[islands][index]).sort();
				stages.forEach(function(stage) {
					if (island[stage] && Array.isArray(island[stage])) {
						if (island[stage].indexOf(id) > -1) {
							if(islands.toString() === "Coliseum"){
								drop_lists[0].push([island.shortName || "Coliseum", stage]);
							}
							else{
								drop_lists[0].push([island.shortName || island.name, stage]);
							}
							
						}
						if (island[stage].indexOf(-Math.abs(id)) > -1) {
							if(islands.toString() === "Coliseum"){
								drop_lists[1].push([island.shortName || "Coliseum", stage]);
							}
							else{
								drop_lists[1].push([island.shortName || island.name, stage])
							}
						}
					}
				});
			});
		}
	});
	drop_lists.forEach(function(drop_list, list) {
		drop_list.forEach(function(drop, index) {
			if (drop_list[index + 1] && drop && drop_list[index + 1][0] === drop[0]) {
				drop_list[index + 1].forEach(function(id, count) {
					if (count > 0) {
						drop.push(id);
					}
				});
				drop_list[index + 1] = drop;
				drop = undefined;
			}
			if (drop) {
				if (drop[1] && drop[1] !== ' ') {
					var o_drops = drop.slice(1),
					n_drops = [];
					o_drops.forEach(function(n_drop, index) {
						n_drop = n_drop.replace('Completion Units', 'After completion');
						if (index < o_drops.length) {
							if (index === 0 || index === o_drops.length - 1) {
								n_drops.push(parseInt(n_drop) || n_drop);
							} else {
								if ((parseInt(n_drop) + 1 === parseInt(o_drops[index + 1])) && (parseInt(n_drop) - 1 === parseInt(o_drops[index - 1]))) {
									n_drops.push('-');
								} else {
									n_drops.push(parseInt(n_drop) || n_drop.replace('Completion Units', 'After completion!'));
								}
							}
						}
					});
					drop_result[list] += '<b>' + drop[0] + ':</b>\n' + n_drops.join(', ').replace(/, -/g, '-').replace(/-+(?=-)/g, '').replace(/-,/g, ' -') + '\n\n';
				} else {
					drop_result[list] += '<b>' + drop[0] + '</b>\n\n';
				}
			}
		});
	});
	if (drop_result[0].length > 1 || drop_result[1].length > 1) {
		response = '';
		if (drop_result[0].length > 1) {
			response += '<b>C H A R A C T E R   D R O P S</b>\n\n';
			response += drop_result[0];
		}
		if (drop_result[1].length > 1) {
			response += '<b>M A N U A L   D R O P S</b>\n\n';
			response += drop_result[1];
		}
	}
	return response || false;
}

function getUnitInfo(id, type) {
	var unit_stats = getStats(id, type),
	unit_captain = getCaptainAbility(id, type),
	unit_special = getSpecialAbility(id, type),
	unit_captain_notes = getNotes(details[id] && details[id].captainNotes, type),
	unit_special_notes = getNotes(details[id] && details[id].specialNotes, type),
	unit_cooldown = getCooldowns(id, type),
	unit_sailor = getSailorAbility(id),
	unit_potential = getPotential(id),
	unit_drops = getDrops(id, type),
	unit_evolutions = getEvolutions(id, type),
	response;
	if (unit_stats) {
		response = unit_stats;
		response += unit_captain || '';
		response += unit_captain_notes || '';
		response += unit_sailor || '';
		response += unit_special || '';
		response += unit_special_notes || '';
		response += unit_cooldown || '';
		response += unit_potential || '';
		response += unit_drops || '';
		response += unit_evolutions || '';
		response += '<a href="http://onepiece-treasurecruise.com/wp-content/uploads/c' + String('0000' + id).slice(-4).replace(/(057[54])/, '0$1') + '.png">\u2007</a>\n';
		response += '<a href="https://t.me/OPTCNews">JPN NEWS</a> | <a href="https://discord.gg/pa5pBJd">Discord Group</a> | <a href="http://optc-news.com">News Archive</a>\n';
		response += '<b>J O I N   U S</b>\n<a href="https://telegram.me/joinchat/ABzveEDxZTiNLYTRO5-kQg">English group</a> | <a href="https://t.me/joinchat/ABzveENpurD6yuLWuTL18Q">Italian group</a> | <a href="https://t.me/joinchat/ABzveENMOZg4ZCXSqfziGA">Spanish group</a>\n';
		return response;
	}
}

module.exports = {
	getUnitsDB: function() {
		return units;
	},
	getUnit: function(id) {
		return units[id - 1];
	},
	getUnitInfo: function(id, type) {
		return getUnitInfo(id, type);
	},
	getCooldownsDB: function() {
		return cooldowns;
	},
	getDetailsDB: function() {
		return details;
	},
	getPotential:function(){
		return potential;
	},
	getDetail: function(id, detail) {
		return getDetail(id, detail);
	},
	getNotesDB: function() {
		return notes;
	},
	getDropsDB: function() {
		return drops;
	},
	getEvolutionsDB: function() {
		return evolutions;
	},
	getAliasesDB: function() {
		return aliases;
	}
};