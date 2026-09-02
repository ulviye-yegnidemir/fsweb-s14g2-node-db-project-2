const Cars = require("./cars-model");
const vinValidator = require("vin-validator");
const checkCarId = async (req, res, next) => {
  try{
    const car = await Cars.getById(req.params.id);
    if(!car){
      return res.status(404).json({
        message:`${req.params.id} kimliğine sahip araba bulunamadı`
      });
    }
    req.car = car;
    next();
  }catch(err){
    next(err);
  }
};

const checkCarPayload = (req, res, next) => {
  const requiredFields = ["vin","make","model","mileage"];
  const missingField = requiredFields.find((field) => {
    return (
      req.body[field] === undefined ||
      req.body[field] === null ||
      req.body[field] === "" 
    );
  });
  if(missingField) {
    return res.status(400).json({
      message :`${missingField} is missing`
    });
  }
  next();
};

const checkVinNumberValid = (req, res, next) => {
const vin = req.body.vin;
if(!vinValidator.validate(vin)){
  return res.status(400).json({
    message: `vin ${vin} is invalid` ,
  });
}
next();
};

const checkVinNumberUnique = async (req, res, next) => {
  try{
    const cars = await Cars.getAll();
    const vinExists = cars.some((car) => {
      return car.vin === req.body.vin;
    });
    if(vinExists){
      return res.status(400).json({
    message: `vin ${req.body.vin} already exists`,
    });
  }
next();
}catch(err) {
  next(err);
}
};
module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
};