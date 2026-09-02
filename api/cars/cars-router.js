const router = require("express").Router();
//const { checkCarId, checkCarPayload, checkVinNumberValid, checkVinNumberUnique } = require("./cars-middleware");
const Cars = require("./cars-model");
const { checkCarId,
    checkCarPayload,
    checkVinNumberValid,
    checkVinNumberUnique,
 } = require("./cars-middleware"); 
router.get("/",async (req,res,next) => {
    try {
        const cars = await Cars.getAll();
        res.json(cars);
    }catch(err){
        next(err);
    }
});
router.get("/:id",checkCarId,
    (req,res) => {
        res.json(req.car);
    });
    router.post("/",
        checkCarPayload,
        checkVinNumberValid,
        checkVinNumberUnique,
        async (req,res,next) => {
            try {
                const newCar = await Cars.create(req.body);
                res.status(201).json(newCar);
            }catch(err){
                next(err);
            }
        }
    );
module.exports = router;