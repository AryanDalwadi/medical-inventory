const express = require('express');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const {
  insertMainMenuSchema,
  updateMainMenuSchema,
  insertSubMenuSchema,
  updateSubMenuSchema,
} = require('../validation/menuValidation');
const menuController = require('../controller/menuController');

const router = express.Router();

// GET routes for retrieving menus
router.get('/', authenticateToken, menuController.getMenuHierarchy);
router.get('/main', authenticateToken, menuController.getAllMainMenus);
router.get('/sub', authenticateToken, menuController.getAllSubMenus);

// POST/PUT routes for Main Menus
router.post(
  '/main',
  authenticateToken,
  validate(insertMainMenuSchema),
  menuController.createMainMenu
);
router.put(
  '/main/:id',
  authenticateToken,
  validate(updateMainMenuSchema),
  menuController.updateMainMenu
);

// POST/PUT routes for Sub Menus
router.post(
  '/sub',
  authenticateToken,
  validate(insertSubMenuSchema),
  menuController.createSubMenu
);
router.put(
  '/sub/:id',
  authenticateToken,
  validate(updateSubMenuSchema),
  menuController.updateSubMenu
);

module.exports = router;
