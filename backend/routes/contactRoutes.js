const r=require('express').Router(),protect=require('../middleware/auth'),c=require('../controllers/contactController');
r.use(protect);r.get('/',c.list);r.post('/',c.create);r.get('/:id',c.get);r.put('/:id',c.update);r.delete('/:id',c.remove);module.exports=r;
