"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Company_controller_1 = require("../controllers/Company.controller");
const router = (0, express_1.Router)();
router.post('/submit-details', Company_controller_1.submitCompanyDetails);
router.get('/details', Company_controller_1.getCompanyDetails);
router.put('/update-details', Company_controller_1.updateCompanyDetails);
exports.default = router;
