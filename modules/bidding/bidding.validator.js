module.exports = {
  create: {
    productId: "string|empty:false",
    amount: "number|min:0.1",
  },
  toggleAutoBid: {
    productId: "string|empty:false",
  }
}