module.exports = function prepareErrorMessage({
  message,
  telebotError
}) {
  return `Message: ${message}
  Bot error: ${JSON.stringify(telebotError)}`;
};
