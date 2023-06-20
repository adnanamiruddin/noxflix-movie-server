import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";

const signUp = async (req, res) => {
  try {
    const { username, displayName, password } = req.body;

    const checkUser = await userModel.findOne({ username });
    if (checkUser)
      return responseHandler.badRequest(res, "Username already exist");

    const user = new userModel();

    user.username = username;
    user.displayName = displayName;
    user.setPassword(password);

    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.SECRET_TOKEN,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel
      .findOne({ username })
      .select("id username displayName password salt");

    if (!user) return responseHandler.badRequest(res, "User does not exist");

    if (!user.validatePassword(password))
      return responseHandler.badRequest(res, "Wrong password!");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.SECRET_TOKEN,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select("id password salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validatePassword(password))
      return responseHandler.badRequest(res, "Wrong password!");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
    responseHandler.error(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notFound(res);

    responseHandler.ok(res, user);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { signUp, signIn, updatePassword, getInfo };
