import mongoose,{ConnectOptions} from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
export default function connectDatabase() {
    const Password=process.env.PASSWORD
    console.log(Password)
    mongoose.connect(
        `mongodb://siddharthaghimire:${Password}@ac-5fhopgk-shard-00-00.eydnij8.mongodb.net:27017,ac-5fhopgk-shard-00-01.eydnij8.mongodb.net:27017,ac-5fhopgk-shard-00-02.eydnij8.mongodb.net:27017/?ssl=true&replicaSet=atlas-mlqlwr-shard-0&authSource=admin&retryWrites=true&w=majority` , { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Failed to connect to MongoDB:', error);
        });
}