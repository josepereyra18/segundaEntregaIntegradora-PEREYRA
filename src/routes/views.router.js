import express from 'express';
const router = express.Router();
import { isAuthenticated, isNotAuthenticated } from '../middlewares/auth.js';
import productsModel from '../dao/mongo/models/products.model.js';


router.get('/',(req, res) => {
    res.render('login')
});

router.get('/register', isNotAuthenticated,(req, res) => {
    res.render('register')
});

router.get('/reestablecimientoCont', (req, res) => {
    res.render('verificacionMail')
})


router.get('/reestablecimientoCont/verificado', (req, res) => { 
    res.render('resCont')
})

router.get('/current', isAuthenticated ,async(req, res) => {
    try {

        // const first_name = req.session.user.first_name;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const category = req.query.category;
        const status = req.query.status;
        let sort = {};

        if (req.query.sort) {
            if (req.query.sort === "asc") {
                sort = { price: 1 };
            } else if (req.query.sort === "desc") {
                sort = { price: -1 };
            }
        }

        let query = {};
        if (category) {
            query.category = category;
        }
        if (status) {
            query.status = status === 'true';
        }

        const options = {
            page,
            limit,
            sort
        };

        const result = await productsModel.paginate(query, options);

        if (page > result.totalPages) {
            return res.status(404).send('Página no encontrada');
        }

        console.log(req.session.user);
        res.render('home', { productos: result.docs , user: req.session.user, isAdmin: req.session.user.isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});


export default router;
