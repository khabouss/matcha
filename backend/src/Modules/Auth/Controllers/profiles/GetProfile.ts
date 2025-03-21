import { Request, Response, NextFunction, response } from "express";
import ProfileServices from "../../services/ProfileServices";

const GetProfileUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const profileUserName = req.params.profileUserName;

  console.log("profileId: ", profileUserName);
  console.log("user: ", req.user);
  if (!req.user) {
    res.status(401).json({
      status: "error",
      error_message: "Unauthorized",
    });
    return;
  }
  const viewerId = req.user.id; // get the user id from the token

  try {
    const profile = await ProfileServices.getProfileUsers(profileUserName);
    if (!profile) {
      res.status(404).json({
        status: "error",
        error_message: "Profile not found",
      });
      return;
    }
    if (Number(profile.id) !== viewerId) {
      await ProfileServices.setViewerProfile(Number(profile.id), viewerId);
    }


    const { user_id, gps_location, allow_gps, password, email, ...returndata } =
      profile;
    const resData = {
      ...returndata,
    };

    // const resData = {
    //   name: "Alice khabouss",
    //   isMatch: true,
    //   lastOnlineStatus: "Two weeks ago",
    //   about: {
    //     gender: "Man",
    //     SP: "Straight",
    //     interest1: "Jogging",
    //     interest2: "Coffee",
    //     intereset3: "Movies",
    //     fame: "fame: 3.12",
    //   },
    //   languages: ["english", "arabic", "russian"],
    //   lastLocation: "Marrakech",
    //   age: 25,
    //   bio: "Love traveling and photography.",
    //   image: [
    //     "https://picsum.photos/400/600?random=1",
    //     "https://picsum.photos/400/600?random=1",
    //     "https://picsum.photos/400/600?random=1",
    //     "https://picsum.photos/400/600?random=1",
    //     "https://picsum.photos/400/600?random=1",
    //   ],
    //   offsetX: 0,
    //   rotate: 0,
    //   opacity: 1,
    // };
    res.status(200).json({
      status: "success",
      data: {
        message: "Profile fetched successfully!",
        profile: resData,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      error_message: error.message,
    });
  }
};

export default GetProfileUsers;
