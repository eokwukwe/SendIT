/** Authenications */
export default class Authenications {
  /**
   * Authenticate Admin
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  static async authAdmin(req, res, next) {
    const { usertype } = req.user;

    if (usertype !== 'admin') {
      return res.status(403).json({
        message: 'access denied. You are not authorised to view this content'
      });
    }
    next();
  }

  /**
   * Authenticate User
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  static async authUser(req, res, next) {
    const { usertype } = req.user;

    if (usertype !== 'user') {
      return res.status(403).json({
        message: 'access denied. You are not authorised to view this content'
      });
    }
    next();
  }
}
