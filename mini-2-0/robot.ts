const AVAILABILITY = ["AVAILABLE", "UNAVAILABLE"]

async function handleConnection(conn: Deno.Conn) {
  const textEncoder = new TextEncoder()
  const textDecoder = new TextDecoder()
  const buffer = new Uint8Array(4096)
  let position = 0
  while (true) {
    const bytesRead = await conn.read(buffer)
    if (bytesRead === null) {
      console.error("Connection refused.")
      break
    } else {
      const requestText = textDecoder.decode(buffer.slice(0, bytesRead))
      let responseText: string;
      console.debug(`Request: ${requestText}`)
      if (requestText === "* PING\n") {
        responseText = "* PONG 1000"
        console.debug(`Response: ${responseText}`)
        await conn.write(textEncoder.encode(`${responseText}\n`))
      }
      const events: string[] = [
        new Date().toISOString(),
        "avail",
        AVAILABILITY[0],
        "position",
        `${position++}`,
      ]
      responseText = events.join("|")
      console.debug(`Response: ${responseText}`)
      await conn.write(textEncoder.encode(`${responseText}\n`))
    }
  }
  conn.close()
}

const listener = Deno.listen({ port: 7878 })
for await (const conn of listener) {
  handleConnection(conn)
}