import mongoose from 'mongoose';

export default function connectDatabase() {
    mongoose.connect(
        `mongodb://siddharthaghimire:${process.env.PASSWORD}@ac-5fhopgk-shard-00-00.eydnij8.mongodb.net:27017,ac-5fhopgk-shard-00-01.eydnij8.mongodb.net:27017,ac-5fhopgk-shard-00-02.eydnij8.mongodb.net:27017/?ssl=true&replicaSet=atlas-mlqlwr-shard-0&authSource=admin&retryWrites=true&w=majority`)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Failed to connect to MongoDB:', error);
        });
}