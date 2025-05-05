import followAndFollowerModule from "../Module/FollowAndFollowerModel.js";
import {
  errorHelper,
  successHelper,
  newValidatorHelper,
} from "../Helper/globalHelper.js";
import UserModel from "../Module/UserModule.js";

import mongoose from "mongoose";

const doFollow = async (req, res) => {
  try {
    const loggedUserId = req.userId;
    const { userId } = req.body;

    const rules = {
      userId: "required|string",
    };

    const isValid = await newValidatorHelper(req.body, rules);

    if (!isValid.success) {
      return errorHelper(res, isValid.errors);
    }

    // ------------checking if user pres then unfollow him
    const follower = await followAndFollowerModule.findOneAndDelete({
      Follow: new mongoose.Types.ObjectId(userId),
    });

    if (follower) {
      return successHelper(res, "Unfollowed", 200);
    }

    // ----------------- if  follow code

    const newFollower = new followAndFollowerModule({
      Follow: new mongoose.Types.ObjectId(userId),
      Following: loggedUserId,
    });

    await newFollower.save();

    return successHelper(res, "Following", 200);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// ---it will result all follower related details.
const getFollow = async (req, res) => {
  try {
    const loggedUserId = req.userId;

    const followers = await followAndFollowerModule
      .find({ Following: loggedUserId })
      .populate("Following Follow");

    return successHelper(res, "Followers", 200, followers);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// get a specific user related details with message have done follow or not

const userDetails = async (req, res) => {
  const loggedUserId = req.userId;
  const { userId } = req.query;

  try {


    const [user] = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "followandfollowers",
          let: { currentUserID: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$Follow", "$$currentUserID"] },
                    {
                      $eq: [
                        "$Following",
                        new mongoose.Types.ObjectId(loggedUserId),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "didFollow",
        },
      },
      {
        $addFields: {
          isFollow: { $gt: [{ $size: "$didFollow" }, 0] }, // If user has liked, isLike = true
        },
      },
    ]);

    return successHelper(res, "User Details", 200, user);
  } catch (err) {
    return errorHelper(res, err);
  }
};

export { doFollow, getFollow, userDetails };
