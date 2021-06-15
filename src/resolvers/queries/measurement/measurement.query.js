const { Client } = require('pg');

module.exports = async (parent, args, context, resolveInfo) => {
    if(typeof args.id === 'undefined') {
        throw new Error('Input field { id } missing.');
    }

    const client = new Client(process.env.DB_URL);

    return await client.connect()
        .then(async () => {
            return await client.query('SELECT * FROM measurements WHERE id=($1)', [ args.id ])
                .then(result => {
                    client.end();
                    return result.rows.length !== 1 ? null : result.rows[0];
                })
                .catch(error => {
                    return console.error('Error running query', error);
                });
        })
        .catch(error => {
            return console.error('Could not connect to postgres', error);
        });
}