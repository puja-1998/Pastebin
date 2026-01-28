/*
  This function allows automated tests to control "current time"
  using headers instead of real system time.
*/
export const getNow = (req) => {
  // If test mode is enabled
  if (process.env.TEST_MODE === "1") {
    const testTime = req.headers["x-test-now-ms"];

    // If header is provided, use it as current time
    if (testTime) {
      return new Date(Number(testTime));
    }
  }

  // Otherwise, use real system time
  return new Date();
};
