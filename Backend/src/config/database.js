import mongoose from 'mongoose';

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGOOSE_SERVER)
        .then(()=>{
            console.log('Connected to DATABASE');
        })
    }catch(err){    
        console.log('Error connecting to DATABASE', err);
    }
}
export default connectDB; 