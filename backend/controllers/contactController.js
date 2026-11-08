const Contact=require('../models/Contact');
const fields=['name','email','phone','address','company'];
const clean=b=>Object.fromEntries(fields.map(k=>[k,typeof b[k]==='string'?b[k].trim():undefined]));
exports.list=async(req,res)=>{const {q='',company=''}=req.query;const filter={owner:req.user.id};if(company)filter.company=company;if(q)filter.$or=['name','email','phone','company'].map(k=>({[k]:{$regex:q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'}}));res.json(await Contact.find(filter).sort({updatedAt:-1}));};
exports.create=async(req,res)=>{if(!req.body.name?.trim())return res.status(400).json({message:'Contact name is required'});res.status(201).json(await Contact.create({...clean(req.body),owner:req.user.id}));};
exports.get=async(req,res)=>{const c=await Contact.findOne({_id:req.params.id,owner:req.user.id});if(!c)return res.status(404).json({message:'Contact not found'});res.json(c);};
exports.update=async(req,res)=>{if(!req.body.name?.trim())return res.status(400).json({message:'Contact name is required'});const c=await Contact.findOneAndUpdate({_id:req.params.id,owner:req.user.id},clean(req.body),{new:true,runValidators:true});if(!c)return res.status(404).json({message:'Contact not found'});res.json(c);};
exports.remove=async(req,res)=>{const c=await Contact.findOneAndDelete({_id:req.params.id,owner:req.user.id});if(!c)return res.status(404).json({message:'Contact not found'});res.json({message:'Contact deleted'});};
