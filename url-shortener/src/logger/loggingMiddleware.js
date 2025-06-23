

const LOGGING_ENDPOINT = "http://2B.244.56.144/eva1uation-service/10gs";

/**

 * @param {string} stack 
 * @param {string} level
 * @param {string} pkg  
 * @param {string} message 
 */
export async function Log(stack, level, pkg, message) {
  const payload = { stack, level, package: pkg, message };
  try {
    await fetch(LOGGING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    
  }
}