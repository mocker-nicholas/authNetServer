export const sessionStuff = (req, res, next) => {
  console.log(req.session.id);
  next();
}