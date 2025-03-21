const AVAILABILITY = ["AVAILABLE", "UNAVAILABLE"]

async function handleConnection(conn: Deno.Conn) {
  const textEncoder = new TextEncoder()
  const textDecoder = new TextDecoder()
  const buffer = new Uint8Array(1024)
  while (true) {
    const bytesRead = await conn.read(buffer)
    if (bytesRead === null) {
      console.error("Connection refused.")
      break
    } else {
      const requestText = textDecoder.decode(buffer.slice(0, bytesRead))
      console.debug(`Request: ${requestText}`)
      const responseTexts: string[] = []
      if (requestText === "* PING\n") {
        responseTexts.push("* PONG 5000")
      }
      const now = new Date()
      responseTexts.push(`${now.toISOString()}|${AVAILABILITY[0]}`)
      const responseText = responseTexts.join("\n") + "\n"
      console.debug(`Response: ${responseText}`)
      await conn.write(textEncoder.encode(responseText))
    }
  }
  conn.close()
}

const listener = Deno.listen({ port: 7878 })
for await (const conn of listener) {
  handleConnection(conn)
}