const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const fs = require("fs");
const filePath = "./tour-data/tours.json";
const tours = JSON.parse(fs.readFileSync(filePath));
app.use(express.json());

const getRoute = async (req, res) => {
  return res.status(200).json({
    message: "Server is running",
  });
};

const createTour = async (req, res) => {
  if (req.body.productName == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required product name",
    });
  } else if (req.body.image == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required image",
    });
  } else if (req.body.from == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required from",
    });
  } else if (req.body.nutrients == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required nutrients",
    });
  } else if (req.body.quantity == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required quantity",
    });
  } else if (req.body.price == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required price",
    });
  } else if (req.body.organic == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required organic",
    });
  } else if (req.body.description == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required description",
    });
  }
  try {
    const id = uuidv4();
    const newTour = Object.assign({ id: id }, req.body, {
      productName: req.body.productName,
      image: req.body.image,
      from: req.body.from,
      nutrients: req.body.nutrients,
      quantity: req.body.quantity,
      price: req.body.price,
      organic: req.body.organic,
      description: req.body.description,
    });
    tours.push(newTour);
    fs.writeFile(filePath, JSON.stringify(tours), (err) => {
      res.status(200).json({
        returncode: "300",
        message: "Success",
        tourslist: newTour,
      });
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

const getTours = async (req, res) => {
  try {
    res.status(200).json({
      message: "Tour List",
      returncode: "300",
      total: tours.length,
      tourslist: tours,
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    var deleteTour = tours.findIndex((tour) => tour.id === req.body.id);
    if (deleteTour == -1) {
      return res.status(200).json({
        returncode: "200",
        message: "Id not found",
      });
    }
    tours.splice(deleteTour, 1);
    fs.writeFile(filePath, JSON.stringify(tours), () => {
      res.status(200).json({
        returncode: "300",
        message: "Successfully Deleted",
      });
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

const editTour = async (req, res) => {
  try {
    const tour = tours.find((tour) => tour.id === req.body.id);
    if (tour == undefined) {
      return res.status(200).json({
        returncode: "200",
        message: "Tour Not Found",
      });
    }
    tour.id = tour.id;
    tour.productName = req.body.productName;
    tour.image = req.body.image;
    tour.from = req.body.from;
    tour.nutrients = req.body.nutrients;
    tour.quantity = req.body.quantity;
    tour.price = req.body.price;
    tour.organic = req.body.organic;
    tour.description = req.body.description;
    const editedtour = {
      id: tour.id,
      productName: req.body.productName,
      image: req.body.image,
      from: req.body.from,
      nutrients: req.body.nutrients,
      quantity: req.body.quantity,
      price: req.body.price,
      organic: req.body.organic,
      description: req.body.description,
    };
    fs.writeFile(filePath, JSON.stringify(tours), () => {
      res.status(200).json({
        returncode: "300",
        message: "Successfully Edited",
        tourslist: editedtour,
      });
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

app.route("/").get(getRoute);
app.route("/tour/create").post(createTour);
app.route("/tour/getall").get(getTours);
app.route("/tour/delete").post(deleteTour);
app.route("/tour/edit").post(editTour);

app.listen(3000, () => {
  console.log("Server is running");
});
