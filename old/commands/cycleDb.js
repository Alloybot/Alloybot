const database = _connections.get('database').db;
const discord = _connections.get('discord').client;

let document = { _version: 1, _plugin: 'musicbot', queue: [] };
let query = { _plugin: 'musicbot' };

_events.on('dj-stapleton:cycleDb:createCollection', () => {
  database.collections().then((items) => {
    for (i in items) {
      let item = items[i];
      if (item.collectionName.startsWith(`${'guild' || 'dm' || 'group'}_`)) {
        let cursor = item.find(query).count();
        cursor.then((n) => {
          if (n > 1)
            _logger.warn({
              prefix: 'Database',
              message: `${
                item.collectionName
              } contains more than 1 musicbot object. May cause issues.`
            });
          if (n < 1) item.insertOne(document, { forceServerObjectId: true });

          item.findOneAndReplace(
            {
              _version: { $lt: document._version }
            },
            document,
            (original) => {
              if (original)
              item.updateOne(
                { _version: document._version },
                {
                  $set: {
                    queue: original.queue
                  }
                }
              );
            }
          );
        });
      }
    }
  });
});