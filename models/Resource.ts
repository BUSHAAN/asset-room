import { Schema, model, models } from "mongoose";

/** Case-insensitive title order (A/a together). Must match list queries. */
export const TITLE_COLLATION = { locale: "en", strength: 2 } as const;

const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    previewImage: { type: String },
  },
  { timestamps: true }
);

// Text search index
ResourceSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

ResourceSchema.index({ title: 1 }, { collation: TITLE_COLLATION });

export default models.Resource || model("Resource", ResourceSchema);
