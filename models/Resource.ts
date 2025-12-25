import { Schema, model, models } from "mongoose";

const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Text search index
ResourceSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

export default models.Resource || model("Resource", ResourceSchema);
