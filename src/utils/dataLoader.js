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

const CHAT_CATEGORY_ALIASES = [
  { category: '축제공연행사', terms: ['축제', '공연', '행사', '페스티벌', '이벤트'] },
  { category: '관광지', terms: ['관광', '관광지', '명소', '가볼만한', '가볼 만한', '추천지'] },
  { category: '문화시설', terms: ['문화', '문화시설', '박물관', '미술관', '전시', '공연장'] },
  { category: '여행코스', terms: ['여행코스', '코스', '일정', '동선', '루트'] },
  { category: '레포츠', terms: ['레포츠', '스포츠', '액티비티', '체험'] },
  { category: '숙박', terms: ['숙박', '호텔', '게스트하우스', '펜션', '잠잘'] },
  { category: '쇼핑', terms: ['쇼핑', '시장', '상점', '매장', '몰'] }
]

const CHAT_STOP_WORDS = [
  '서울',
  '서울시',
  '알려줘',
  '알려',
  '추천',
  '추천해줘',
  '해줘',
  '찾아줘',
  '검색',
  '어디',
  '위치',
  '정보',
  '목록',
  '있는',
  '있어',
  '좀',
  '관련',
  '기반'
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

export async function getByDistrict(district) {
  const items = await loadAllData()
  return items.filter((item) => item.district === district)
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

export function analyzeChatQuestion(question = '') {
  const query = String(question || '').trim()
  const lowerQuery = query.toLowerCase()
  const district = SEOUL_DISTRICTS.find((name) => query.includes(name)) || ''
  const category = CHAT_CATEGORY_ALIASES.find((entry) => entry.terms.some((term) => lowerQuery.includes(term)))?.category || ''
  const aliasTerms = CHAT_CATEGORY_ALIASES.flatMap((entry) => entry.terms)
  const removableWords = [...CHAT_STOP_WORDS, ...SEOUL_DISTRICTS, ...aliasTerms]
  const keywords = query
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2)
    .filter((word) => !removableWords.some((stopWord) => word.includes(stopWord) || stopWord.includes(word)))
  const expandedKeywords = [
    ...keywords,
    lowerQuery.includes('음식') ? '음식' : '',
    lowerQuery.includes('맛집') ? '맛집' : '',
    lowerQuery.includes('식당') ? '식당' : '',
    lowerQuery.includes('카페') ? '카페' : ''
  ].filter(Boolean)

  return { query, district, category, keywords: Array.from(new Set(expandedKeywords)) }
}

function normalizeText(value) {
  return String(value || '').toLowerCase()
}

function formatDate(value) {
  const date = String(value || '')
  if (!/^\d{8}$/.test(date)) return ''
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
}

function chatSearchText(item) {
  return [
    item.title,
    item.category,
    item.address,
    item.addressDetail,
    item.tel,
    item.district,
    item.description,
    item.raw?.eventplace,
    item.raw?.program,
    item.raw?.playtime,
    item.raw?.usetimefestival,
    item.raw?.sponsor1
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export async function searchChatItems(question, options = {}) {
  const limit = Number(options.limit || 12)
  const intent = analyzeChatQuestion(question)
  const items = await loadAllData()
  const pool = items.filter((item) => {
    if (intent.category && item.category !== intent.category) return false
    if (intent.district && item.district !== intent.district) return false
    return true
  })

  const candidates = pool.map((item, index) => {
    const text = chatSearchText(item)
    let score = Math.max(0, items.length - index) / items.length

    if (intent.category && item.category === intent.category) score += 80
    if (intent.district && item.district === intent.district) score += 80
    if (normalizeText(item.title).includes(normalizeText(intent.query))) score += 40

    intent.keywords.forEach((keyword) => {
      if (text.includes(normalizeText(keyword))) score += 15
    })

    if (item.eventStartDate) score += 3
    if (item.thumbnail) score += 1

    return { item, score }
  })

  const hasKeyword = intent.keywords.length > 0
  const scored = hasKeyword
    ? candidates.filter(({ item, score }) => score > 4 || intent.keywords.some((keyword) => chatSearchText(item).includes(normalizeText(keyword))))
    : candidates

  return scored
    .sort((a, b) => {
      if (intent.category === '축제공연행사') {
        const dateA = Number(a.item.eventStartDate || 0)
        const dateB = Number(b.item.eventStartDate || 0)
        if (dateA !== dateB) return dateB - dateA
      }
      return b.score - a.score
    })
    .slice(0, limit)
    .map(({ item }) => item)
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
    type: 'place',
    id: item.id,
    title: item.title,
    name: item.title,
    category: item.category,
    district: item.district,
    address: item.address,
    tel: item.tel,
    eventStartDate: formatDate(item.eventStartDate),
    eventEndDate: formatDate(item.eventEndDate),
    eventPlace: item.raw?.eventplace || '',
    playtime: item.raw?.playtime || '',
    fee: item.raw?.usetimefestival || '',
    program: item.raw?.program ? String(item.raw.program).slice(0, 600) : '',
    description: item.description
  }))
}

export async function getItemById(id) {
  const items = await loadAllData()
  return items.find((item) => item.id === String(id)) || null
}
