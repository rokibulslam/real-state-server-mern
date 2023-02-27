const express = require("express");
const apartmentsController = require("../../controllers/apartments.controller");
const orderController = require("../../controllers/order.controller")
const userController = require("../../controllers/user.controller");
const reviewController = require("../../controllers/review.controller");
const router = express.Router();

router.get("/apartments", apartmentsController.getApartments);
router.get("/apartment/:id", apartmentsController.getAnApartment);
router.get("/apartments/featured", apartmentsController.getFeaturedApartment);
router.get("/apartments/regular", apartmentsController.getRegulardApartment);
router.get("/apartments/top", apartmentsController.getTopApartment);

router.get("/reviews", reviewController.getReviews);

router.get("/orders", orderController.getOrders);
router.get("/orders/:email", orderController.getAnOrder);

router.get("/users", userController.getUsers);
router.get("/users/:email", userController.getUserRole);


router.post("/apartments", apartmentsController.createApartment);
router.post("/orders", orderController.createOrder);
router.post("/users", userController.createUser);
router.post("/review", reviewController.createReview);

router.put("/apartment/update/:id", apartmentsController.updateApartment);
router.put("/order/status/:id", orderController.updateOrderStatus);
   // CHECK AND ADD GOOGLE USER
router.put("/users", userController.updateUser);
// router.put("/users/admin", userController.makeAdmin);
router.put("/update/user/:email", userController.updateRole);


router.delete("/apartment/delete/:id", apartmentsController.deleteApartment);
router.delete("/order/delete/:id", orderController.deleteOrder);

module.exports = router;
