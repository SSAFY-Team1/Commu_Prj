export async function loadSampleData() {
  try {
    const res = await fetch('/data/sample.json')
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    return []
  }
}
