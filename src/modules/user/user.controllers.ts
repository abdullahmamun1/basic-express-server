import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.services";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body);
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Created",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users, retrieved succesfully",
      data: result.rows,
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users, retrieved succesfully",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string);
    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: " User not found",
        data: {},
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "A User retrieved succesfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id, " ");
  // console.log(name, password, age, is_active);
  try {
    const result = await userService.updateUserFromDB(id as string, req.body);
    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: " User not found",
        data: {},
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User updated succesfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id as string);
    // console.log(result, id);
    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: " User not found",
        data: {},
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted succesfully",
      data: {},
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
