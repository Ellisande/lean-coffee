var allNames = [
  'Mayor McCheese','Hamburgler','Strawberry Shortcake','Xena, Warrior Princess','Kruul the Warrior King','Hippie','Mr. Drippy',
  'Master Shake','Grimmace','Sailor Moon','Blue','A Fish Called Wonda','Resivior Dog','Marsellus Wallus',"Tony Stark","Justin Beiber",
  'Bubble Puppy','Dora the Explorer','Spongebob Squarepants','Moonpie','Smores','Onyx','Uncle Bob','Godzilla',
  'McLovin','Sparky, the Fire Breathing Chameleon','The Tin Man', 'Magic Mike', 'Squared', 'MD', 'Darth Helemet', 'President Scroob',
  'Glass Popcorn'
];

var randomName = function(allNames){
  return allNames[Math.floor((Math.random()*allNames.length))];
};

function isNameFree(name, participants){
  return participants.indexOf(name) == -1;
}

function getNewName(participants){
  var name;
  do{
    name = randomName(allNames);
  } while (!isNameFree(name, participants))

  return name;
}

module.exports = {
    getNewName: getNewName
}