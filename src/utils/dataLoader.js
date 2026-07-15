const DATA_BASE = '/data'
const MANIFEST_URL = `${DATA_BASE}/manifest.json`

const CONTENT_TYPE_LABELS = {
  12: '관광지',
  14: '문화시설',
  15: '축제공연행사',
  25: '여행코스',
  28: '레포츠',
  32: '숙박',
  38: '쇼핑'
}

const SEOUL_DISTRICTS = [
  '종로구',
  '중구',
  '용산구',
  '성동구',
  '광진구',
  '동대문구',
  '중랑구',
  '성북구',
  '강북구',
  '도봉구',
  '노원구',
  '은평구',
  '서대문구',
  '마포구',
  '양천구',
  '강서구',
  '구로구',
  '금천구',
  '영등포구',
  '동작구',
  '관악구',
  '서초구',
  '강남구',
  '송파구',
  '강동구'
]

let cachedItems = null
let cachedManifest = null

async function fetchJson(url) {
  const res = await fetch(encodeURI(url))
  if (!res.ok) {
    throw new Error(`Failed to load ${url}`)
  }
  return res.json()
}

function toNumber(value) {
  const number = Number.parseFloat(value)
  return Number.isFinite(number) ? number : null
}

export function extractDistrict(address = '') {
  return SEOUL_DISTRICTS.find((district) => address.includes(district)) || '미분류'
}

export function normalizeItem(item, source = {}) {
  const contentTypeId = String(item.contenttypeid || item.contentTypeId || source.contentTypeId || '')
  const title = item.title || item.name || '제목 없음'
  const address = item.addr1 || item.address || ''
  const addressDetail = item.addr2 || item.addressDetail || ''
  const category = source.category || CONTENT_TYPE_LABELS[contentTypeId] || item.category || '기타'

  return {
    id: String(item.contentid || item.id || `${contentTypeId}-${title}`),
    contentTypeId,
    category,
    title,
    name: title,
    address: address || '주소 정보 없음',
    addressDetail,
    tel: item.tel || '전화번호 정보 없음',
    image: item.firstimage || item.image || '',
    thumbnail: item.firstimage2 || item.thumbnail || item.firstimage || item.image || '',
    mapx: toNumber(item.mapx),
    mapy: toNumber(item.mapy),
    district: extractDistrict(address),
    eventStartDate: item.eventstartdate || null,
    eventEndDate: item.eventenddate || null,
    description: item.description || address || category,
    raw: item
  }
}

export async function loadManifest() {
  if (cachedManifest) return cachedManifest

  try {
    cachedManifest = await fetchJson(MANIFEST_URL)
  } catch (error) {
    cachedManifest = [
      {
        file: 'sample.json',
        category: '샘플',
        contentTypeId: 'sample'
      }
    ]
  }

  return cachedManifest
}

export async function loadAllData() {
  if (cachedItems) return cachedItems

  const manifest = await loadManifest()
  const groups = await Promise.all(
    manifest.map(async (source) => {
      try {
        const json = await fetchJson(`${DATA_BASE}/${source.file}`)
        const items = Array.isArray(json) ? json : json.items || []
        return items.map((item) => normalizeItem(item, source))
      } catch (error) {
        console.warn(`LocalHub data load skipped: ${source.file}`, error)
        return []
      }
    })
  )

  cachedItems = groups.flat()
  return cachedItems
}

export async function loadSampleData() {
  return loadAllData()
}

export async function getAllItems() {
  return loadAllData()
}

export async function getByCategory(category) {
  const items = await loadAllData()
  if (!category || category === 'all') return items
  return items.filter((item) => item.category === category || item.contentTypeId === String(category))
}

export async function searchItems(keyword, options = {}) {
  const items = await getByCategory(options.category)
  const query = String(keyword || '').trim().toLowerCase()
  if (!query) return items

  return items.filter((item) =>
    [item.title, item.category, item.address, item.tel, item.district]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
}

export function aggregateByCategory(items = []) {
  return aggregateBy(items, 'category')
}

export function aggregateByDistrict(items = []) {
  return aggregateBy(items, 'district')
}

export function aggregateBy(items = [], field) {
  return items.reduce((acc, item) => {
    const key = item[field] || '미분류'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

export async function getDashboardStats() {
  const items = await loadAllData()
  return {
    total: items.length,
    categoryCounts: aggregateByCategory(items),
    districtCounts: aggregateByDistrict(items),
    categories: Array.from(new Set(items.map((item) => item.category))).sort()
  }
}

export function toChatContext(items = [], limit = 5) {
  return items.slice(0, limit).map((item) => ({
    id: item.id,
    title: item.title,
    name: item.title,
    category: item.category,
    address: item.address,
    tel: item.tel
  }))
}
