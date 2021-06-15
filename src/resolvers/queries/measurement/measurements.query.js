const { Client } = require('pg');

module.exports = async (parent, args, context, resolveInfo) => {
    const client = new Client(process.env.DB_URL);

    return await client.connect()
        .then(async () => {
            return await client.query('SELECT * FROM measurements ORDER BY date_measured DESC;')
                .then(result => {
                    client.end();
                    return result.rows.length > 0 ? result.rows : null;
                })
                .catch(error => {
                    return console.error('Error running query', error);
                });
        })
        .catch(error => {
            return console.error('Could not connect to postgres', error);
        });
}