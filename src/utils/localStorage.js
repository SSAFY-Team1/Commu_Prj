const KEY = 'localhub_posts'

export const REGION_OPTIONS = ['서울/경기', '대전/충청', '구미/경북', '광주/전라', '부울경/경남']

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean)
  }

  return String(tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function normalizeRegion(region) {
  return REGION_OPTIONS.includes(region) ? region : REGION_OPTIONS[0]
}

function normalizePost(post) {
  return {
    id: String(post.id || Date.now()),
    title: post.title || '',
    content: post.content || '',
    password: post.password || '',
    created: post.created || new Date().toLocaleString(),
    region: normalizeRegion(post.region),
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
