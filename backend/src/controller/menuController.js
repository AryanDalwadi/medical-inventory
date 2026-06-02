const { successResponse } = require('../utils/apiResponse');
const menuService = require('../service/menuService');

async function getMenuHierarchy(req, res, next) {
  try {
    const roleId = req.user ? req.user.roleId : null;
    const hierarchy = await menuService.getMenuHierarchy(roleId);
    return successResponse(res, 'Menu hierarchy fetched successfully', hierarchy);
  } catch (error) {
    return next(error);
  }
}

async function getAllMainMenus(req, res, next) {
  try {
    const mainMenus = await menuService.getAllMainMenus();
    return successResponse(res, 'Main menus fetched successfully', mainMenus);
  } catch (error) {
    return next(error);
  }
}

async function getAllSubMenus(req, res, next) {
  try {
    const subMenus = await menuService.getAllSubMenus();
    return successResponse(res, 'Sub menus fetched successfully', subMenus);
  } catch (error) {
    return next(error);
  }
}

async function createMainMenu(req, res, next) {
  try {
    const createdBy = req.user ? req.user.userId : null;
    const mainMenu = await menuService.createMainMenu({ ...req.body, createdBy });
    return successResponse(res, 'Main menu created successfully', mainMenu, 201);
  } catch (error) {
    return next(error);
  }
}

async function updateMainMenu(req, res, next) {
  try {
    const id = req.params.id;
    const updatedBy = req.user ? req.user.userId : null;
    const updatedMenu = await menuService.updateMainMenu(id, { ...req.body, updatedBy });
    return successResponse(res, 'Main menu updated successfully', updatedMenu);
  } catch (error) {
    return next(error);
  }
}

async function createSubMenu(req, res, next) {
  try {
    const createdBy = req.user ? req.user.userId : null;
    const subMenu = await menuService.createSubMenu({ ...req.body, createdBy });
    return successResponse(res, 'Sub menu created successfully', subMenu, 201);
  } catch (error) {
    return next(error);
  }
}

async function updateSubMenu(req, res, next) {
  try {
    const id = req.params.id;
    const updatedBy = req.user ? req.user.userId : null;
    const updatedSubMenu = await menuService.updateSubMenu(id, { ...req.body, updatedBy });
    return successResponse(res, 'Sub menu updated successfully', updatedSubMenu);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMenuHierarchy,
  getAllMainMenus,
  getAllSubMenus,
  createMainMenu,
  updateMainMenu,
  createSubMenu,
  updateSubMenu,
};
