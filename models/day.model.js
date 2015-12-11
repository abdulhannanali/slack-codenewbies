var daySchema = new Schema({
  creator: {type: Schema.Types.ObjectId, ref: "User"},
  description: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model("Day", daySchema);
