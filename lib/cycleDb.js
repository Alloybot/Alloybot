const database = _connections.get('database').db;
const discord = _connections.get('discord').client;

discord.guilds.forEach((guild) => {
  createCollection('guild', guild.id, guild.ownerID);
});

for ({id, channel} in discord.channels) {
  switch(channel.type) {
    case "dm":
      createCollection(channel.type, id, channel.recipient.id);
      break;
    
    case "group":
      createCollection(channel.type, id, channel.ownerID);
      break;

    default:
      continue;
  }
}

function createCollection(type, id, otherID) {
  let info = {}, name;
  switch(type) {
    case 'dm':
      info = { dmID: id, recipientID: otherID }
      name = `dm_${id}`;
      break;
    
    case 'group':
      info = { groupID: id, ownerID: otherID }
      name = `group_${id}`;
      break;

    default:
      info = { guildID: id, ownerID: otherID }
      name = `guild_${id}`;
  }

  database.createCollection(name).then((collection) => {
    _events.emit('alloybot:cycleDb:createCollection');
    collection.find({ _plugin: 'alloybot' }, (error, result) => {
      result.count().then((i) => {
        if (i < 1)
          collection.insertOne(
            {
              _version: 1,
              _plugin: 'alloybot',
              info: info
            },
            { forceServerObjectId: true }
          );
      });
    });
  });
}

module.exports = createCollection;