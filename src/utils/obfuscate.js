function obfuscateServerId(base64) {
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
  
    if (!parsed.id || parsed.i == null || !parsed.q) {
      throw new Error("Missing fields in server data");
    }
  
    const idHex = parseInt(parsed.id).toString(16).toUpperCase().padStart(6, "0");
    const i = parsed.i;
    const q = parsed.q;
  
    return `${idHex}-${i}-${q}`;
  }
  
  module.exports = { obfuscateServerId }; 
  