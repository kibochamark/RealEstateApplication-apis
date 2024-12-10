// @ts-nocheck
import { decimal, integer, json, pgEnum, pgTable, primaryKey, serial, text, timestamp, varchar, boolean, doublePrecision, numeric} from "drizzle-orm/pg-core";
import { InferModel, SQL, relations } from "drizzle-orm";
import exp from "constants";
import { jsonb } from "drizzle-orm/pg-core";
import { features } from "process";





// Users Table
export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    kinde_id: varchar("kinde_id").unique(),
    kinde_name: varchar("kinde_name").unique(),
    company_id: integer('company_id').references(() => company.id).unique(),
    email: text('email').notNull().unique(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});


// companies
export const company = pgTable("companies", {
    id: serial('id').primaryKey(),
    company_name: text("company_name").notNull(),
    street_address: text("address1").notNull(),
    street_address2: text("address2"),
    location: integer("location_id").references(() => location.id),
    phone: text("company-telephone").notNull(),
    phone2: text("company-telephone2").notNull(),
    email: text("email").notNull().default("doe@intime.com"),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})


// geolocation details
export const location = pgTable("LocationDetails", {
    id: serial('id').primaryKey(),
    longitude: text("long").notNull(),
    latitude: text("lat"),
    locationname: text("location_name").notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})


// property types
export const propertytypes = pgTable("Propertytypes", {
    id: serial('id').primaryKey(),
    name: text("name").notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})






// property features
export const propertyfeatures = pgTable("PropertyFeatures", {
    id: serial('id').primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})


// offices associated to a company
export const companyOffices = pgTable("companyOffices", {
    id: serial('id').primaryKey(),
    name: text("name").notNull(),
    location: integer("location_id").references(() => location.id),
    company: integer("company_id").references(() => company.id),
    street_address: text("address1").notNull(),
    street_address2: text("address2"),
    phone: text("company-telephone").notNull(),
    phone2: text("company-telephone2").notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})



export const propertySaleType = pgEnum('propertysaletype', ['Sale', 'Rent'])



export const property = pgTable("Property", {
    id: serial('id').primaryKey(),
    name: text("name").notNull().unique(),
    description: varchar("description").notNull(),
    location: integer("location").references(() => location.id),
    street_address: text("address").notNull(),
    city: text("city"),
    area:varchar("area").notNull(),
    state:varchar("state").notNull(),
    country:varchar("country").notNull(),
    saleType:propertySaleType('saleType').default("Sale"),
    featured:boolean("featured"),
    propertyType :integer("type").references(() => propertytypes.id),
    size: text("size").notNull(),
    distance: text("distance").notNull(),
    price: doublePrecision("price").default(0.00),
    pricepermonth:doublePrecision("pricepermonth").default(0.00),
    bedrooms:numeric("bedroom")
})



export const propertyRelations = relations(property, ({ many, one }) => ({
    images: many(propertyimages, {
        foreignKey: "property_id",
        references: property.id,
      }),
    features: many(propertytofeatures),
    propertytype:one(propertytypes, {fields: [property.propertyType], references: [propertytypes.id] }),
    location:one(location, {fields: [property.location], references: [location.id] })
}));


export const propertyimages = pgTable("propertyimages", {
    id: serial('id').primaryKey(),
    url: text("image_url").notNull(),
    public_id:text("image_public_id"),
    property_id: integer("property_id").references(() => property.id),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})







// many to many 
export const propertytofeatures = pgTable("propertytofeatures", {
    property_id: integer('property_id').references(() => property.id).notNull(),
    features_id: integer('fetures_id').references(() => propertyfeatures.id).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
    pk: primaryKey(table.property_id, table.features_id)
}));


// blog Table
export const blog = pgTable("blog", {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    image_url: text('image_url').notNull(),
    description: jsonb('description'),
    user:integer("user_id").references(()=> users.id).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

// testimonial
export const testimonial = pgTable("testimonial", {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    image_url: text('image_url'),
    description: jsonb('description'),
    user:integer("user_id").references(()=> users.id).notNull(),
    onbehalfof:text('useronbehalfname').notNull().unique(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});









// Relations
export const userRelations = relations(users, ({ one, many }) => ({
    company: one(company),
}));


export const companyRelations = relations(company, ({ one, many }) => ({
    offices: many(company),
    location:one(location, {fields: [company.location], references: [location.id] })
}));


export const officesRelations = relations(companyOffices, ({ one, many }) => ({
    location:one(location, {fields: [companyOffices.location], references: [location.id] })
}));



export const blogRelations = relations(blog, ({ one }) => ({
    user: one(users, {fields: [blog.user], references: [users.id] })
}));



export const testimonialRelations = relations(testimonial, ({ one }) => ({
    user: one(users, {fields: [testimonial.user], references: [users.id] })
}));

export const propertytofeaturesRelations = relations(propertytofeatures, ({ one }) => ({
    features: one(propertyfeatures, {
        fields: [propertytofeatures.features_id],
        references: [propertyfeatures.id]
    }),
    properties: one(property, {
        fields: [propertytofeatures.property_id],
        references: [property.id]
    })
}));


export const propertyimagesRelations = relations(propertyimages, ({ one }) => ({
    property: one(property, { fields: [propertyimages.property_id], references: [property.id] }),
}));




// Define types

export type User = InferModel<typeof users, 'select'> 
export type InsertUser = InferModel<typeof users, 'insert'>;

// export type Property = InferModel<typeof property, 'select'>;
// export type InsertProperty = InferModel<typeof property, 'insert'>;

export type Company = InferModel<typeof company, 'select'>;
export type InsertCompany = InferModel<typeof company, 'insert'>;

export type Location = InferModel<typeof location, 'select'>;
export type InsertLocation = InferModel<typeof location, 'insert'>;

export type Features = InferModel<typeof propertyfeatures, 'select'>;
export type InsertFeatures = InferModel<typeof propertyfeatures, 'insert'>;

export type Property = InferModel<typeof property, 'select'>;
export type InsertPropety = InferModel<typeof property, 'insert'>;

export type PropertyType = InferModel<typeof propertytypes, 'select'>;
export type InsertPropetyType = InferModel<typeof propertytypes, 'insert'>;

export type Offices = InferModel<typeof companyOffices, 'select'>;
export type InsertOffices = InferModel<typeof companyOffices, 'insert'>;

export type Blog = InferModel<typeof blog, 'select'>;
export type InsertBlog = InferModel<typeof blog, 'insert'>;

export type Testimonial = InferModel<typeof testimonial, 'select'>;
export type InsertTestimonial = InferModel<typeof testimonial, 'insert'>;

