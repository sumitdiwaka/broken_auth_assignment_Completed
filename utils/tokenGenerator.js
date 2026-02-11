const crypto = require("crypto");
const { getSecretFromDB } = require("./mockDb");

const generateToken = async (email) => {
  try {
    const secret = await getSecretFromDB();

    // Ensure email is provided
    if (!email) throw new Error("Email is required for token generation");

    return crypto
      .createHmac("sha256", secret)
      .update(email)
      .digest("base64");
  } catch (error) {
    //  Log the error and throw it so the calling function knows it failed
    console.error("Token Generation Error:", error.message);
    throw new Error("Could not generate secure token");
  }
};

module.exports = { generateToken };