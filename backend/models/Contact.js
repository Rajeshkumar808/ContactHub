const mongoose=require('mongoose');
const ContactSchema=new mongoose.Schema({owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},name:{type:String,required:true,trim:true,maxlength:100},email:{type:String,trim:true,lowercase:true,maxlength:254},phone:{type:String,trim:true,maxlength:30},address:{type:String,trim:true,maxlength:300},company:{type:String,trim:true,maxlength:100}},{timestamps:true});
module.exports=mongoose.model('Contact',ContactSchema);
