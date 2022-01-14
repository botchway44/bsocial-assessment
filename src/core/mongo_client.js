const MongoClient = require('mongodb');

module.exports =  class MongoClientConnection{


     db_name = 'test-assessment';
     users_db_name = 'users';
     sessions_db_name = 'sessions';

     users_collection = null;
     sessions_collection = null;

     constructor() {  }
    
     connect(mongo_url){
        console.log("Connecting to Databse ... ", mongo_url);
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongo_url, async (
                err,
                client
            ) => {
                // throw error
                if (err) { reject(err); throw err; };

                // log connected
                this.users_collection = await client.db(this.db_name).collection(this.users_db_name);
                this.sessions_collection = await client.db(this.db_name).collection(this.sessions_db_name);
                console.log('connected to database');

                resolve(true);
            });
        });
     }


    async addUser(email, password, name) {
        const user = {
            email: email,
            password: password,
            name: name
        };
        return await this.users_collection?.insertOne(user);
    }


    async findUser(email) {
        return await this.users_collection?.findOne({email : email}) ;
    }

    async addSession(email, token) {
        const login_data = {
            email: email,
            token: token,
        };
        return await this.sessions_collection?.insertOne(login_data);
    }

    async findSession(email, token) {
        return await this.sessions_collection?.findOne({email : email, token : token}) ;
    }

    async removeToken(email, token) {
        return await this.sessions_collection?.removeOne({email : email, token : token}) ;
    }

}