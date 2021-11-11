module.exports = {
  create: {
    name: "string|empty:false",
    description: "string|optional",
    name: "string|optional",
    imageUrl: "string|optional",
    expiredAt: "date|optional"
  },
  update: {
    id: "string|empty:false",
    name: "string|empty:false|optional",
    description: "string|optional",
    name: "string|optional",
    imageUrl: "string|optional",
    expiredAt: "date|optional"
  },
  delete: {
    id: "string|empty:false"
  }
}