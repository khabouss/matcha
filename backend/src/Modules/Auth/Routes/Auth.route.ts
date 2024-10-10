import { Router } from "express";

const attachAuthRoute = (router: Router) => {
  router.post("/login", (req, res) => {
    res.send("Login page");
  });

  router.post("/register", (req, res) => {
    res.send("Register page");
  });
};

export default attachAuthRoute;
