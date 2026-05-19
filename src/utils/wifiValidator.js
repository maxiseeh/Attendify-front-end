// checks if the user is on campus wifi
// browsers cant read the actual SSID so we ping a local endpoint instead
// TODO: find a better way to do this

export async function validateWifi() {
  try {
    // if this endpoint responds, we're on campus network
    const res = await fetch('http://192.168.1.1', { method: 'HEAD', signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}
