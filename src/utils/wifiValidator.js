/**
 * Wifi Validation Utility
 * Note: Browser security prevents reading actual SSID. 
 * We use a "Network Ping" approach as a student-level workaround.
 */

export async function validateWifi() {
  try {
    // We try to fetch a specific local resource that only exists on campus wifi
    // Replace this with your actual campus local IP or gateway
    const res = await fetch('http://1.1.1.1', { 
      mode: 'no-cors', // standard workaround for cross-origin pings
      cache: 'no-cache',
      signal: AbortSignal.timeout(3000) 
    });
    
    // In a student project, if we get any response (even opaque), we assume we're online
    return true; 
  } catch (err) {
    console.log("WiFi Validation Check:", err.message);
    return false;
  }
}
wifiValidator.jsx