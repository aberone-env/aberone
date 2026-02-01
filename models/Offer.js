const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["restaurant", "food", "product"],
      required: true
    },

    refId: {
      type: String,
      required: true
    },

    discountPercent: {
      type: Number,
      default: 0
    },

    specialPrice: {
      type: Number
    },

    startDate: Date,
    endDate: Date,

    active: {
      type: Boolean,
      default: true
    },

    image: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//
// ===============================
// 🔹 Virtual: السعر المعروض
// ===============================
offerSchema.virtual("displayPrice").get(function () {
  if (this.specialPrice) {
    return {
      type: "special",
      value: this.specialPrice
    };
  }

  if (this.discountPercent && this.discountPercent > 0) {
    return {
      type: "discount",
      value: this.discountPercent
    };
  }

  return {
    type: "none",
    value: null
  };
});

//
// ===============================
// 🔹 Virtual: هل العرض ساري الآن؟
// ===============================
offerSchema.virtual("isValidNow").get(function () {
  const now = new Date();

  if (!this.active) return false;

  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;

  return true;
});

module.exports = mongoose.model("Offer", offerSchema);