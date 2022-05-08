const router = require('express').Router();
const Document = require('../models/Document');

router.delete('/:id', async (req, res) => {

    const id = req.params.id;
    
    const person = Document.findOne({_id: id});
    if(!person) {
        res.status(422).json({error: 'Not Found'});
        return
    }

    try {
        
        await Document.deleteOne({_id: id})
        res.status(200).json({message: 'Success'})

    } catch (error) {
        res.status(500).json({ error: error})
    }

})

module.exports = router;