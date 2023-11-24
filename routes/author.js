const express = require('express');

const router = express.Router();

const Author = require('../models/author');

const multer = require('multer');

filename= '';

const mystorage = multer.diskStorage({
    destination : './uploads',
    filename: (req , file , redirect)=>{
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        redirect(null , fl);
        filename = fl;
    }
});

const upload = multer({ storage : mystorage });

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
//crud de la table author

router.post( '/createAccount' , upload.any('image') , async (req ,res)=>{
    data = req.body;
    author = new Author(data);

    author.image = filename;

    sal = bcrypt.genSaltSync(10);
    cryptedPass = await bcrypt.hashSync( data.password , sal );
    author.password = cryptedPass;

    author.save()
        .then(
            (createAuthor)=>{
                filename='';
                res.status(200).send(createAuthor);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

router.post( '/login' ,async (req ,res)=>{
    data = req.body;
    author = await Author.findOne({ email : data.email });
    if(!author){
        res.status(401).send(' email or password invalid ! ');
    }else{
        validPass = bcrypt.compareSync( data.password , author.password );
        if(!validPass){
            res.status(401).send(' email or password invalid ! ');
        }else{
            payload={
                _id : author._id,
                email : author.email,
                fullname : author.name + ' ' + author.lastname
            }
            token = jwt.sign( payload , '1234567' );
            res.status(200).send({ mytoken : token });
        }
    }
});

router.get( '/all' , (req ,res)=>{
    Author.find()
        .then(
            (authors)=>{
                res.status(200).send(authors);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

router.get( '/getbyid/:id' , (req ,res)=>{
    myid = req.params.id;
    Author.findOne({ _id : myid })
        .then(
            (author)=>{
                res.status(200).send(author);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

router.delete( '/supprimer/:id' , (req ,res)=>{
    myid = req.params.id;
    Author.findByIdAndDelete({ _id : myid })
        .then(
            (deleteAuthor)=>{
                res.status(200).send(deleteAuthor);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

router.put( '/update/:id' , upload.any('image') , async (req ,res)=>{
    myid = req.params.id;
    newData = req.body;
    if( filename.length > 0){
        newData.image = filename;
    }
    sal = bcrypt.genSaltSync(10);
    cryptedPass = await bcrypt.hashSync( data.password , sal );
    newData.password = cryptedPass;

    Author.findByIdAndUpdate({ _id : myid } , newData)
        .then(
            (author)=>{
                filename='';
                res.status(200).send(author);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

module.exports = router;