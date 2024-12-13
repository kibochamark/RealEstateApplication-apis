import express from 'express';
import { validateEmail } from '../middleware/emailValidator';
import { upload } from '../utils/upload';
import { deletePropertyById, getProperties, getPropertyById, postProperty, putProperty } from '../controllers/propety';
import { patchCompany, postCompany, removecompany, retrievecompanies, retrievecompany } from '../controllers/company';
import { patchFeature, postFeature, removefeature, removefeatures, retrievefeature, retrievefeatures } from '../controllers/features';
import { patchpropertytypes, postPropertyType, removepropertytypes, retrievePropertyType, retrievePropertyTypes } from '../controllers/propertytypes';
import passport from 'passport';
import { login, patchUser, register, removeuser, retrieveuser, retrieveusersbycompanyid } from 'controllers/auth';



const routes = express.Router();


// // auth user

// // routes.get("/getusers", authenticateJWT, getusers)
// routes.post("/registeruser",validateEmail, registerUser)
// routes.post("/registercompany",validateEmail, registerCompany)
// routes.post("/loginuser",validateEmail,loginUser)
// routes.post("/refreshtoken",refreshToken)
// routes.get("/testlogout", checkTokenBlacklist, authMiddleware, testlogout)
// routes.post("/logout",  authMiddleware, logoutUser)

// // google logins
// routes.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// routes.get('/auth/google/callback', googlecallback);


// // // Reset password

// routes.post("/forgot-password", validateEmail, forgotPassword);
// routes.post("/reset-password", resetPassword);

// // profile
// routes.post("/createprofile", checkTokenBlacklist, authMiddleware, createProfileHandler)
// // routes.post("/createprofile", checkTokenBlacklist, authMiddleware, checkActiveSubscriptionMiddleware, createProfileHandler)
// routes.put("/updateProfile", checkTokenBlacklist, authMiddleware, updateProfileHandler)
// routes.get("/getUsersWithProfiles", checkTokenBlacklist, authMiddleware, getUsersWithProfilesHandler)
// routes.get("/getUserWithProfile/:id", checkTokenBlacklist, authMiddleware, getUserWithProfileHandler)
// routes.delete("/deleteUser/:id",checkTokenBlacklist, authMiddleware, deleteUserHandler);
// routes.delete("/deleteProfile", checkTokenBlacklist, authMiddleware, deleteProfileHandler);

// // role
// routes.get("/getrole", checkTokenBlacklist, authMiddleware, getRole)
// routes.get("/getroles", checkTokenBlacklist, authMiddleware, getRoles)
// routes.delete("/deleterole", checkTokenBlacklist, authMiddleware, deleteRole)
// routes.patch("/updaterole", checkTokenBlacklist, authMiddleware, updateRole)


// routes.post("/createrole", checkTokenBlacklist, authMiddleware, createRole);

// // permission
// routes.get("/getpermission", checkTokenBlacklist, authMiddleware, getPermission)
// routes.post("/roles/:roleId/permissions", checkTokenBlacklist, authMiddleware,assignpermissiontorole)
// // routes.get("/getpermissions", checkTokenBlacklist, authMiddleware, getPer)
// routes.delete("/deletepermission", checkTokenBlacklist, authMiddleware, deletePermission)
// routes.patch("/updatepermission", checkTokenBlacklist, authMiddleware, updatePermission)
// routes.post("/createpermission", checkTokenBlacklist, authMiddleware, createPermission);


// // // category
// routes.get("/getcategories", checkTokenBlacklist, authMiddleware, retrievecategories)
// routes.get("/getcategory", checkTokenBlacklist, authMiddleware, retrievecategory)
// routes.post("/createcategory", checkTokenBlacklist, authMiddleware,newcategory)
// routes.delete("/deletecategory", checkTokenBlacklist, authMiddleware, removecategory)
// routes.patch("/updatecategory", checkTokenBlacklist, authMiddleware, updatecategory)


// // config options
// routes.get("/getconfigoptions", checkTokenBlacklist, authMiddleware, retrieveconfigoptions)
// routes.get("/getconfigoptionbyproduct", checkTokenBlacklist, authMiddleware, retrieveoption)
// routes.post("/createconfigoption", checkTokenBlacklist, authMiddleware,newconfigoption)
// routes.delete("/deleteconfigoption", checkTokenBlacklist, authMiddleware, removeoption)
// routes.patch("/updateconfigoption", checkTokenBlacklist, authMiddleware, updateoption)


// //config option values

// routes.get("/getconfigoptionvalues", checkTokenBlacklist, authMiddleware, getConfigValuesHandler)
// routes.get("/getconfigoptionvaluebyid", checkTokenBlacklist, authMiddleware, getConfigValueByIdHandler)
// routes.post("/createconfigoptionvalue", checkTokenBlacklist, authMiddleware,createConfigValueHandler )
// routes.delete("/deleteconfigoptionvalue", checkTokenBlacklist, authMiddleware, deleteConfigValueHandler)
// routes.patch("/updateconfigoptionvalue", checkTokenBlacklist, authMiddleware, updateConfigValueHandler)

// // Route to fetch all products with related images and configuration options
// routes.get('/products',checkTokenBlacklist, authMiddleware, getAllProducts);

// // Route to fetch a single product by ID with related images and configuration options
// routes.get('/products/:id',checkTokenBlacklist, authMiddleware, getProductById);

// // Route to fetch a single product by company ID with related images and configuration options
// routes.get('/company/:companyId/product', checkTokenBlacklist, authMiddleware,getProductByCompanyId);

// // Route to fetch all products by company ID with related images and configuration options
// routes.get('/company/:companyId/products',checkTokenBlacklist, authMiddleware, getAllProductsByCompanyId);

// // Route to create a new product
// // routes.post('/products', checkTokenBlacklist, authMiddleware, createProduct);
routes.post('/property', passport.authenticate('jwt', {session:false}), upload.array('images', 10), postProperty);
routes.get("/properties", getProperties)
routes.get("/:id/property", getPropertyById)
routes.delete("/:id/property", deletePropertyById)
routes.patch("/property", putProperty)
routes.patch("/propertyimage", upload.array('images', 10), putProperty)



routes.get("/:id/user", retrieveuser)
routes.get("/:id/companyusers", retrieveusersbycompanyid)
routes.delete("/:id/company", removeuser)
routes.patch("/updateuser", patchUser)
routes.post("/signup", validateEmail, register)
routes.post("/login", validateEmail, login )

routes.get("/companies", retrievecompanies)
routes.get("/:id/company", retrievecompany)
routes.delete("/:id/company", removecompany)
routes.patch("/company", patchCompany)
routes.post("/company", validateEmail, postCompany)


routes.get("/features", retrievefeatures)
routes.get("/:id/feature", retrievefeature)
routes.delete("/:id/feature", removefeature)
routes.patch("/feature", patchFeature)
routes.post("/feature", postFeature)
routes.post("/features", removefeatures)


routes.get("/propertytypes", retrievePropertyTypes)
routes.get("/:id/propertytype", retrievePropertyType)
routes.delete("/:id/propertytype", removepropertytypes)
routes.patch("/propertytype", patchpropertytypes)
routes.post("/propertytype", postPropertyType)


export default routes;