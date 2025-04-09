const servers = (serverId) => {
  const parts = serverId.split("-");
  if (parts.length !== 3) return null;

  const id = parseInt(parts[1], 10);
  const quality = parts[2];
  const realId = parseInt(parts[0], 16);

  const payload = { id: realId, i: id, q: quality };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
};

export default servers;
