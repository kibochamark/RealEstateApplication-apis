

import db from "../utils/connection";
import { InsertPropety, property, propertytofeatures, propertyimages, users, Company, company, location, InsertLocation, InsertCompany, InsertPropetyType, propertytypes, InsertFeatures, propertyfeatures, InsertOffices, companyOffices } from "./schema";
import { eq } from "drizzle-orm";



// users -----------------------------

export const getUsers = async () => {
    return await db.select({ id: users.id, email: users.email }).from(users);
}
export const getUser = async (id: number) => {
    return await db.select({ id: users.id, email: users.email, name: users.kinde_name }).from(users).where(eq(users.id, id));
}
export const getUserByEmail = async (email: string) => {
    return await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.email, email));
}
// export const getUserByKinde = async (id: string) => {
//     return await db.select({ id: users.id, email: users.email }).from(users).where(eq(users?.kinde_id, id));
// }


export const createUser = async (user: {

    email: string;
    kinde_id: string;
    kinde_name: string;
    company_id: number;

}) => {
    return await db.insert(users).values(user).returning({
        id: users.id,
        email: users.email,
        name: users.kinde_name
    });
}
export const updateUser = async (user: {

    email?: string;
    kinde_id?: string;
    kinde_name?: string;
    company_id?: number;


}, id: number) => {
    return await db.update(users).set(user).where(eq(users.id, id)).returning({
        id: users.id,
        email: users.email,
        name: users.kinde_name
    });
}


// create a property listing
export const createProperty = async (propertydata: InsertPropety, image: string[], features: number[]) => {
    return await db.transaction(async (tx) => {
        const [newproperty] = await tx.insert(property).values({
            name: propertydata.name,
            price: propertydata.price,
            area: propertydata.area,
            state: propertydata.state,
            country: propertydata.country,
            pricepermonth: propertydata.pricepermonth,
            propertyType: propertydata.propertyType,
            featured: propertydata.featured,
            location: propertydata.location,
            size: propertydata.size,
            saleType: propertydata.saleType,
            street_address: propertydata.street_address,
            distance: propertydata.distance,
            city: propertydata.city,
            description: propertydata.description,
            bedrooms: propertydata.bedrooms
        }).returning({
            id: property.id,
            name: property.name

        });

        // Insert images and return their IDs
        const insertedImages = await tx
            .insert(propertyimages)
            .values(
                image.map((img: string) => ({
                    property_id: newproperty.id,
                    url: img,
                }))
            )




        let featobj = features.map(feat => {
            return {
                property_id: newproperty.id,
                features_id: feat
            }
        })

        await tx.insert(propertytofeatures).values([...featobj])

        return newproperty
    })
}


export const getproperties = async () => {
    // const images= await db.select().from(propertyimages).innerJoin(property, eq(property.id, propertyimages.property_id))
    return await db.query.property.findMany({
        with: {
            location: true,
            propertytype:{
                columns:{
                    name:true
                }
            },
            features: {
                columns: {},
                with: {
                    features: {
                        columns: {
                            name: true
                        }
                    }
                }

            },
            images: {
                columns: {
                    url: true
                }
            }
        }
    })
}



export const getProperty = async (id: number) => {
    return await db.query.property.findFirst({
        where: eq(property.id, id),
        with: {
            location: true,
            features: {
                columns: {},
                with: {
                    features: {
                        columns: {
                            name: true
                        }
                    }
                }

            },
            images: {
                columns: {
                    url: true
                }
            }
        }
    })
}


// update a property listing
export const updateProperty = async (propertydata: InsertPropety, image: string[], features: number[], id: number) => {
    return await db.transaction(async (tx) => {
        const [updatedproperty] = await tx.update(property).set(
            propertydata
        ).where(eq(property.id, id))
            .returning({
                id: property.id,
                name: property.name

            });


        await tx.delete(propertyimages).where(eq(propertyimages.property_id, id))

        // Insert images and return their IDs
        const insertedImages = await tx
            .insert(propertyimages)
            .values(
                image.map((img: string) => ({
                    property_id: updatedproperty.id,
                    url: img,
                }))
            )


        await tx.delete(propertytofeatures).where(eq(propertytofeatures.property_id, id))


        let featobj = features.map(feat => {
            return {
                property_id: updatedproperty.id,
                features_id: feat
            }
        })

        await tx.insert(propertytofeatures).values([...featobj])

        return updatedproperty
    })
}




export const deleteproperty = async(id:number)=>{
    return await db.delete(property).where(eq(property.id, id))
}


///// create a company
export const createCompany = async (companydata:InsertCompany) => {
    return await db.transaction(async (tx) => {
        const newcompany = await tx.insert(company).values(companydata);
        return newcompany
    })
}
export const updateCompany = async (companydata:InsertCompany, id:number) => {
    return await db.transaction(async (tx) => {
        const updatecompany = await tx.update(company).set(companydata).where(eq(company.id, id));
        return updatecompany
    })
}
export const getCompany = async (id:number) => {
    return await db.query.company.findMany({
        where:eq(company.id, id)
    })
}
export const getCompanies = async () => {
    return await db.query.company.findMany()
}

export const deleteCompany = async (id:number) => {
    return await db.delete(company).where(eq(company.id, id))
}



// location
export const createLocation = async (locationdata:InsertLocation) => {
    return await db.transaction(async (tx) => {
        const newlocation = await tx.insert(location).values(locationdata);
        return newlocation
    })
}
export const updateLocation = async (locationdata:InsertLocation, id:number) => {
    return await db.transaction(async (tx) => {
        const updatelocation = await tx.update(location).set(locationdata).where(eq(location.id, id));
        return updatelocation
    })
}
export const getLocation = async (id:number) => {
    return await db.query.location.findMany({
        where:eq(location.id, id)
    })
}
export const getLocations = async () => {
    return await db.query.location.findMany()
}

export const deleteLocation = async (id:number) => {
    return await db.delete(location).where(eq(location.id, id))
}




// propertytypes
export const createpropertytypes = async (propertytypesdata:InsertPropetyType) => {
    return await db.transaction(async (tx) => {
        const newpropertytypes = await tx.insert(propertytypes).values(propertytypesdata);
        return newpropertytypes
    })
}
export const updatepropertytypes = async (propertytypesdata:InsertPropetyType, id:number) => {
    return await db.transaction(async (tx) => {
        const updatepropertytypes = await tx.update(propertytypes).set(propertytypesdata).where(eq(propertytypes.id, id));
        return updatepropertytypes
    })
}
export const getpropertytype = async (id:number) => {
    return await db.query.propertytypes.findMany({
        where:eq(propertytypes.id, id)
    })
}
export const getpropertytypes = async () => {
    return await db.query.propertytypes.findMany()
}

export const deletepropertytypes = async (id:number) => {
    return await db.delete(propertytypes).where(eq(propertytypes.id, id))
}



// property features
export const createpropertyfeatures = async (propertyfeaturesdata:InsertFeatures) => {
    return await db.transaction(async (tx) => {
        const newpropertyfeatures = await tx.insert(propertyfeatures).values(propertyfeaturesdata);
        return newpropertyfeatures
    })
}
export const updatepropertyfeatures = async (propertyfeaturesdata:InsertFeatures, id:number) => {
    return await db.transaction(async (tx) => {
        const updatepropertyfeatures = await tx.update(propertyfeatures).set(propertyfeaturesdata).where(eq(propertyfeatures.id, id));
        return updatepropertyfeatures
    })
}
export const getpropertyfeature = async (id:number) => {
    return await db.query.propertyfeatures.findMany({
        where:eq(propertyfeatures.id, id)
    })
}
export const getpropertyfeatures = async () => {
    return await db.query.propertyfeatures.findMany()
}

export const deletepropertyfeatures = async (id:number) => {
    return await db.delete(propertyfeatures).where(eq(propertyfeatures.id, id))
}


export const deletebulkpropertyfeatures = async (features:any[]) => {
    return await db.transaction(async(tx)=>{
        features.forEach(element => {
            tx.delete(propertyfeatures).where(eq(propertyfeatures.id, element))
        });
    })
}



// company offices
export const createcompanyoffices = async (companyofficesdata:InsertOffices) => {
    return await db.transaction(async (tx) => {
        const newcompanyoffices = await tx.insert(companyOffices).values(companyofficesdata);
        return newcompanyoffices
    })
}
export const updatecompanyoffices = async (companyofficesdata:InsertOffices, id:number) => {
    return await db.transaction(async (tx) => {
        const updatecompanyoffices = await tx.update(companyOffices).set(companyofficesdata).where(eq(companyOffices.id, id));
        return updatecompanyoffices
    })
}
export const getcompanyoffices = async (id:number) => {
    return await db.query.companyOffices.findMany({
        where:eq(companyOffices.id, id)
    })
}
export const getcompanyoffice = async (id:number) => {
    return await db.query.companyOffices.findMany()
}

export const deletecompanyoffices = async (id:number) => {
    return await db.delete(companyOffices).where(eq(companyOffices.id, id))
}


