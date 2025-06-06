// Type for the result of model.generateContent
export interface GenerateContentResult {
  response: {
    text(): Promise<string>;
  };
}
