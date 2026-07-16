const KEY = 'localhub_posts'

export const DISTRICT_OPTIONS = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구'
]

export const DEFAULT_DISTRICT = '중구'

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean)
  }

  return String(tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function normalizeDistrict(district) {
  return DISTRICT_OPTIONS.includes(district) ? district : DEFAULT_DISTRICT
}

function normalizePost(post) {
  return {
    id: String(post.id || Date.now()),
    title: post.title || '',
    content: post.content || '',
    password: post.password || '',
    created: post.created || new Date().toLocaleString(),
    district: normalizeDistrict(post.district),
    region: '서울/경기',
    category: post.category || '자유',
    tags: normalizeTags(post.tags),
    image: post.image || '',
    imageName: post.imageName || '',
    views: Number(post.views ?? 0),
    likes: Number(post.likes ?? 0),
    bookmarks: Number(post.bookmarks ?? 0),
    liked: Boolean(post.liked),
    bookmarked: Boolean(post.bookmarked)
  }
}

export function getPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(posts) ? posts.map(normalizePost) : []
  } catch (error) {
    return []
  }
}

export function savePost(post) {
  const posts = getPosts()
  posts.unshift(normalizePost(post))
  localStorage.setItem(KEY, JSON.stringify(posts))
}

export function updatePost(id, changes) {
  const posts = getPosts()
  const index = posts.findIndex((post) => post.id === id)
  if (index >= 0) {
    posts[index] = normalizePost({ ...posts[index], ...changes })
    localStorage.setItem(KEY, JSON.stringify(posts))
  }
}

export function incrementViews(id) {
  const posts = getPosts()
  const index = posts.findIndex((post) => post.id === id)
  if (index >= 0) {
    posts[index] = normalizePost({ ...posts[index], views: posts[index].views + 1 })
    localStorage.setItem(KEY, JSON.stringify(posts))
  }
}

export function toggleLike(id) {
  const posts = getPosts()
  const index = posts.findIndex((post) => post.id === id)
  if (index >= 0) {
    const target = posts[index]
    const liked = !target.liked
    posts[index] = normalizePost({
      ...target,
      liked,
      likes: liked ? target.likes + 1 : Math.max(0, target.likes - 1)
    })
    localStorage.setItem(KEY, JSON.stringify(posts))
  }
}

export function toggleBookmark(id) {
  const posts = getPosts()
  const index = posts.findIndex((post) => post.id === id)
  if (index >= 0) {
    const target = posts[index]
    const bookmarked = !target.bookmarked
    posts[index] = normalizePost({
      ...target,
      bookmarked,
      bookmarks: bookmarked ? target.bookmarks + 1 : Math.max(0, target.bookmarks - 1)
    })
    localStorage.setItem(KEY, JSON.stringify(posts))
  }
}

export function deletePost(id) {
  const posts = getPosts().filter((post) => post.id !== id)
  localStorage.setItem(KEY, JSON.stringify(posts))
}

export function clearPosts() {
  localStorage.removeItem(KEY)
}
