import { NextFunction, Request, Response } from "express";
import express from "express"
import { prisma } from "utils/prismaconnection";



export const getUsers = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const allUsers = await prisma.intimeUser.findMany(); 
      res.status(200).json(allUsers); 
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };