const { getMockedItems } = require("../DB/MockApi.js");

const renderIndex = (req, res) => {
  const user = req.user
  console.log("user",user)
  res.render("index", { user });
};

const getFakeItems = (req, res) => {
  const products = getMockedItems(5);
  res.json(products);
};

module.exports = { renderIndex, getFakeItems };
