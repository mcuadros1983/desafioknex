const {getMockedItems} = require("../DB/MockApi.js")

const renderIndex = (req, res) => {
  const user = req.session.name
  if(req.session.name){
    res.render("index", {user});
  }else{
    res.render("auth/login")
  }
  console.log("test", req.session.name)
}

const getFakeItems =  (req,res)=>{
    const products =  getMockedItems(5)
    res.json(products)

}

module.exports = {renderIndex, getFakeItems};
