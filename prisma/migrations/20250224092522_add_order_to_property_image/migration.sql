-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('User', 'Admin', 'SuperAdmin');

-- CreateEnum
CREATE TYPE "PropertySaleType" AS ENUM ('Sale', 'Rent');

-- CreateEnum
CREATE TYPE "RequestAccessStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- CreateTable
CREATE TABLE "IntimeUser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "IntimeUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "streetAddress2" TEXT,
    "city" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone2" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT 'doe@intime.com',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "saleType" "PropertySaleType" NOT NULL DEFAULT 'Sale',
    "featured" BOOLEAN NOT NULL,
    "propertyTypeId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pricePerMonth" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "bedrooms" DOUBLE PRECISION,
    "bathrooms" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyToFeatures" INTEGER[],

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyFeature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" JSONB,
    "userId" INTEGER NOT NULL,
    "onBehalfOf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestAccess" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL DEFAULT 'doe@intime.com',
    "status" "RequestAccessStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntimeUser_username_key" ON "IntimeUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "IntimeUser_email_key" ON "IntimeUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_name_key" ON "Property"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_name_key" ON "Blog"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_name_key" ON "Testimonial"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RequestAccess_email_key" ON "RequestAccess"("email");

-- AddForeignKey
ALTER TABLE "IntimeUser" ADD CONSTRAINT "IntimeUser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "IntimeUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "IntimeUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
