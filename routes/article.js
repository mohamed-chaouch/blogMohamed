const express = require('express');

const Article = require('../models/article');

const router = express.Router();

const multer = require('multer');

filename = '';

const mystorage = multer.diskStorage({
    destination : './uploads',
    filename : (req , file , redirect)=>{
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        redirect(null , fl);
        filename = fl;
    }
});

const upload = multer({ storage : mystorage });

// crud de la table article :
router.post( '/ajout' , upload.any('image') , (req ,res)=>{
    data = req.body;
    article = new Article(data);

    article.date = new Date();
    article.image = filename; 
    article.tags = data.tags.split(','); //  ['ssrf' , 'ssrf' ,'ssrf' ,'ssrf']
    
    article.save()
        .then(
            (newArticle)=>{
                filename='';
                res.status(200).send(newArticle);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

router.get( '/all' , (req ,res)=>{
    Article.find()
        .then(
            (articles)=>{
                res.status(200).send(articles);
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
    Article.findOne({ _id : myid })
        .then(
            (article)=>{
                res.status(200).send(article);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

router.get( '/getbyidauthor/:id' , (req ,res)=>{
    myid = req.params.id;
    Article.find({ idAuthor : myid })
        .then(
            (articlesAuthor)=>{
                res.status(200).send(articlesAuthor);
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
    Article.findOneAndDelete({ _id : myid })
        .then(
            (deleteArticle)=>{
                res.status(200).send(deleteArticle);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

router.put( '/update/:id' , upload.any('image') , (req ,res)=>{
    myid = req.params.id;
    newData = req.body;

    newData.tags = newData.tags.split(',');
    if(filename.length>0){
        newData.image = filename;
    }

    Article.findByIdAndUpdate({ _id : myid } , newData)
        .then(
            (article)=>{
                filename='';
                res.status(200).send(article);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
});

module.exports = router;