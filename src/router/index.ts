import express from 'express';
import { validateEmail } from '../middleware/emailValidator';
import { upload } from '../utils/upload';
import { deletePropertyById, getAllProperties, getProperties, getPropertyById, getSimilarProperties, postProperty, putProperty } from '../controllers/propety';
import { patchCompany, postCompany, removecompany, retrievecompanies, retrievecompany } from '../controllers/company';
import { patchFeature, postFeature, removefeature, removefeatures, retrievefeature, retrievefeatures } from '../controllers/features';
import { patchpropertytypes, postPropertyType, removepropertytypes, retrievePropertyType, retrievePropertyTypeByName, retrievePropertyTypes } from '../controllers/propertytypes';
import passport from 'passport';
import { login, patchUser, register, removeuser, retrieveuser, retrieveusersbycompanyid } from '../controllers/auth';
import { patchBlog, postBlog, removeblog, retrieveBlog, retrieveblogs, retrieveRecentblogs } from '../controllers/blog';
import { patchAccessSchema, postAccessSchema, removeAccessUser, retrieveAccessUser, retrieveAccessUsers } from '../controllers/access';
import { deleteTestimonial, getAllTestimonials, getSingleTestimonial, postTestimonial, updateTestimonial } from '../controllers/testimonial';



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
// passport.authenticate('jwt', {session:false})
routes.post('/property',  upload.array('images', 10), postProperty);
routes.get("/properties", getProperties)
routes.get("/:id/similarproperties", getSimilarProperties)
routes.get("/allproperties", getAllProperties)
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


// request access
routes.get("/requestusersaccess", retrieveAccessUsers)
routes.get("/:id/requestuser", retrieveAccessUser)
routes.delete("/:id/requestuser", removeAccessUser)
routes.patch("/requestuseraccess", patchAccessSchema)
routes.post("/requestuser", postAccessSchema)


// blogs
routes.get("/blogs", retrieveblogs)
routes.get("/recentblogs", retrieveRecentblogs)
routes.get("/:id/blog", retrieveBlog)
routes.delete("/:id/blog", removeblog)
routes.patch("/blog", upload.single('image'), patchBlog)
routes.post("/blog", upload.single('image'), postBlog)


//testimonials

routes.post("/testimonial", postTestimonial)
routes.get("/gettestimonials", getAllTestimonials)
routes.get("/:id/gettestimonials", getSingleTestimonial)
routes.patch("/testimonial", updateTestimonial)
routes.delete("/:id/testimonial", deleteTestimonial)

routes.get("/propertytypes", retrievePropertyTypes)
routes.get("/:id/propertytype", retrievePropertyType)
routes.get("/:name/propertytypebyname", retrievePropertyTypeByName)
routes.delete("/:id/propertytype", removepropertytypes)
routes.patch("/propertytype", patchpropertytypes)
routes.post("/propertytype", postPropertyType)


export default routes;
