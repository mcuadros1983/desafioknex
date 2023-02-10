const {getMockedItems} = require("../DB/MockApi.js")

const renderIndex = (req, res) => {
  res.render("index");
};

const getFakeItems =  (req,res)=>{
    const products =  getMockedItems(5)
    res.json(products)

}

module.exports = {renderIndex, getFakeItems};
